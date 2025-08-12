import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const { currentUser, userProfile, logout } = useAuth();
  const [recentActivities] = useState([
    {
      id: 1,
      type: "Workout Completed",
      details: "30-minute HIIT session",
      date: "2024-01-15",
      time: "09:30 AM",
    },
    {
      id: 2,
      type: "Goal Achievement",
      details: "Completed 5 workouts this week",
      date: "2024-01-14",
      time: "06:00 PM",
    },
    {
      id: 3,
      type: "Profile Updated",
      details: "Added new fitness goals",
      date: "2024-01-13",
      time: "02:15 PM",
    },
  ]);

  const handleLogout = () => {
    logout();
  };

  return (
    <main className="dashboard-container" role="main">
      <header className="dashboard-header">
        <div className="welcome-section">
          <h1>Welcome back, {userProfile?.firstName || "User"}!</h1>
          <p>Ready to continue your fitness journey?</p>
        </div>
        <div className="header-actions">
          <Link
            to="/profile"
            className="profile-link"
            aria-label="View and edit your profile"
          >
            View Profile
          </Link>
          <button
            onClick={handleLogout}
            className="logout-button"
            aria-label="Log out of your account"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        <section className="main-actions" aria-labelledby="actions-heading">
          <h2 id="actions-heading">Quick Actions</h2>
          <div className="actions-grid">
            <Link
              to="/workouts"
              className="action-card"
              aria-describedby="workouts-desc"
            >
              <h3>Start Workout</h3>
              <p id="workouts-desc">
                Browse and start your personalized workout routines
              </p>
            </Link>

            <Link
              to="/wellness"
              className="action-card"
              aria-describedby="wellness-desc"
            >
              <h3>Wellness Check</h3>
              <p id="wellness-desc">
                Track your mental health and wellness activities
              </p>
            </Link>

            <Link
              to="/profile"
              className="action-card"
              aria-describedby="profile-desc"
            >
              <h3>Update Profile</h3>
              <p id="profile-desc">
                Manage your personal information and preferences
              </p>
            </Link>

            <div className="action-card" aria-describedby="progress-desc">
              <h3>View Progress</h3>
              <p id="progress-desc">
                See your fitness journey statistics and achievements
              </p>
            </div>
          </div>
        </section>

        <aside className="sidebar">
          <section
            className="recent-activities"
            aria-labelledby="activities-heading"
          >
            <h2 id="activities-heading">Recent Activities</h2>
            <div className="activities-list" role="list">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="activity-item"
                  role="listitem"
                  tabIndex="0"
                  aria-label={`${activity.type}: ${activity.details} on ${activity.date} at ${activity.time}`}
                >
                  <div className="activity-info">
                    <h3 className="activity-type">{activity.type}</h3>
                    <div className="activity-details">
                      <span className="activity-description">
                        {activity.details}
                      </span>
                      <span className="activity-date">
                        {activity.date} at {activity.time}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {userProfile?.stats && (
            <section className="quick-stats" aria-labelledby="stats-heading">
              <h2 id="stats-heading">Your Stats</h2>
              <div className="stats-summary">
                <div className="stat-item">
                  <span className="stat-number">
                    {userProfile.stats.workoutsCompleted}
                  </span>
                  <span className="stat-label">Workouts</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">
                    {userProfile.stats.streakDays}
                  </span>
                  <span className="stat-label">Day Streak</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">
                    {Math.floor(userProfile.stats.totalMinutes / 60)}
                  </span>
                  <span className="stat-label">Hours</span>
                </div>
              </div>
            </section>
          )}
        </aside>
      </div>
    </main>
  );
};

export default Dashboard;
