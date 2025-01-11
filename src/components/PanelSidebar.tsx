import React from "react";

import { Home, User } from "lucide-react";
import { MdSubscriptions } from "react-icons/md";
import { IoMdDocument } from "react-icons/io";

import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { FaShield } from "react-icons/fa6";
import { FaExternalLinkAlt } from "react-icons/fa";

const PanelSidebar: React.FC = () => {
  // Menu items.
  const items = [
    {
      title: "ホーム",
      url: "/account/panel/",
      icon: Home,
    },
    {
      title: "セキュリティ",
      url: "/account/panel/security",
      icon: FaShield,
    },
    {
      title: "サブスクリプション",
      url: "/account/panel/subscriptions",
      icon: MdSubscriptions,
    },
    {
      title: "API",
      url: "/account/panel/credentials",
      icon: User,
    },
  ];

  const topItems = [
    {
      title: "API Docs",
      url: "https://docs.raic.dev",
      icon: IoMdDocument,
    },
  ];

  return (
    <Sidebar className="mt-16">
      <SidebarContent>
      <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {topItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} target="_blank">
                      <item.icon />
                      <span>{item.title}</span>
                      <FaExternalLinkAlt className="ml-auto" />
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>パネル</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default PanelSidebar;
