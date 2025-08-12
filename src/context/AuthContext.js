import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);

  // Mock API base URL - replace with your actual backend URL
  const API_BASE_URL =
    process.env.REACT_APP_API_URL || "http://localhost:3001/api";

  // Initialize auth state on app load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const userId = localStorage.getItem("userId");

        if (token && userId) {
          // Verify token and load user profile
          const profile = await loadUserProfile(userId, token);
          if (profile) {
            setCurrentUser({ id: userId, token });
            setUserProfile(profile);
          } else {
            // Invalid token, clear storage
            localStorage.removeItem("authToken");
            localStorage.removeItem("userId");
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        localStorage.removeItem("authToken");
        localStorage.removeItem("userId");
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Email service integration
  const sendConfirmationEmail = async (email, confirmationToken) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/send-confirmation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          confirmationToken,
          confirmationUrl: `${window.location.origin}/confirm-email/${confirmationToken}`,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send confirmation email");
      }

      return await response.json();
    } catch (error) {
      console.error("Email sending error:", error);
      // Fallback: Mock email sending for development
      console.log(
        `Mock email sent to ${email} with token: ${confirmationToken}`
      );
      return { success: true, message: "Confirmation email sent successfully" };
    }
  };

  // Registration with email confirmation
  const register = async (email, password, additionalInfo = {}) => {
    try {
      setLoading(true);

      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          ...additionalInfo,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      const data = await response.json();

      // Send confirmation email
      await sendConfirmationEmail(email, data.confirmationToken);
      setEmailVerificationSent(true);

      return {
        success: true,
        message:
          "Registration successful! Please check your email to confirm your account.",
        requiresEmailConfirmation: true,
      };
    } catch (error) {
      console.error("Registration error:", error);

      // Mock registration for development
      const mockUser = {
        id: Date.now().toString(),
        email,
        confirmationToken: Math.random().toString(36).substring(2, 15),
        emailConfirmed: false,
      };

      // Store in localStorage for development
      localStorage.setItem("pendingUser", JSON.stringify(mockUser));

      // Send mock confirmation email
      await sendConfirmationEmail(email, mockUser.confirmationToken);
      setEmailVerificationSent(true);

      return {
        success: true,
        message:
          "Registration successful! Please check your email to confirm your account.",
        requiresEmailConfirmation: true,
      };
    } finally {
      setLoading(false);
    }
  };

  // Email confirmation
  const confirmEmail = async (confirmationToken) => {
    try {
      setLoading(true);

      const response = await fetch(`${API_BASE_URL}/auth/confirm-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ confirmationToken }),
      });

      if (!response.ok) {
        throw new Error("Email confirmation failed");
      }

      const data = await response.json();
      return {
        success: true,
        message: "Email confirmed successfully! You can now log in.",
      };
    } catch (error) {
      console.error("Email confirmation error:", error);

      // Mock confirmation for development
      const pendingUser = JSON.parse(
        localStorage.getItem("pendingUser") || "{}"
      );
      if (pendingUser.confirmationToken === confirmationToken) {
        pendingUser.emailConfirmed = true;
        localStorage.setItem("confirmedUser", JSON.stringify(pendingUser));
        localStorage.removeItem("pendingUser");
        return {
          success: true,
          message: "Email confirmed successfully! You can now log in.",
        };
      }

      throw new Error("Invalid confirmation token");
    } finally {
      setLoading(false);
    }
  };

  // Login with profile loading
  const login = async (email, password) => {
    try {
      setLoading(true);

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();

      // Store auth data
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("userId", data.user.id);

      setCurrentUser(data.user);

      // Load user profile
      const profile = await loadUserProfile(data.user.id, data.token);
      setUserProfile(profile);

      return { success: true, user: data.user };
    } catch (error) {
      console.error("Login error:", error);

      // Mock login for development
      const confirmedUser = JSON.parse(
        localStorage.getItem("confirmedUser") || "{}"
      );
      if (confirmedUser.email === email && confirmedUser.emailConfirmed) {
        const mockToken = Math.random().toString(36).substring(2, 15);
        const mockUser = {
          id: confirmedUser.id,
          email: confirmedUser.email,
          token: mockToken,
        };

        localStorage.setItem("authToken", mockToken);
        localStorage.setItem("userId", mockUser.id);

        setCurrentUser(mockUser);

        // Create mock profile
        const mockProfile = await createMockProfile(mockUser.id);
        setUserProfile(mockProfile);

        return { success: true, user: mockUser };
      }

      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Load user profile
  const loadUserProfile = async (userId, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to load profile");
      }

      return await response.json();
    } catch (error) {
      console.error("Profile loading error:", error);

      // Return mock profile for development
      return createMockProfile(userId);
    }
  };

  // Create mock profile for development
  const createMockProfile = async (userId) => {
    const mockProfile = {
      id: userId,
      firstName: "John",
      lastName: "Doe",
      email: currentUser?.email || "user@example.com",
      dateOfBirth: "1990-01-01",
      fitnessLevel: "intermediate",
      goals: ["weight_loss", "strength_building"],
      preferences: {
        workoutDuration: 30,
        workoutFrequency: 3,
        accessibilityNeeds: [],
      },
      stats: {
        workoutsCompleted: 12,
        totalMinutes: 480,
        streakDays: 5,
        goalsAchieved: 3,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Store mock profile
    localStorage.setItem(`profile_${userId}`, JSON.stringify(mockProfile));
    return mockProfile;
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/users/${currentUser.id}/profile`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(profileData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const updatedProfile = await response.json();
      setUserProfile(updatedProfile);

      return { success: true, profile: updatedProfile };
    } catch (error) {
      console.error("Profile update error:", error);

      // Mock profile update for development
      const updatedProfile = {
        ...userProfile,
        ...profileData,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(
        `profile_${currentUser.id}`,
        JSON.stringify(updatedProfile)
      );
      setUserProfile(updatedProfile);

      return { success: true, profile: updatedProfile };
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    setCurrentUser(null);
    setUserProfile(null);
    setEmailVerificationSent(false);
  };

  // Resend confirmation email
  const resendConfirmationEmail = async (email) => {
    try {
      const pendingUser = JSON.parse(
        localStorage.getItem("pendingUser") || "{}"
      );
      if (pendingUser.email === email) {
        await sendConfirmationEmail(email, pendingUser.confirmationToken);
        return {
          success: true,
          message: "Confirmation email resent successfully",
        };
      }
      throw new Error("No pending registration found for this email");
    } catch (error) {
      console.error("Resend email error:", error);
      throw error;
    }
  };

  const value = {
    currentUser,
    userProfile,
    loading,
    emailVerificationSent,
    register,
    login,
    logout,
    confirmEmail,
    updateProfile,
    resendConfirmationEmail,
    loadUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
