"use client";

import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ThumbsUp, Reply, MoreHorizontal, SendHorizontal } from "lucide-react";

// Comment type definition
export interface Comment {
  id: string;
  author: {
    id: string;
    name: string;
    role: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
  likes: number;
  replies?: Comment[];
  isLiked: boolean;
}

interface PostCommentsProps {
  postId: string;
  comments: Comment[];
  onAddComment: (postId: string, comment: string) => void;
}

// Demo user data (would come from auth context in a real app)
const currentUser = {
  id: "current-user",
  name: "Dr. John Smith",
  role: "Neurosurgeon",
  avatar: ""
};

export function PostComments({ postId, comments, onAddComment }: PostCommentsProps) {
  const [commentText, setCommentText] = useState("");
  const [localComments, setLocalComments] = useState<Comment[]>(comments);
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Update local comments when prop comments change
  useEffect(() => {
    setLocalComments(comments);
  }, [comments]);

  // Handle adding a new comment
  const handleAddComment = () => {
    if (!commentText.trim()) return;

    // Call the parent handler
    onAddComment(postId, commentText);

    // Update the local state with the new comment
    // (in a real app, this would come from the server response)
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      author: currentUser,
      content: commentText,
      timestamp: "Just now",
      likes: 0,
      isLiked: false
    };

    setLocalComments(prev => [newComment, ...prev]);
    setCommentText("");
  };

  // Toggle like on a comment
  const handleLikeComment = (commentId: string) => {
    setLocalComments(prev =>
      prev.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            isLiked: !comment.isLiked,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1
          };
        }

        // Check nested replies
        if (comment.replies) {
          const updatedReplies = comment.replies.map(reply =>
            reply.id === commentId
              ? {
                  ...reply,
                  isLiked: !reply.isLiked,
                  likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1
                }
              : reply
          );

          if (updatedReplies.some(r => r.id === commentId)) {
            return { ...comment, replies: updatedReplies };
          }
        }

        return comment;
      })
    );
  };

  // Toggle expanded state for a comment (to show/hide replies)
  const toggleCommentExpanded = (commentId: string) => {
    setExpandedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  // Auto-resize textarea as user types
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [commentText]);

  return (
    <div className="space-y-4 pt-2">
      {/* Comment input */}
      <div className="flex gap-3">
        <Avatar className="h-8 w-8 flex-shrink-0">
          {currentUser.avatar ? (
            <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
          ) : (
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              {currentUser.name.split(" ").map(name => name[0]).join("")}
            </AvatarFallback>
          )}
        </Avatar>

        <div className="flex-1 flex items-end gap-2">
          <div className="relative flex-1">
            <Textarea
              ref={textareaRef}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              className="min-h-[40px] max-h-[200px] pr-10 py-2 resize-none"
              rows={1}
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute bottom-1 right-1 h-8 w-8 rounded-full text-blue-500"
              onClick={handleAddComment}
              disabled={!commentText.trim()}
            >
              <SendHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {localComments.length > 0 && (
        <>
          <Separator className="my-3" />

          {/* Comment list */}
          <div className="space-y-4">
            {localComments.map(comment => (
              <div key={comment.id} className="space-y-2">
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    {comment.author.avatar ? (
                      <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                    ) : (
                      <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
                        {comment.author.name.split(" ").map(name => name[0]).join("")}
                      </AvatarFallback>
                    )}
                  </Avatar>

                  <div className="flex-1">
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-medium text-sm">
                            {comment.author.name}
                          </span>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {comment.author.role}
                          </p>
                        </div>
                        <span className="text-xs text-gray-500">{comment.timestamp}</span>
                      </div>
                      <p className="mt-1 text-sm">{comment.content}</p>
                    </div>

                    <div className="flex items-center gap-2 mt-0.5 pl-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`h-6 px-2 text-xs rounded-full ${comment.isLiked ? 'text-blue-600' : ''}`}
                        onClick={() => handleLikeComment(comment.id)}
                      >
                        <ThumbsUp className={`h-3 w-3 mr-1 ${comment.isLiked ? 'fill-blue-600 text-blue-600' : ''}`} />
                        {comment.likes > 0 && comment.likes}
                        <span className="ml-1">Like</span>
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs rounded-full"
                        onClick={() => toggleCommentExpanded(comment.id)}
                      >
                        <Reply className="h-3 w-3 mr-1" />
                        Reply
                      </Button>

                      <span className="text-xs text-gray-500">
                        {comment.replies?.length ? `${comment.replies.length} ${comment.replies.length === 1 ? 'reply' : 'replies'}` : ''}
                      </span>
                    </div>

                    {/* Replies section - only visible when expanded */}
                    {comment.replies && comment.replies.length > 0 && expandedComments.has(comment.id) && (
                      <div className="mt-2 pl-4 space-y-3">
                        {comment.replies.map(reply => (
                          <div key={reply.id} className="flex gap-2">
                            <Avatar className="h-6 w-6 flex-shrink-0">
                              {reply.author.avatar ? (
                                <AvatarImage src={reply.author.avatar} alt={reply.author.name} />
                              ) : (
                                <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-xs">
                                  {reply.author.name.split(" ").map(name => name[0]).join("")}
                                </AvatarFallback>
                              )}
                            </Avatar>

                            <div className="flex-1">
                              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-2">
                                <div className="flex justify-between items-start">
                                  <span className="font-medium text-xs">
                                    {reply.author.name}
                                  </span>
                                  <span className="text-xs text-gray-500">{reply.timestamp}</span>
                                </div>
                                <p className="mt-0.5 text-xs">{reply.content}</p>
                              </div>

                              <div className="flex items-center gap-2 mt-0.5 pl-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className={`h-5 px-1.5 text-xs rounded-full ${reply.isLiked ? 'text-blue-600' : ''}`}
                                  onClick={() => handleLikeComment(reply.id)}
                                >
                                  <ThumbsUp className={`h-2.5 w-2.5 mr-1 ${reply.isLiked ? 'fill-blue-600 text-blue-600' : ''}`} />
                                  {reply.likes > 0 && reply.likes}
                                  <span className="ml-1">Like</span>
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
