import React, { useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ArrowRight, ArrowLeft } from "lucide-react";

import MovieDataService from "../services/movies";
import cinemaIllustration from "../assets/images/illustration.png";
import styles from "./Login.module.css";

const Login = ({ login }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.title = "Welcome | Cinevo";
  }, []);

  const handleReturn = (e) => {
    if (e) {
      e.preventDefault();
    }
    navigate("/");
  };

  const handleGuestLogin = async () => {

    try {
      const response = await MovieDataService.login({
        email: "testuser@example.com",
        password: "testpassword",
      });
      login(
        response.data?.user || {
          name: "Test User",
          email: "testuser@example.com",
        },
      );
      handleReturn();
    } catch {
      login({ name: "Test User", email: "testuser@example.com" });
      handleReturn();

    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.pageCard}>
        <Link
          to={location.state?.from || "/"}
          state={location.state?.fromState}
          onClick={handleReturn}
          className={styles.headerNav}
        >
          <ArrowLeft size={15} />
          <span>Back to movies</span>
        </Link>

        <div className={styles.illustrationWrapper}>
          <img
            src={cinemaIllustration}
            alt="Welcome to Cinevo"
            className={styles.illustration}
          />
        </div>

        <h1 className={styles.title}>Welcome to Cinevo</h1>
        <p className={styles.subtitle}>
          Discover, watch and review the best movie
        </p>

        <button
          type="button"
          className={styles.quickBtn}
          onClick={handleGuestLogin}
        >
          <span>Continue as Guest</span>
          <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
};

export default Login;
