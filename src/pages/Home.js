import React from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";

const Home = () => {
  return (
    <main className="home-container" role="main">
      <section className="hero">
        <h1 className="hero-title">Accessible Fitness & Wellness</h1>
        <p className="hero-subtitle">
          Your inclusive platform for adaptive workouts, wellness guides, and a
          supportive community.
        </p>
        <Link to="/register" className="hero-cta-button">
          Get Started
        </Link>
      </section>

      <section className="features">
        <article className="feature-card">
          <h2>Adaptive Workouts</h2>
          <p>Personalized fitness plans for all abilities and levels.</p>
        </article>
        <article className="feature-card">
          <h2>Wellness Guides</h2>
          <p>Expert advice on nutrition, mental health, and recovery.</p>
        </article>
        <article className="feature-card">
          <h2>Community Support</h2>
          <p>Connect with peers, share progress, and stay motivated.</p>
        </article>
      </section>

      <section className="testimonial">
        <blockquote>
          "This platform changed how I see fitness — finally a place that works
          for me!"
        </blockquote>
        <cite>- Happy Member</cite>
      </section>
    </main>
  );
};

export default Home;
