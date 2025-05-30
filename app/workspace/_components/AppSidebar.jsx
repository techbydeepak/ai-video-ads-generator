"use client"

import React from "react";
import { useRouter } from 'next/navigation';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Settings2Icon,
  Video,
  Videotape,
  WalletCards,
} from "lucide-react";
import { usePathname } from "next/navigation";

const MenuOptions = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/workspace",
  },
  {
    title: "Create Ad",
    icon: Video,
    path: "/workspace/create-ad",
  },
  {
    title: "My Videos",
    icon: Videotape,
    path: "/workspace",
  },
  {
    title: "Billing",
    icon: WalletCards,
    path: "/workspace/billing",
  },
  {
    title: "Settings",
    icon: Settings2Icon,
    path: "/workspace/settings",
  },
];

function AppSidebar() {
  const router = useRouter();
  const path = usePathname();

  return (
    <Sidebar
      className="bg-gradient-to-br from-black via-gray-900 to-black border-r-4 border-red-700 shadow-[0_0_15px_#c40233]"
  style={{
    boxShadow: "inset 0 0 20px 3px #C40233, 0 0 25px 5px #8B0000",
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  }}
    >
      <SidebarHeader className="flex items-center justify-center py-6 border-b border-gray-800 bg-[#1a1a1a]">
        <div className="w-48 relative">
          <Image
            src="/promo.png"
            alt="logo"
            width={185}
            height={40}
            priority
            style={{ objectFit: "contain" }}
          />
        </div>
      </SidebarHeader>

      <SidebarContent className="px-6 py-4 bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d]">
        <SidebarGroup className="mb-8">
          <Button
            className="w-full bg-red-800 hover:bg-red-800 active:bg-red-900 text-white font-bold tracking-wide rounded-md shadow-lg transition duration-300"
            onClick={() => router.push("/workspace/create-ad")}
          >
            Create New Ad Video
          </Button>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-700 uppercase font-semibold tracking-wider mb-3">
            {/* Application */}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {MenuOptions.map((menu, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton asChild className="p-3 rounded-md hover:bg-red-900 transition duration-200">
                    <a
                      href={menu.path}
                      className={`flex items-center gap-4 text-lg font-semibold tracking-wide transition-colors duration-200
                        ${
                          path === menu.path
                            ? "text-red-500 bg-gray-700 rounded-md"
                            : "text-red-600 bg-gray-800 rounded-md hover:text-red-500"
                        }`}
                    >
                      <menu.icon
                        className={`h-7 w-7 ${
                          path === menu.path ? "text-red-500" : "text-gray-400"
                        }`}
                      />
                      <span>{menu.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-800 p-4 text-center text-gray-500 text-sm tracking-wide bg-[#121212]">
        <span>© 2025 AI Video Ad Generator</span>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;
