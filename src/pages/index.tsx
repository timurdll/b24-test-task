// src/pages/index.tsx
import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: "/auth/register",
      permanent: false,
    },
  };
};

export default function IndexPage() {
  return null;
}
