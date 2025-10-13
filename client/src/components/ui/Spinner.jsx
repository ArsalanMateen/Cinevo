import React from "react";
import { Loader2 } from "lucide-react";
import styles from "./Spinner.module.css";

const Spinner = ({ size = 16 }) => (
  <Loader2 size={size} className={styles.spinner} />
);

export default Spinner;
