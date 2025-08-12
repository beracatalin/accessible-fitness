import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/Profile.css";

const Profile = () => {
  const { userProfile, updateProfile, loading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateStatus, setUpdateStatus] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (userProfile) {
      setFormData({
        firstName: userProfile.firstName || "",
        lastName: userProfile.lastName || "",
        email: userProfile.email || "",
        dateOfBirth: userProfile.dateOfBirth || "",
        fitnessLevel: userProfile.fitnessLevel || "beginner",
        goals: userProfile.goals || [],
        workoutDuration: userProfile.preferences?.workoutDuration || 30,
        workoutFrequency: userProfile.preferences?.workoutFrequency || 3,
        accessibilityNeeds: userProfile.preferences?.accessibilityNeeds || [],
      });
    }
  }, [userProfile]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      if (name === "goals") {
        setFormData((prev) => ({
          ...prev,
          goals: checked
            ? [...prev.goals, value]
            : prev.goals.filter((goal) => goal !== value),
        }));
      } else if (name === "accessibilityNeeds") {
        setFormData((prev) => ({
          ...prev,
          accessibilityNeeds: checked
            ? [...prev.accessibilityNeeds, value]
            : prev.accessibilityNeeds.filter((need) => need !== value),
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName?.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName?.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setUpdateStatus("updating");

      const profileUpdate = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        dateOfBirth: formData.dateOfBirth,
        fitnessLevel: formData.fitnessLevel,
        goals: formData.goals,
        preferences: {
          workoutDuration: parseInt(formData.workoutDuration),
          workoutFrequency: parseInt(formData.workoutFrequency),
          accessibilityNeeds: formData.accessibilityNeeds,
        },
      };

      await updateProfile(profileUpdate);
      setUpdateStatus("success");
      setIsEditing(false);

      setTimeout(() => setUpdateStatus(""), 3000);
    } catch (error) {
      setUpdateStatus("error");
      setTimeout(() => setUpdateStatus(""), 3000);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setErrors({});
    // Reset form data to original profile data
    if (userProfile) {
      setFormData({
        firstName: userProfile.firstName || "",
        lastName: userProfile.lastName || "",
        email: userProfile.email || "",
        dateOfBirth: userProfile.dateOfBirth || "",
        fitnessLevel: userProfile.fitnessLevel || "beginner",
        goals: userProfile.goals || [],
        workoutDuration: userProfile.preferences?.workoutDuration || 30,
        workoutFrequency: userProfile.preferences?.workoutFrequency || 3,
        accessibilityNeeds: userProfile.preferences?.accessibilityNeeds || [],
      });
    }
  };

  if (loading) {
    return (
      <div className="profile-container" role="main">
        <div className="loading-message" aria-live="polite">
          Loading your profile...
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="profile-container" role="main">
        <div className="error-message" aria-live="assertive">
          Unable to load profile. Please try refreshing the page.
        </div>
      </div>
    );
  }

  return (
    <main className="profile-container" role="main">
      <header className="profile-header">
        <h1>Your Profile</h1>
        {updateStatus === "success" && (
          <div className="update-status success" aria-live="polite">
            Profile updated successfully!
          </div>
        )}
        {updateStatus === "error" && (
          <div className="update-status error" aria-live="assertive">
            Failed to update profile. Please try again.
          </div>
        )}
      </header>

      <div className="profile-content">
        <section
          className="profile-info"
          aria-labelledby="profile-info-heading"
        >
          <div className="section-header">
            <h2 id="profile-info-heading">Personal Information</h2>
            {!isEditing && (
              <button
                className="edit-button"
                onClick={() => setIsEditing(true)}
                aria-label="Edit profile information"
              >
                Edit Profile
              </button>
            )}
          </div>

          {isEditing ? (
            <form
              onSubmit={handleSubmit}
              className="profile-form"
              aria-label="Edit profile form"
            >
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name *</label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    aria-describedby={
                      errors.firstName ? "firstName-error" : undefined
                    }
                    aria-invalid={errors.firstName ? "true" : "false"}
                  />
                  {errors.firstName && (
                    <div
                      id="firstName-error"
                      className="field-error"
                      role="alert"
                    >
                      {errors.firstName}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="lastName">Last Name *</label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    aria-describedby={
                      errors.lastName ? "lastName-error" : undefined
                    }
                    aria-invalid={errors.lastName ? "true" : "false"}
                  />
                  {errors.lastName && (
                    <div
                      id="lastName-error"
                      className="field-error"
                      role="alert"
                    >
                      {errors.lastName}
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  aria-describedby={errors.email ? "email-error" : undefined}
                  aria-invalid={errors.email ? "true" : "false"}
                />
                {errors.email && (
                  <div id="email-error" className="field-error" role="alert">
                    {errors.email}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="dateOfBirth">Date of Birth *</label>
                <input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  required
                  aria-describedby={
                    errors.dateOfBirth ? "dateOfBirth-error" : undefined
                  }
                  aria-invalid={errors.dateOfBirth ? "true" : "false"}
                />
                {errors.dateOfBirth && (
                  <div
                    id="dateOfBirth-error"
                    className="field-error"
                    role="alert"
                  >
                    {errors.dateOfBirth}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="fitnessLevel">Fitness Level</label>
                <select
                  id="fitnessLevel"
                  name="fitnessLevel"
                  value={formData.fitnessLevel}
                  onChange={handleInputChange}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <fieldset className="form-group">
                <legend>Fitness Goals</legend>
                <div className="checkbox-group">
                  {[
                    "weight_loss",
                    "muscle_gain",
                    "strength_building",
                    "endurance",
                    "flexibility",
                    "general_fitness",
                  ].map((goal) => (
                    <label key={goal} className="checkbox-label">
                      <input
                        type="checkbox"
                        name="goals"
                        value={goal}
                        checked={formData.goals.includes(goal)}
                        onChange={handleInputChange}
                      />
                      {goal
                        .replace("_", " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="workoutDuration">
                    Preferred Workout Duration (minutes)
                  </label>
                  <select
                    id="workoutDuration"
                    name="workoutDuration"
                    value={formData.workoutDuration}
                    onChange={handleInputChange}
                  >
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">60 minutes</option>
                    <option value="90">90 minutes</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="workoutFrequency">Workouts per Week</label>
                  <select
                    id="workoutFrequency"
                    name="workoutFrequency"
                    value={formData.workoutFrequency}
                    onChange={handleInputChange}
                  >
                    <option value="1">1 time per week</option>
                    <option value="2">2 times per week</option>
                    <option value="3">3 times per week</option>
                    <option value="4">4 times per week</option>
                    <option value="5">5 times per week</option>
                    <option value="6">6 times per week</option>
                    <option value="7">Daily</option>
                  </select>
                </div>
              </div>

              <fieldset className="form-group">
                <legend>Accessibility Needs</legend>
                <div className="checkbox-group">
                  {[
                    "mobility_assistance",
                    "visual_impairment",
                    "hearing_impairment",
                    "cognitive_support",
                    "chronic_conditions",
                  ].map((need) => (
                    <label key={need} className="checkbox-label">
                      <input
                        type="checkbox"
                        name="accessibilityNeeds"
                        value={need}
                        checked={formData.accessibilityNeeds.includes(need)}
                        onChange={handleInputChange}
                      />
                      {need
                        .replace("_", " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="form-actions">
                <button
                  type="submit"
                  className="save-button"
                  disabled={updateStatus === "updating"}
                  aria-label={
                    updateStatus === "updating"
                      ? "Saving profile changes"
                      : "Save profile changes"
                  }
                >
                  {updateStatus === "updating" ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={handleCancel}
                  disabled={updateStatus === "updating"}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="profile-display">
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Name:</span>
                  <span className="info-value">
                    {userProfile.firstName} {userProfile.lastName}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Email:</span>
                  <span className="info-value">{userProfile.email}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Date of Birth:</span>
                  <span className="info-value">
                    {userProfile.dateOfBirth
                      ? new Date(userProfile.dateOfBirth).toLocaleDateString()
                      : "Not set"}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Fitness Level:</span>
                  <span className="info-value">
                    {userProfile.fitnessLevel?.replace(/\b\w/g, (l) =>
                      l.toUpperCase()
                    ) || "Not set"}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Goals:</span>
                  <span className="info-value">
                    {userProfile.goals?.length > 0
                      ? userProfile.goals
                          .map((goal) =>
                            goal
                              .replace("_", " ")
                              .replace(/\b\w/g, (l) => l.toUpperCase())
                          )
                          .join(", ")
                      : "No goals set"}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Workout Preferences:</span>
                  <span className="info-value">
                    {userProfile.preferences?.workoutDuration || 30} minutes,{" "}
                    {userProfile.preferences?.workoutFrequency || 3} times per
                    week
                  </span>
                </div>
                {userProfile.preferences?.accessibilityNeeds?.length > 0 && (
                  <div className="info-item">
                    <span className="info-label">Accessibility Needs:</span>
                    <span className="info-value">
                      {userProfile.preferences.accessibilityNeeds
                        .map((need) =>
                          need
                            .replace("_", " ")
                            .replace(/\b\w/g, (l) => l.toUpperCase())
                        )
                        .join(", ")}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </section>

        <section className="profile-stats" aria-labelledby="stats-heading">
          <h2 id="stats-heading">Your Progress</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">
                {userProfile.stats?.workoutsCompleted || 0}
              </div>
              <div className="stat-label">Workouts Completed</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">
                {userProfile.stats?.totalMinutes || 0}
              </div>
              <div className="stat-label">Total Minutes</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">
                {userProfile.stats?.streakDays || 0}
              </div>
              <div className="stat-label">Current Streak (Days)</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">
                {userProfile.stats?.goalsAchieved || 0}
              </div>
              <div className="stat-label">Goals Achieved</div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Profile;
