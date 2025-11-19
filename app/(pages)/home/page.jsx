"use client";
import React from "react";
import { useSession } from "next-auth/react";
import UIHome from "@/components/home/UIHome";

export default function HomePage() {
  const { data: session } = useSession();

  const user = session?.user;

  return <UIHome headerTopic="Home" user={user} />;
}
