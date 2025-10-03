import React from "react";
import Image from "next/image";
import styles from "./BroadcastWidget.module.scss";

const BroadcastWidget: React.FC = () => {
  const handleLiveClick = () => {
    console.log("Starting live broadcast");
  };

  const handlePlayClick = () => {
    console.log("Playing video");
  };

  return (
    <div className={styles.broadcastBlock}>
      <div className={styles.title}>
        <div className={styles.titleLeft}>
          <div className={styles.titleBar}></div>
          Трансляция
        </div>
        <button className={styles.liveBtn} onClick={handleLiveClick}>
          <Image
            src="/icons/live.svg"
            alt="Live"
            width={16}
            height={16}
            className={styles.liveIcon}
          />
          Live
        </button>
      </div>

      <div className={styles.videoContainer}>
        <div className={styles.videoPlaceholder}></div>
      </div>
    </div>
  );
};

export { BroadcastWidget };
