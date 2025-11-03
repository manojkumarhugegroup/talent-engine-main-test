"use client";

import { Suspense, useEffect, useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/sidebar/page";
import { Header } from "@/components/layout/header/page";
import { DataProvider } from "@/context/DataProvider";
import Loading from "../Loading";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const fName = Cookies.get("full_name");
    if (!fName || fName === "Guest") {
      router.push("/login");
    } else {
      setCheckingAuth(false);
    }
  }, [router]);

  if (checkingAuth) {
    return (
      <div className="flex h-screen w-full justify-center items-center">
        <Loading />;
      </div>
    );
  }

  return (
    <DataProvider>
      <SidebarProvider defaultOpen={sidebarOpen}>
        <div className="flex h-screen bg-background w-full">
          <AppSidebar />
          <div className="flex flex-col flex-1 min-w-0">
            {/* Fixed header */}
            <div className="flex-shrink-0">
              <Header />
            </div>
            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto ">
              <main
                className="p-2 md:p-3 h-[calc(90vh-24px)]"
                id="main-content"
              >
                <Suspense fallback={<Loading />}>{children}</Suspense>
              </main>
            </div>
          </div>
        </div>
      </SidebarProvider>
    </DataProvider>
  );
}
