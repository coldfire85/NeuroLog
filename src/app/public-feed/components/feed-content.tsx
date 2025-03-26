"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FileItem } from "@/lib/types";
import Image from "next/image";
import {
  Heart,
  MessageSquare,
  Bookmark,
  Share2,
  MoreHorizontal,
  ThumbsUp,
  FileImage,
  FileVideo,
  FileText,
  BookOpen,
  FileUp,
  BookMarked,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { PostComments, Comment } from "./post-comments";
import { useToast } from "@/hooks/use-toast";

// Post types
export type PostType = "image" | "video" | "note" | "article" | "case" | "radiology";

// Define our main feed item type
interface FeedItem {
  id: string;
  author: {
    id: string;
    name: string;
    role: string;
    institution: string;
    avatar: string;
    verified: boolean;
  };
  timestamp: string;
  content: string;
  postType: PostType;
  media?: FileItem | FileItem[];
  likes: number;
  comments: number;
  bookmarks: number;
  tags: string[];
  isLiked: boolean;
  isBookmarked: boolean;
  commentsList?: Comment[];
}

// Props for the component
interface FeedContentProps {
  type: "recent" | "trending" | "following" | "notifications";
  searchQuery: string;
}

// Demo comment data
const demoComments: Record<string, Comment[]> = {
  "post1": [
    {
      id: "comment1",
      author: {
        id: "user2",
        name: "Dr. Michael Chen",
        role: "Neuro-oncologist",
        avatar: ""
      },
      content: "Great case study! I've had similar challenges with DBS electrode placement in patients with atypical anatomy. Would you mind sharing more details about your targeting approach?",
      timestamp: "1h ago",
      likes: 8,
      isLiked: false,
      replies: [
        {
          id: "reply1",
          author: {
            id: "user1",
            name: "Dr. Sarah Johnson",
            role: "Functional Neurosurgeon",
            avatar: ""
          },
          content: "Absolutely, I used a combination of direct and indirect targeting with MER to refine the final position. The STN was rotated about 15° more laterally than typical.",
          timestamp: "45m ago",
          likes: 4,
          isLiked: true
        }
      ]
    }
  ],
  "post2": [
    {
      id: "comment2",
      author: {
        id: "user3",
        name: "Dr. Robert Williams",
        role: "Pediatric Neurosurgeon",
        avatar: ""
      },
      content: "The fluorescence technique is very clear in your video. What concentration of 5-ALA are you using? I've found varied results with the standard dosing.",
      timestamp: "3h ago",
      likes: 12,
      isLiked: true
    }
  ]
};

// Demo content
const demoFeedItems: FeedItem[] = [
  {
    id: "post1",
    author: {
      id: "user1",
      name: "Dr. Sarah Johnson",
      role: "Functional Neurosurgeon",
      institution: "Mayo Clinic",
      avatar: "",
      verified: true
    },
    timestamp: "2h ago",
    content: "Just published a new case study on Deep Brain Stimulation for Parkinson's Disease. This particular case presented some unique challenges due to the patient's anatomy.",
    postType: "case",
    media: {
      id: "img1",
      url: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=2669&auto=format&fit=crop",
      type: "image",
      caption: "DBS electrode placement visualization",
      isPublic: true
    },
    likes: 42,
    comments: 8,
    bookmarks: 15,
    tags: ["DBS", "Parkinson's", "Functional Neurosurgery"],
    isLiked: false,
    isBookmarked: true,
    commentsList: demoComments["post1"]
  },
  {
    id: "post2",
    author: {
      id: "user2",
      name: "Dr. Michael Chen",
      role: "Neuro-oncologist",
      institution: "Stanford Medical",
      avatar: "",
      verified: true
    },
    timestamp: "5h ago",
    content: "Sharing my technique for minimally invasive glioblastoma resection using fluorescence-guided surgery. Would appreciate any feedback or questions from colleagues.",
    postType: "video",
    media: {
      id: "vid1",
      url: "https://www.youtube.com/watch?v=8Z9Eu7F4et0",
      type: "video",
      videoType: "youtube",
      caption: "Fluorescence-guided tumor resection technique",
      isPublic: true
    },
    likes: 87,
    comments: 24,
    bookmarks: 36,
    tags: ["Glioblastoma", "Fluorescence-guided", "Tumor Resection"],
    isLiked: true,
    isBookmarked: false,
    commentsList: demoComments["post2"]
  },
  {
    id: "post3",
    author: {
      id: "user3",
      name: "Dr. Robert Williams",
      role: "Pediatric Neurosurgeon",
      institution: "Children's Hospital",
      avatar: "",
      verified: false
    },
    timestamp: "1d ago",
    content: "Interesting case of congenital hydrocephalus in a 3-month-old. Performed endoscopic third ventriculostomy with great results. Pre and post-op MRIs attached.",
    postType: "radiology",
    media: [
      {
        id: "rad1",
        url: "https://images.unsplash.com/photo-1582606338003-4bc93ca4979c?q=80&w=2670&auto=format&fit=crop",
        type: "radiology",
        caption: "Pre-op MRI showing severe hydrocephalus",
        isPublic: true
      },
      {
        id: "rad2",
        url: "https://images.unsplash.com/photo-1559757148-7fd532bca673?q=80&w=2669&auto=format&fit=crop",
        type: "radiology",
        caption: "Post-op MRI showing reduced ventricular size",
        isPublic: true
      }
    ],
    likes: 65,
    comments: 12,
    bookmarks: 22,
    tags: ["Pediatric", "Hydrocephalus", "ETV"],
    isLiked: false,
    isBookmarked: false,
    commentsList: []
  },
  {
    id: "post4",
    author: {
      id: "user4",
      name: "Dr. Emily Patel",
      role: "Cerebrovascular Surgeon",
      institution: "University Hospital",
      avatar: "",
      verified: true
    },
    timestamp: "2d ago",
    content: "Just completed my 100th aneurysm clipping procedure! Sharing some reflections on how techniques have evolved over the past decade and what I've learned.",
    postType: "note",
    likes: 124,
    comments: 42,
    bookmarks: 38,
    tags: ["Aneurysm", "Cerebrovascular", "Milestone"],
    isLiked: true,
    isBookmarked: true,
    commentsList: []
  }
];

// Icon mapping for post types
const postTypeIcons: Record<PostType, React.ReactNode> = {
  image: <FileImage className="h-4 w-4" />,
  video: <FileVideo className="h-4 w-4" />,
  note: <FileText className="h-4 w-4" />,
  article: <BookOpen className="h-4 w-4" />,
  case: <BookMarked className="h-4 w-4" />,
  radiology: <FileImage className="h-4 w-4" />
};

export function FeedContent({ type, searchQuery }: FeedContentProps) {
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  // Filter feed items based on search and feed type
  useEffect(() => {
    let filteredItems = [...demoFeedItems];

    // Filter by search query
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      filteredItems = filteredItems.filter(item =>
        item.content.toLowerCase().includes(lowerCaseQuery) ||
        item.author.name.toLowerCase().includes(lowerCaseQuery) ||
        item.tags.some(tag => tag.toLowerCase().includes(lowerCaseQuery))
      );
    }

    // Apply additional filters based on feed type
    switch (type) {
      case "trending":
        // Sort by popularity (likes + comments + bookmarks)
        filteredItems.sort((a, b) =>
          (b.likes + b.comments + b.bookmarks) - (a.likes + a.comments + a.bookmarks)
        );
        break;
      case "following":
        // In a real app, filter to only show followed users
        // For demo, we'll just show a subset
        filteredItems = filteredItems.slice(0, 2);
        break;
      case "notifications":
        // In a real app, show interactions with your content
        // For demo, we'll just show the most recent
        filteredItems = filteredItems.slice(0, 1);
        break;
      case "recent":
      default:
        // Already in chronological order in our demo data
        break;
    }

    setFeedItems(filteredItems);
  }, [type, searchQuery]);

  // Handle like interaction
  const handleLike = (postId: string) => {
    setFeedItems(prev =>
      prev.map(item =>
        item.id === postId
          ? {
              ...item,
              isLiked: !item.isLiked,
              likes: item.isLiked ? item.likes - 1 : item.likes + 1
            }
          : item
      )
    );
  };

  // Handle bookmark interaction
  const handleBookmark = (postId: string) => {
    setFeedItems(prev =>
      prev.map(item =>
        item.id === postId
          ? {
              ...item,
              isBookmarked: !item.isBookmarked,
              bookmarks: item.isBookmarked ? item.bookmarks - 1 : item.bookmarks + 1
            }
          : item
      )
    );

    toast({
      title: "Post saved",
      description: "This post has been added to your saved items."
    });
  };

  // Toggle comments expanded state
  const toggleComments = (postId: string) => {
    setExpandedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  // Handle adding a comment
  const handleAddComment = (postId: string, comment: string) => {
    // Update the comments count
    setFeedItems(prev =>
      prev.map(item =>
        item.id === postId
          ? { ...item, comments: item.comments + 1 }
          : item
      )
    );

    // In a real app, you would send this to the server
    // and update with the response
    toast({
      title: "Comment added",
      description: "Your comment has been posted."
    });
  };

  // Empty state
  if (feedItems.length === 0) {
    return (
      <div className="text-center py-12">
        <FileUp className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-medium mb-2">No posts found</h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
          {searchQuery
            ? "No posts match your search criteria. Try different keywords."
            : type === "following"
              ? "You're not following anyone yet. Discover and follow other professionals."
              : "Be the first to share something with the community!"}
        </p>
        <Button className="mt-4 rounded-full">Create a Post</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {feedItems.map(item => (
        <Card key={item.id} className="overflow-hidden">
          <CardHeader className="px-4 py-3">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  {item.author.avatar ? (
                    <AvatarImage src={item.author.avatar} alt={item.author.name} />
                  ) : (
                    <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
                      {item.author.name.split(" ").map(name => name[0]).join("")}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-medium text-sm">{item.author.name}</span>
                    {item.author.verified && (
                      <svg className="h-3.5 w-3.5 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm0-7l-4-4 1.414-1.414L12 12.172l2.586-2.586L16 11l-4 4z" />
                      </svg>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <span>{item.author.role}</span>
                    <span>•</span>
                    <span>{item.timestamp}</span>
                    <Badge variant="outline" className="ml-1 text-xs px-1.5 py-0 h-4 bg-gray-50 dark:bg-gray-800">
                      <span className="flex items-center gap-1">
                        {postTypeIcons[item.postType]}
                        <span className="capitalize">{item.postType}</span>
                      </span>
                    </Badge>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="px-4 py-2">
            <p className="text-sm whitespace-pre-line mb-2">{item.content}</p>

            {/* Tags */}
            {item.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {item.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/40">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Media content */}
            {item.media && (
              <div className="mt-3 rounded-lg overflow-hidden">
                {Array.isArray(item.media) ? (
                  <div className="grid grid-cols-2 gap-1">
                    {item.media.map((mediaItem, index) => (
                      <div key={mediaItem.id} className="aspect-square relative bg-black/5">
                        <Image
                          src={mediaItem.url}
                          alt={mediaItem.caption || `Media ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                ) : item.media.type === "video" && item.media.videoType === "youtube" ? (
                  <div className="aspect-video relative">
                    <div className="aspect-video relative bg-black/5 flex items-center justify-center">
                      <Image
                        src={`https://img.youtube.com/vi/${getYoutubeId(item.media.url)}/maxresdefault.jpg`}
                        alt={item.media.caption || "YouTube thumbnail"}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <div className="rounded-full bg-red-600/90 p-3 flex items-center justify-center shadow-lg">
                          <FileVideo fill="white" className="h-5 w-5 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-video relative">
                    <Image
                      src={item.media.url}
                      alt={item.media.caption || "Post image"}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            )}
          </CardContent>

          <Separator />

          <CardFooter className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className={`flex items-center gap-1.5 rounded-full ${item.isLiked ? 'text-blue-600' : ''}`}
                onClick={() => handleLike(item.id)}
              >
                <ThumbsUp className={`h-4 w-4 ${item.isLiked ? 'fill-blue-600 text-blue-600' : ''}`} />
                <span>{item.likes}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1.5 rounded-full"
                onClick={() => toggleComments(item.id)}
              >
                <MessageSquare className="h-4 w-4" />
                <span>{item.comments}</span>
                {expandedComments.has(item.id) ? (
                  <ChevronUp className="h-3 w-3 ml-0.5" />
                ) : (
                  <ChevronDown className="h-3 w-3 ml-0.5" />
                )}
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className={`rounded-full ${item.isBookmarked ? 'text-blue-600' : ''}`}
                onClick={() => handleBookmark(item.id)}
              >
                <Bookmark className={`h-4 w-4 ${item.isBookmarked ? 'fill-blue-600 text-blue-600' : ''}`} />
              </Button>

              <Button variant="ghost" size="sm" className="rounded-full">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>

          {/* Comments section - only shown when expanded */}
          {expandedComments.has(item.id) && (
            <div className="px-4 pb-4 bg-gray-50/50 dark:bg-gray-800/30">
              <PostComments
                postId={item.id}
                comments={item.commentsList || []}
                onAddComment={handleAddComment}
              />
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}

// Helper function to extract YouTube video ID
function getYoutubeId(url: string): string {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : '';
}
