import React from "react";
import styles from "./PageCard.module.css";

const PageCard = ({ children, maxWidth = "440px" }) => (
  <div className={styles.pageCard}>
    <div className={styles.pageCardInner} style={{ maxWidth }}>
      {children}
    </div>
  </div>
);

export default PageCard;
