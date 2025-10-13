import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import MovieDataService from "../services/movies.js";
import cinemaIllustration from "../assets/images/illustration.png";
import BackLink from "../components/ui/BackLink.jsx";
import Spinner from "../components/ui/Spinner.jsx";
import PageCard from "../components/ui/PageCard.jsx";
import styles from "./Login.module.css";

const sampleUser = {
  name: "Petyr Baelish",
  email: "aidan_gillen@gameofthron.es",
};

const Login = ({ login }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [mode, setMode] = useState(location.state?.mode || "login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title =
      mode === "register" ? "Join Cinevo | Cinevo" : "Welcome Back | Cinevo";
  }, [mode]);

  const handleReturn = (e) => {
    if (e) e.preventDefault();
    const returnTo =
      location.state?.from && location.state.from !== "/login"
        ? location.state.from
        : null;

    if (returnTo) {
      navigate(returnTo, { state: location.state?.fromState });
    } else if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  const handleQuickLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await MovieDataService.login({
        email: sampleUser.email,
        password: "cinevo",
      });

      const loggedUser = response.data?.user || sampleUser;

      login(loggedUser);
      handleReturn();
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === "register") {
        if (!name.trim()) {
          setError("Please enter your name.");
          setLoading(false);
          return;
        }

        if (!email.trim()) {
          setError("Please enter your email.");
          setLoading(false);
          return;
        }
        
        if (password.length < 6) {
          setError("Password must be at least 6 characters");
          setLoading(false);
          return;
        }

        const response = await MovieDataService.register({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
        });

        const loggedUser = response.data?.user || {
          name: name.trim(),
          email: email.trim().toLowerCase(),
        };

        login(loggedUser);
        handleReturn();
      } else {
        if (!email.trim() || !password) {
          setError("Please enter both email and password");
          setLoading(false);
          return;
        }

        const response = await MovieDataService.login({
          email: email.trim().toLowerCase(),
          password,
        });

        const loggedUser = response.data?.user || {
          email: email.trim().toLowerCase(),
        };

        login(loggedUser);
        handleReturn();
      }
    } catch (err) {
      const serverMessage =
        err.response?.data?.error ||
        (mode === "register"
          ? "Something went wrong, please try again later"
          : "Invalid email or password");
      setError(serverMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageCard maxWidth="410px">
      <div className={styles.headerNav}>
        <BackLink
          to={location.state?.from || "/"}
          state={location.state?.fromState}
          onClick={handleReturn}
        />
      </div>

      <div className={styles.illustrationWrapper}>
        <img
          src={cinemaIllustration}
          alt="Cinevo Cinema"
          className={styles.illustration}
        />
      </div>

      <h1 className={styles.title}>
        {mode === "register" ? "Join Cinevo" : "Welcome Back"}
      </h1>
      <p className={styles.subtitle}>
        {mode === "register"
          ? "Create an account to review and rate movies"
          : "Sign in to manage and post your movie reviews"}
      </p>

      <form onSubmit={handleSubmit} className={styles.form}>
        {mode === "register" && (
          <div className={styles.field}>
            <label htmlFor="name" className={styles.label}>
              Full Name
            </label>
            <input
              id="name"
              type="text"
              className={styles.input}
              placeholder="Jane Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              required
            />
          </div>
        )}

        <div className={styles.field}>
          <label htmlFor="email" className={styles.label}>
            Email Address
          </label>
          <input
            id="email"
            type="email"
            className={styles.input}
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="password" className={styles.label}>
            Password
          </label>
          <input
            id="password"
            type="password"
            className={styles.input}
            placeholder={
              mode === "register" ? "Atleast 6 characters" : "••••••••"
            }
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={
              mode === "register" ? "new-password" : "current-password"
            }
            required
          />
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <button
          type="submit"
          className={styles.submitBtn}
          disabled={loading}
        >
          {loading ? (
            <Spinner size={18} />
          ) : (
            <span>{mode === "register" ? "Create Account" : "Sign In"}</span>
          )}
        </button>
      </form>

      {mode === "login" && (
        <>
          <div className={styles.divider}>
            <span>or</span>
          </div>

          <p className={styles.quickPrompt}>
            Continue as{" "}
            <button
              type="button"
              className={styles.quickBtn}
              onClick={handleQuickLogin}
              disabled={loading}
            >
              {sampleUser.name}
            </button>
          </p>
        </>
      )}

      <div className={styles.footer}>
        {mode === "login" ? (
          <p>
            Don't have an account?{" "}
            <button
              type="button"
              className={styles.toggleBtn}
              onClick={() => switchMode("register")}
            >
              Sign up
            </button>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <button
              type="button"
              className={styles.toggleBtn}
              onClick={() => switchMode("login")}
            >
              Sign in
            </button>
          </p>
        )}
      </div>
    </PageCard>
  );
};

export default Login;
