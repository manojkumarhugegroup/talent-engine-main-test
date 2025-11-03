"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Loading from "../Loading";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/resource-requirement/jobs");
  }, [router]);

  return (
    <div className="flex items-center justify-center h-[calc(96vh-48px)] p-8 sm:p-20">
      <Loading />
    </div>
  );
}
