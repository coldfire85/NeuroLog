"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Brain, Hash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

// Demo trending topics
const trendingTopics = [
  { name: "Cerebrovascular", count: 87, category: "topic" },
  { name: "Tumor Resection", count: 62, category: "procedure" },
  { name: "Deep Brain Stimulation", count: 54, category: "procedure" },
  { name: "Neurosurgical Education", count: 41, category: "topic" },
  { name: "Pediatric Neurosurgery", count: 38, category: "topic" }
];

// Demo people to follow
const suggestedUsers = [
  {
    id: "user1",
    name: "Dr. Sarah Johnson",
    role: "Functional Neurosurgeon",
    institution: "Mayo Clinic",
    avatar: "",
    verified: true
  },
  {
    id: "user2",
    name: "Dr. Michael Chen",
    role: "Neuro-oncologist",
    institution: "Stanford Medical",
    avatar: "",
    verified: true
  },
  {
    id: "user3",
    name: "Dr. Robert Williams",
    role: "Pediatric Neurosurgeon",
    institution: "Children's Hospital",
    avatar: "",
    verified: false
  }
];

export function TrendingSidebar() {
  return (
    <div className="space-y-6">
      {/* Trending Topics */}
      <Card className="overflow-hidden">
        <CardHeader className="bg-slate-50 dark:bg-gray-700/50 py-3">
          <CardTitle className="text-sm font-medium flex items-center">
            <TrendingUp className="h-4 w-4 mr-2 text-blue-600" />
            Trending in Neurosurgery
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3">
          <ul className="space-y-3">
            {trendingTopics.map((topic, index) => (
              <li key={topic.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {topic.category === "topic" ? (
                    <Hash className="h-4 w-4 text-blue-600" />
                  ) : (
                    <Brain className="h-4 w-4 text-indigo-600" />
                  )}
                  <div>
                    <Link
                      href={`/topics/${topic.name.toLowerCase().replace(/\s+/g, '-')}`}
                      className="text-sm hover:text-blue-600 font-medium"
                    >
                      {topic.name}
                    </Link>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {topic.count} discussions
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  #{index + 1}
                </Badge>
              </li>
            ))}
          </ul>
          <div className="mt-3 pt-2 border-t">
            <Link href="/topics" className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
              View all trending topics
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* People to Follow */}
      <Card className="overflow-hidden">
        <CardHeader className="bg-slate-50 dark:bg-gray-700/50 py-3">
          <CardTitle className="text-sm font-medium flex items-center">
            <Users className="h-4 w-4 mr-2 text-blue-600" />
            People to Follow
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ul className="divide-y divide-gray-100 dark:divide-gray-700">
            {suggestedUsers.map((user) => (
              <li key={user.id} className="flex items-center justify-between p-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    {user.avatar ? (
                      <AvatarImage src={user.avatar} alt={user.name} />
                    ) : (
                      <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
                        {user.name.split(" ").map(name => name[0]).join("")}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-1">
                      <Link href={`/profile/${user.id}`} className="text-sm font-medium hover:text-blue-600">
                        {user.name}
                      </Link>
                      {user.verified && (
                        <svg className="h-3.5 w-3.5 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm0-7l-4-4 1.414-1.414L12 12.172l2.586-2.586L16 11l-4 4z" />
                        </svg>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user.role}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user.institution}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="rounded-full text-xs h-8 px-3">
                  Follow
                </Button>
              </li>
            ))}
          </ul>
          <div className="p-3 border-t">
            <Link href="/discover-users" className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
              Discover more professionals
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Quick links */}
      <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1 px-1">
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          <Link href="/help" className="hover:underline">Help</Link>
          <Link href="/about" className="hover:underline">About</Link>
          <Link href="/privacy" className="hover:underline">Privacy</Link>
          <Link href="/terms" className="hover:underline">Terms</Link>
          <Link href="/support" className="hover:underline">Support</Link>
        </div>
        <p>© 2025 NeuroLog Network</p>
      </div>
    </div>
  );
}
