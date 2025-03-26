"use client";

import { useState, useEffect } from "react";
import { FeedContent } from "./components/feed-content";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Users, TrendingUp, Clock, BellRing } from "lucide-react";
import { UserProfileSidebar } from "./components/user-profile-sidebar";
import { TrendingSidebar } from "./components/trending-sidebar";
import { Separator } from "@/components/ui/separator";

export default function PublicFeedPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("recent");

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen pb-12">
      {/* Hero section with gradient background */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 py-8 px-4 -mt-6">
        <div className="container mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold text-white">NeuroLog Network</h1>
          <p className="text-blue-100 mt-2 max-w-2xl">
            Discover, share, and collaborate with other neurosurgical professionals.
            Explore a curated feed of the latest public content from your peers.
          </p>

          {/* Search bar */}
          <div className="mt-6 flex gap-2">
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-3 top-3 h-4 w-4 text-white/70" />
              <Input
                placeholder="Search shared content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus-visible:ring-white/30"
              />
            </div>
            <Button variant="secondary" size="icon" className="rounded-full bg-white/20 border-white/20 text-white hover:bg-white/30">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="container mx-auto max-w-7xl px-4 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left sidebar */}
          <div className="hidden lg:block lg:col-span-3">
            <UserProfileSidebar />
          </div>

          {/* Main content */}
          <div className="lg:col-span-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-4 mb-4">
                  <TabsTrigger value="recent" className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Recent</span>
                  </TabsTrigger>
                  <TabsTrigger value="trending" className="flex items-center gap-1.5">
                    <TrendingUp className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Trending</span>
                  </TabsTrigger>
                  <TabsTrigger value="following" className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Following</span>
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="flex items-center gap-1.5 relative">
                    <BellRing className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Updates</span>
                    <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      3
                    </span>
                  </TabsTrigger>
                </TabsList>

                <Separator className="mb-4" />

                <TabsContent value="recent">
                  <FeedContent type="recent" searchQuery={searchQuery} />
                </TabsContent>

                <TabsContent value="trending">
                  <FeedContent type="trending" searchQuery={searchQuery} />
                </TabsContent>

                <TabsContent value="following">
                  <FeedContent type="following" searchQuery={searchQuery} />
                </TabsContent>

                <TabsContent value="notifications">
                  <FeedContent type="notifications" searchQuery={searchQuery} />
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="hidden lg:block lg:col-span-3">
            <TrendingSidebar />
          </div>
        </div>
      </div>
    </div>
  );
}
