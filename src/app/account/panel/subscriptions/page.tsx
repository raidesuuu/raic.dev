"use client";

import React, { Suspense } from "react";
import PanelSidebar from "@/components/PanelSidebar";
import LoadingScreen from "@/components/Loading";
import SubscriptionPage from "@/components/SubscriptionPage";
import { SidebarProvider } from "@/components/ui/sidebar";

const Login: React.FC = () => {
  return (
    <SidebarProvider className="mt-8">
      <div className="min-h-screen w-full flex flex-col lg:flex-row  p-4 lg:p-8">
        <Suspense fallback={<LoadingScreen />}>
          <PanelSidebar />
          <div className="flex-grow w-full p-4 lg:p-8 h-full lg:h-screen ml-0 lg:ml-8">
            <SubscriptionPage />
          </div>
        </Suspense>
      </div>
    </SidebarProvider>
  );
};

export default Login;
