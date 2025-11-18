"use client";
import React from "react";
import { useSession } from "next-auth/react";
import UIHeader from "@/components/UIHeader";
import UILoading from "@/components/UILoading";
import UIHome from "@/components/home/UIHome";

export default function HomePage() {
  const { data: session, status } = useSession();

  if (status === "loading") return <UILoading />;

  const user = session?.user;

  return (
    <>
      <UIHome headerTopic="Home" user={user} />
    </>
  );
}
