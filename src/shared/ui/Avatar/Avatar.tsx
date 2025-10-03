import React from "react";
import Image from "next/image";
import styles from "./Avatar.module.scss";

interface AvatarProps {
  size?: "small" | "medium" | "large";
  className?: string;
  alt?: string;
}

const sizeMap = {
  small: { width: 20, height: 24, containerClass: styles.avatarSmall },
  medium: { width: 40, height: 48, containerClass: styles.avatarMedium },
  large: { width: 60, height: 72, containerClass: styles.avatarLarge },
};

export const Avatar: React.FC<AvatarProps> = ({
  size = "medium",
  className = "",
  alt = "Avatar",
}) => {
  const dimensions = sizeMap[size];

  return (
    <div
      className={`${styles.avatar} ${dimensions.containerClass} ${className}`}
    >
      <Image
        src="/icons/avatar.svg"
        alt={alt}
        width={dimensions.width}
        height={dimensions.height}
        className={styles.avatarIcon}
      />
    </div>
  );
};

export default Avatar;
