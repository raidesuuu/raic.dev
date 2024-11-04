"use client";

import React, { Suspense } from "react";
import PanelSidebar from "@/components/PanelSidebar";
import LoadingScreen from "@/components/Loading";
import SubscriptionPage from "@/components/SubscriptionPage";

const Login: React.FC = () => {
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-gray-950 text-white p-4 lg:p-8">
      <Suspense fallback={<LoadingScreen />}>
        <PanelSidebar />
        <div className="flex-grow w-full p-4 lg:p-8 h-full lg:h-screen bg-gray-800 ml-0 lg:ml-8">
          <SubscriptionPage />
        </div>
      </Suspense>
    </div>
  );
};

export default Login;
