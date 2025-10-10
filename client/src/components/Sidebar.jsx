import React from "react";
import { NavLink } from "react-router-dom";
import { Film, TrendingUp, Award, Flame } from "lucide-react";

import logo from "../assets/images/logo.png";
import styles from "./Sidebar.module.css";

const NAV_ITEMS = [
  { to: "/movies", label: "Explore All", icon: Film, end: true },
  {
    to: "/movies/top-rated",
    label: "Top Rated",
    icon: TrendingUp,
    badge: "HOT",
  },
  { to: "/movies/award-winners", label: "Award Winners", icon: Award },
  { to: "/movies/most-discussed", label: "Most Discussed", icon: Flame },
];

const getNavLinkClass = ({ isActive }) =>
  `${styles.navItem} ${isActive ? styles.navItemActive : ""}`;

const Sidebar = ({ user, logout }) => {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <img src={logo} alt="Cinevo" className={styles.logoImage} />
      </div>

      <div className={styles.content}>
        <span className={styles.sectionTitle}>Discover</span>
        <nav className={styles.nav}>
          {NAV_ITEMS.map(({ to, label, icon: Icon, badge, end }) => (
            <NavLink key={to} to={to} end={end} className={getNavLinkClass}>
              <Icon size={18} className={styles.navIcon} />
              <span className={styles.navLabel}>{label}</span>
              {badge && <span className={styles.pillTag}>{badge}</span>}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
