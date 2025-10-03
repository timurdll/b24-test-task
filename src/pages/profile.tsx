import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useUserStore } from "@/src/entities/user";
import { getCurrentUser } from "@/src/shared/api";
import Header from "@/src/widgets/Header/Header";
import { ProfileInfo } from "@/src/widgets/ProfileInfo";
import styles from "./profile.module.scss";

const Profile: React.FC = () => {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    const checkAuth = async () => {
      if (!user) {
        const result = await getCurrentUser();
        if (result.ok && result.user) {
          setUser(result.user);
        } else {
          router.push("/auth/login");
        }
      }
    };

    checkAuth();
  }, [user, setUser, router]);

  if (!user) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Загрузка...</p>
      </div>
    );
  }

  return (
    <div className={styles.profile}>
      <Header />

      <main className={styles.main}>
        <div className={styles.container}>
          <ProfileInfo />
        </div>
      </main>
    </div>
  );
};

export default Profile;
