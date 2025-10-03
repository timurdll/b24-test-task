import React from "react";
import styles from "./ProfileTitle.module.scss";

interface ProfileTitleProps {
  title?: string;
  variant?: "small" | "large";
  className?: string;
}

const ProfileTitle: React.FC<ProfileTitleProps> = ({
  title = "Профиль",
  variant = "small",
  className = "",
}) => {
  return (
    <div
      className={`${styles.title} ${
        variant === "large" ? styles.large : ""
      } ${className}`}
    >
      <div className={styles.titleBar}></div>
      {title}
    </div>
  );
};

export { ProfileTitle };
