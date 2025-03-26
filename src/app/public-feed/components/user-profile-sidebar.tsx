"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  BookMarked,
  MessageSquare,
  Share2,
  Users,
  FileText,
  Image as ImageIcon,
  FileVideo,
  FileImage
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

// Demo user data
const userData = {
  name: "Dr. John Smith",
  role: "Neurosurgeon",
  hospital: "University Medical Center",
  avatar: "", // URL to avatar image
  followers: 128,
  following: 56,
  published: 42,
  badges: ["Verified", "Top Contributor"]
};

export function UserProfileSidebar() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
      {/* Profile header with gradient background */}
      <div className="h-24 bg-gradient-to-r from-blue-600 to-indigo-600"></div>

      {/* Avatar and basic info */}
      <div className="px-4 pb-4 relative">
        <Avatar className="absolute -top-10 left-4 h-20 w-20 border-4 border-white dark:border-gray-800 shadow-md">
          {userData.avatar ? (
            <AvatarImage src={userData.avatar} alt={userData.name} />
          ) : (
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xl">
              {userData.name.split(" ").map(name => name[0]).join("")}
            </AvatarFallback>
          )}
        </Avatar>

        <div className="mt-12 mb-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">{userData.name}</h3>
            <div className="flex gap-1">
              {userData.badges.map(badge => (
                <Badge key={badge} variant="secondary" className="text-xs">
                  {badge}
                </Badge>
              ))}
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{userData.role}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{userData.hospital}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mt-4 text-center">
          <div className="p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
            <p className="font-semibold">{userData.followers}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Followers</p>
          </div>
          <div className="p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
            <p className="font-semibold">{userData.following}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Following</p>
          </div>
          <div className="p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
            <p className="font-semibold">{userData.published}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Published</p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button variant="default" size="sm" className="rounded-full">Edit Profile</Button>
          <Button variant="outline" size="sm" className="rounded-full">Share Profile</Button>
        </div>
      </div>

      <Separator />

      {/* Navigation links */}
      <div className="p-2">
        <ul className="space-y-1">
          <li>
            <Link href="/public-feed" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <FileText className="h-4 w-4 text-blue-600" />
              <span className="text-sm">Your Feed</span>
            </Link>
          </li>
          <li>
            <Link href="/content-settings" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <BookMarked className="h-4 w-4 text-blue-600" />
              <span className="text-sm">Content Settings</span>
            </Link>
          </li>
          <li>
            <Link href="/messages" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <MessageSquare className="h-4 w-4 text-blue-600" />
              <span className="text-sm">Messages</span>
              <span className="ml-auto bg-blue-100 text-blue-800 text-xs rounded-full px-2 py-0.5">3</span>
            </Link>
          </li>
          <li>
            <Link href="/connections" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <Users className="h-4 w-4 text-blue-600" />
              <span className="text-sm">Connections</span>
            </Link>
          </li>
        </ul>
      </div>

      <Separator />

      {/* Your content section */}
      <div className="p-4">
        <h4 className="text-sm font-medium mb-2">Your Shared Content</h4>
        <div className="grid grid-cols-3 gap-2">
          <Link href="/content-settings" className="flex flex-col items-center p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50 text-center">
            <ImageIcon className="h-5 w-5 text-blue-600 mb-1" />
            <span className="text-xs">Images</span>
            <span className="text-xs font-medium">24</span>
          </Link>
          <Link href="/content-settings" className="flex flex-col items-center p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50 text-center">
            <FileVideo className="h-5 w-5 text-blue-600 mb-1" />
            <span className="text-xs">Videos</span>
            <span className="text-xs font-medium">8</span>
          </Link>
          <Link href="/content-settings" className="flex flex-col items-center p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50 text-center">
            <FileImage className="h-5 w-5 text-blue-600 mb-1" />
            <span className="text-xs">Radiology</span>
            <span className="text-xs font-medium">10</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
