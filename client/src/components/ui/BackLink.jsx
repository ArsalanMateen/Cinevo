import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import styles from "./BackLink.module.css";

const BackLink = ({
  children = "Back to movies",
  className = "",
  ...linkProps
}) => (
  <Link
    {...linkProps}
    className={`${styles.backLink} ${className}`.trim()}
  >
    <ArrowLeft size={15} />
    <span>{children}</span>
  </Link>
);

export default BackLink;
