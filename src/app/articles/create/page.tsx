"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  Image as ImageIcon,
  Link as LinkIcon,
  ListOrdered,
  ListIcon,
  Quote,
  Heading1,
  Heading2,
  Bold,
  Italic,
  Save,
  BookOpen,
  Globe,
  Clock,
  Tags,
  AlertCircle,
  X,
  Plus,
  Upload,
  Info
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { marked } from 'marked';

// Article categories
const categories = [
  "Clinical Research",
  "Surgical Techniques",
  "Case Studies",
  "Medical Education",
  "Technology",
  "Professional Development",
  "Ethics",
  "Patient Care"
];

export default function CreateArticlePage() {
  const router = useRouter();
  const { toast } = useToast();

  // Article state
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [coverImage, setCoverImage] = useState("");
  const [showHelpDialog, setShowHelpDialog] = useState(false);

  // Handle image upload
  const handleImageUpload = () => {
    // In a real app, this would upload to a server and return a URL
    setCoverImage("https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=2669&auto=format&fit=crop");

    toast({
      title: "Image uploaded",
      description: "Cover image has been added to your article."
    });
  };

  // Handle tag addition
  const handleAddTag = () => {
    if (!newTag.trim()) return;
    if (tags.includes(newTag.trim())) {
      toast({
        title: "Tag already exists",
        description: "This tag is already added to your article.",
        variant: "destructive"
      });
      return;
    }

    setTags([...tags, newTag.trim()]);
    setNewTag("");
  };

  // Handle tag removal
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // Handle save article
  const handleSaveArticle = () => {
    // Validate required fields
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please provide a title for your article.",
        variant: "destructive"
      });
      return;
    }

    if (!content.trim()) {
      toast({
        title: "Content required",
        description: "Please add some content to your article.",
        variant: "destructive"
      });
      return;
    }

    // Save article logic
    setSaving(true);

    // Simulate API call
    setTimeout(() => {
      setSaving(false);

      toast({
        title: "Article saved",
        description: isPublic
          ? "Your article has been published and is now visible to the community."
          : "Your article has been saved as a draft."
      });

      // Redirect to article list or view
      router.push("/articles");
    }, 1500);
  };

  // Text formatting functions
  const insertFormatting = (format: string) => {
    // Insert appropriate markup based on the selected format
    switch (format) {
      case "heading1":
        setContent(prev => `${prev}\n## Heading 1\n`);
        break;
      case "heading2":
        setContent(prev => `${prev}\n### Heading 2\n`);
        break;
      case "bold":
        setContent(prev => `${prev}**bold text** `);
        break;
      case "italic":
        setContent(prev => `${prev}*italic text* `);
        break;
      case "bulletList":
        setContent(prev => `${prev}\n- List item 1\n- List item 2\n- List item 3\n`);
        break;
      case "numberedList":
        setContent(prev => `${prev}\n1. List item 1\n2. List item 2\n3. List item 3\n`);
        break;
      case "quote":
        setContent(prev => `${prev}\n> Quoted text goes here. This is useful for citations or highlighting important information.\n`);
        break;
      case "link":
        setContent(prev => `${prev}[link text](https://example.com) `);
        break;
      case "image":
        setContent(prev => `${prev}\n![Image description](https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?q=80&w=2070&auto=format&fit=crop)\n`);
        break;
      default:
        setContent(prev => `${prev}\n${format}\n`);
    }
  };

  // Function to convert markdown to HTML for preview
  const getHtmlContent = () => {
    if (!content) return '';

    try {
      // Use marked to convert markdown to HTML
      return marked(content);
    } catch (error) {
      console.error('Error converting markdown:', error);
      return `<p class="text-red-500">Error rendering markdown. Please check your syntax.</p>${content}`;
    }
  };

  // Help dialog content
  const markdownHelpContent = (
    <div className="space-y-4 text-sm">
      <h3 className="text-lg font-bold">Markdown Formatting Guide</h3>

      <div>
        <h4 className="font-medium">Headings</h4>
        <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded-md mt-1">{`## Heading 1\n### Heading 2`}</pre>
      </div>

      <div>
        <h4 className="font-medium">Emphasis</h4>
        <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded-md mt-1">{`**bold text**\n*italic text*`}</pre>
      </div>

      <div>
        <h4 className="font-medium">Lists</h4>
        <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded-md mt-1">{`- Unordered item\n- Another item\n\n1. Ordered item\n2. Second item`}</pre>
      </div>

      <div>
        <h4 className="font-medium">Links and Images</h4>
        <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded-md mt-1">{`[Link text](https://example.com)\n![Image alt text](image-url.jpg)`}</pre>
      </div>

      <div>
        <h4 className="font-medium">Blockquotes</h4>
        <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded-md mt-1">{`> This is a blockquote\n> It can span multiple lines`}</pre>
      </div>

      <div>
        <h4 className="font-medium">Code</h4>
        <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded-md mt-1">{"\`inline code\`\n\n```\ncode block\nwith multiple lines\n```"}</pre>
      </div>
    </div>
  );

  return (
    <div className="container max-w-5xl py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full"
            onClick={() => router.push("/articles")}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Articles
          </Button>

          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
            {title || "New Article"}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className={`rounded-full ${previewMode ? 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800' : ''}`}
            onClick={() => setPreviewMode(!previewMode)}
          >
            <BookOpen className="h-4 w-4 mr-2" />
            {previewMode ? "Exit Preview" : "Preview"}
          </Button>

          <Button
            variant="default"
            className="rounded-full"
            onClick={handleSaveArticle}
            disabled={saving}
          >
            {saving ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {isPublic ? "Publish" : "Save Draft"}
              </>
            )}
          </Button>
        </div>
      </div>

      {previewMode ? (
        // Preview mode
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          {coverImage && (
            <div className="w-full h-72 relative">
              <div
                className="w-full h-full bg-center bg-cover"
                style={{ backgroundImage: `url(${coverImage})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 text-white">
                <h1 className="text-3xl font-bold mb-2">{title || "Untitled Article"}</h1>
                {subtitle && <p className="text-xl text-white/80">{subtitle}</p>}
              </div>
            </div>
          )}

          <div className="p-8">
            {!coverImage && (
              <>
                <h1 className="text-3xl font-bold mb-2">{title || "Untitled Article"}</h1>
                {subtitle && <p className="text-xl text-gray-500 dark:text-gray-400">{subtitle}</p>}
              </>
            )}

            <div className="flex flex-wrap items-center gap-4 my-4">
              {category && (
                <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                  {category}
                </span>
              )}

              <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                <Clock className="h-3.5 w-3.5 mr-1" />
                {new Date().toLocaleDateString()}
              </span>

              <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                <Globe className="h-3.5 w-3.5 mr-1" />
                {isPublic ? "Public" : "Draft"}
              </span>
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}

            <Separator className="my-6" />

            <div className="prose dark:prose-invert max-w-none">
              {content ? (
                <div dangerouslySetInnerHTML={{ __html: getHtmlContent() }} />
              ) : (
                <p className="text-gray-500 dark:text-gray-400 italic">
                  This article has no content yet. Start writing to see a preview.
                </p>
              )}
            </div>
          </div>
        </div>
      ) : (
        // Edit mode
        <div className="grid gap-6">
          {/* Title Section */}
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-base">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter a descriptive title..."
                  className="mt-1.5 text-lg font-medium"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="subtitle" className="text-base">Subtitle (optional)</Label>
                <Input
                  id="subtitle"
                  placeholder="Add a subtitle to provide more context..."
                  className="mt-1.5"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                />
              </div>

              <div>
                <Label className="text-base">Cover Image</Label>
                <div className="mt-1.5">
                  {coverImage ? (
                    <div className="relative h-48 w-full rounded-md overflow-hidden">
                      <div
                        className="w-full h-full bg-center bg-cover"
                        style={{ backgroundImage: `url(${coverImage})` }}
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8 rounded-full"
                        onClick={() => setCoverImage("")}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div
                      className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
                      onClick={handleImageUpload}
                    >
                      <Upload className="h-10 w-10 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Click to upload a cover image
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        Recommended: 1200 x 600 pixels
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Content Section */}
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="content" className="text-base">Content (Markdown)</Label>
                <Dialog open={showHelpDialog} onOpenChange={setShowHelpDialog}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center gap-1">
                      <Info className="h-4 w-4" />
                      Markdown Guide
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Markdown Formatting Guide</DialogTitle>
                    </DialogHeader>
                    {markdownHelpContent}
                  </DialogContent>
                </Dialog>
              </div>

              {/* Rich text toolbar */}
              <div className="flex flex-wrap items-center gap-1 p-1 border rounded-md bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 rounded-md"
                  onClick={() => insertFormatting("heading1")}
                >
                  <Heading1 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 rounded-md"
                  onClick={() => insertFormatting("heading2")}
                >
                  <Heading2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 rounded-md"
                  onClick={() => insertFormatting("bold")}
                >
                  <Bold className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 rounded-md"
                  onClick={() => insertFormatting("italic")}
                >
                  <Italic className="h-4 w-4" />
                </Button>

                <Separator orientation="vertical" className="h-6 mx-1" />

                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 rounded-md"
                  onClick={() => insertFormatting("bulletList")}
                >
                  <ListIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 rounded-md"
                  onClick={() => insertFormatting("numberedList")}
                >
                  <ListOrdered className="h-4 w-4" />
                </Button>

                <Separator orientation="vertical" className="h-6 mx-1" />

                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 rounded-md"
                  onClick={() => insertFormatting("quote")}
                >
                  <Quote className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 rounded-md"
                  onClick={() => insertFormatting("link")}
                >
                  <LinkIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 rounded-md"
                  onClick={() => insertFormatting("image")}
                >
                  <ImageIcon className="h-4 w-4" />
                </Button>
              </div>

              <Textarea
                id="content"
                placeholder="Write your article content here using Markdown..."
                className="min-h-[300px] font-mono text-sm"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />

              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <AlertCircle className="h-3 w-3" />
                <span>
                  This editor supports Markdown. Use the toolbar above or click on "Markdown Guide" for formatting help.
                </span>
              </div>
            </div>
          </Card>

          {/* Metadata Section */}
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <Label htmlFor="category" className="text-base">Category</Label>
                <Select
                  value={category}
                  onValueChange={setCategory}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-base mb-1.5 block">Tags</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1 pr-1">
                      #{tag}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                        onClick={() => handleRemoveTag(tag)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a tag..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    onClick={handleAddTag}
                    disabled={!newTag.trim()}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="public" className="text-base">Visibility</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {isPublic
                      ? "Your article will be visible to the community"
                      : "Save as draft (only visible to you)"}
                  </p>
                </div>
                <Switch
                  id="public"
                  checked={isPublic}
                  onCheckedChange={setIsPublic}
                />
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
