"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  User,
  LogOut,
  Settings,
  Bookmark,
  Bell,
  Key,
  HelpCircle,
  CircleUser,
  Search,
  Globe,
  Settings2,
  Network
} from "lucide-react";
import Link from "next/link";

// Define our user data type
type UserStatus = 'online' | 'away' | 'busy' | 'offline';

type UserData = {
  name: string;
  email: string;
  role: string;
  status: UserStatus;
  initials: string;
};

// Sample user data - in a real app this would come from auth context
const userData: UserData = {
  name: "Dr. John Smith",
  email: "neurosurgeon@example.com",
  role: "Neurosurgeon",
  status: "online",
  initials: "JS"
};

export function ProfileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  // Status indicator color based on user status
  const statusColors: Record<UserStatus, string> = {
    online: "bg-green-500",
    away: "bg-yellow-500",
    busy: "bg-red-500",
    offline: "bg-gray-400"
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative h-9 w-9 rounded-full p-0 overflow-hidden"
        >
          <Avatar className="h-9 w-9 border border-blue-200 dark:border-blue-800">
            {/* If there's a user avatar image, use it */}
            {/* <AvatarImage src="/avatar.jpg" alt={userData.name} /> */}

            {/* Fallback with user initials and gradient background */}
            <AvatarFallback
              className="bg-gradient-to-br from-blue-500 to-purple-600 text-white dark:from-blue-600 dark:to-purple-800"
            >
              {userData.initials}
            </AvatarFallback>
          </Avatar>

          {/* Status indicator */}
          <span
            className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background ${statusColors[userData.status]}`}
            aria-hidden="true"
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64 p-2 rounded-xl">
        {/* User info section */}
        <div className="flex items-center gap-3 p-2 mb-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
          <Avatar className="h-10 w-10 border border-blue-200 dark:border-blue-800">
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white dark:from-blue-600 dark:to-purple-800">
              {userData.initials}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col">
            <span className="text-sm font-medium">{userData.name}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{userData.email}</span>
            <span className="text-xs text-gray-600 dark:text-gray-300">{userData.role}</span>
          </div>
        </div>

        <DropdownMenuSeparator className="my-1" />

        {/* Main menu items */}
        <DropdownMenuItem className="flex items-center gap-2 cursor-pointer py-2 rounded-lg">
          <CircleUser className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <span>My Profile</span>
        </DropdownMenuItem>

        <Link href="/public-feed" passHref legacyBehavior>
          <DropdownMenuItem className="flex items-center gap-2 cursor-pointer py-2 rounded-lg">
            <Network className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span>Network Feed</span>
          </DropdownMenuItem>
        </Link>

        <DropdownMenuItem className="flex items-center gap-2 cursor-pointer py-2 rounded-lg">
          <Bookmark className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <span>Saved Procedures</span>
        </DropdownMenuItem>

        <DropdownMenuItem className="flex items-center gap-2 cursor-pointer py-2 rounded-lg">
          <Bell className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <span>Notifications</span>
        </DropdownMenuItem>

        {/* Global Search item */}
        <Link href="/global-search" passHref legacyBehavior>
          <DropdownMenuItem className="flex items-center gap-2 cursor-pointer py-2 rounded-lg">
            <Globe className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span>Global Search</span>
          </DropdownMenuItem>
        </Link>

        <DropdownMenuSeparator className="my-1" />

        {/* Settings section */}
        <DropdownMenuItem className="flex items-center gap-2 cursor-pointer py-2 rounded-lg">
          <Settings className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          <span>Settings</span>
        </DropdownMenuItem>

        {/* Content Sharing Settings */}
        <Link href="/content-settings" passHref legacyBehavior>
          <DropdownMenuItem className="flex items-center gap-2 cursor-pointer py-2 rounded-lg">
            <Settings2 className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            <span>Content Sharing Settings</span>
          </DropdownMenuItem>
        </Link>

        <DropdownMenuItem className="flex items-center gap-2 cursor-pointer py-2 rounded-lg">
          <Key className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          <span>Change Password</span>
        </DropdownMenuItem>

        <DropdownMenuItem className="flex items-center gap-2 cursor-pointer py-2 rounded-lg">
          <HelpCircle className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          <span>Help & Support</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-1" />

        {/* Logout */}
        <DropdownMenuItem className="flex items-center gap-2 cursor-pointer py-2 rounded-lg text-red-600 dark:text-red-400">
          <LogOut className="h-4 w-4" />
          <span>Log Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
