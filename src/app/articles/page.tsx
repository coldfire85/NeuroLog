"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  PlusCircle,
  Search,
  Calendar,
  ThumbsUp,
  MessageSquare,
  Eye,
  Filter,
  BookOpen,
  Clock,
  ChevronDown,
  Bookmark,
  FileText,
  GraduationCap,
  Stethoscope,
  BrainCircuit,
  ClipboardList,
  Award,
  HeartPulse,
  Users
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Sample data for articles
const ARTICLES = [
  {
    id: 1,
    title: "Advances in Minimally Invasive Brain Tumor Removal",
    subtitle: "A comprehensive review of novel techniques",
    author: "Dr. Sarah Chen",
    authorAvatar: "https://randomuser.me/api/portraits/women/44.jpg",
    authorTitle: "Neurosurgeon, SF Medical Center",
    category: "Surgical Techniques",
    publishedAt: "2023-12-15",
    readTime: "8 min read",
    likes: 142,
    comments: 37,
    views: 1289,
    image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=2670&auto=format&fit=crop",
    saved: false,
    tags: ["brain tumor", "minimally invasive", "surgical innovation"]
  },
  {
    id: 2,
    title: "Machine Learning Applications in Predicting Neurosurgical Outcomes",
    subtitle: "How AI is transforming surgical planning and patient care",
    author: "Dr. Marcus Johnson",
    authorAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
    authorTitle: "Neurosurgeon & Data Scientist",
    category: "Technology",
    publishedAt: "2024-01-02",
    readTime: "12 min read",
    likes: 234,
    comments: 52,
    views: 1876,
    image: "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?q=80&w=2670&auto=format&fit=crop",
    saved: true,
    tags: ["AI", "machine learning", "predictive analytics", "patient outcomes"]
  },
  {
    id: 3,
    title: "Management of Complex Spinal Deformities: A Case Series",
    subtitle: "Surgical considerations and patient outcomes",
    author: "Dr. Emily Rodriguez",
    authorAvatar: "https://randomuser.me/api/portraits/women/65.jpg",
    authorTitle: "Spine Specialist, University Hospital",
    category: "Case Studies",
    publishedAt: "2024-02-10",
    readTime: "15 min read",
    likes: 98,
    comments: 24,
    views: 876,
    image: "https://images.unsplash.com/photo-1614859539975-9438eb59f7b5?q=80&w=2574&auto=format&fit=crop",
    saved: false,
    tags: ["spine surgery", "deformity correction", "case series"]
  },
  {
    id: 4,
    title: "The Role of Neuroplasticity in Stroke Recovery",
    subtitle: "New insights into brain rehabilitation after ischemic events",
    author: "Dr. Michael Wong",
    authorAvatar: "https://randomuser.me/api/portraits/men/22.jpg",
    authorTitle: "Neurologist & Researcher",
    category: "Clinical Research",
    publishedAt: "2024-03-05",
    readTime: "10 min read",
    likes: 176,
    comments: 41,
    views: 1432,
    image: "https://images.unsplash.com/photo-1516546453174-5e1098a4b4af?q=80&w=2670&auto=format&fit=crop",
    saved: true,
    tags: ["neuroplasticity", "stroke recovery", "neurorehabilitation"]
  },
  {
    id: 5,
    title: "Ethical Considerations in Neurosurgical Enhancements",
    subtitle: "Navigating the future of brain-computer interfaces",
    author: "Dr. Priya Sharma",
    authorAvatar: "https://randomuser.me/api/portraits/women/28.jpg",
    authorTitle: "Neurosurgeon & Ethics Committee Chair",
    category: "Ethics",
    publishedAt: "2024-02-25",
    readTime: "14 min read",
    likes: 205,
    comments: 63,
    views: 1892,
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2622&auto=format&fit=crop",
    saved: false,
    tags: ["neuroethics", "brain enhancement", "medical ethics"]
  },
  {
    id: 6,
    title: "Advances in Pediatric Epilepsy Surgery",
    subtitle: "Improving outcomes in drug-resistant epilepsy",
    author: "Dr. Robert Kim",
    authorAvatar: "https://randomuser.me/api/portraits/men/42.jpg",
    authorTitle: "Pediatric Neurosurgeon",
    category: "Surgical Techniques",
    publishedAt: "2024-01-18",
    readTime: "11 min read",
    likes: 132,
    comments: 29,
    views: 956,
    image: "https://images.unsplash.com/photo-1581595219315-a187dd40c322?q=80&w=2574&auto=format&fit=crop",
    saved: false,
    tags: ["pediatric", "epilepsy surgery", "seizure control"]
  }
];

// Categories with icons
const CATEGORIES = [
  { value: "all", label: "All Categories", icon: <BookOpen className="h-4 w-4" /> },
  { value: "surgical-techniques", label: "Surgical Techniques", icon: <Stethoscope className="h-4 w-4" /> },
  { value: "clinical-research", label: "Clinical Research", icon: <FileText className="h-4 w-4" /> },
  { value: "case-studies", label: "Case Studies", icon: <ClipboardList className="h-4 w-4" /> },
  { value: "technology", label: "Technology", icon: <BrainCircuit className="h-4 w-4" /> },
  { value: "medical-education", label: "Medical Education", icon: <GraduationCap className="h-4 w-4" /> },
  { value: "professional-development", label: "Professional Development", icon: <Award className="h-4 w-4" /> },
  { value: "ethics", label: "Ethics", icon: <HeartPulse className="h-4 w-4" /> },
  { value: "patient-care", label: "Patient Care", icon: <Users className="h-4 w-4" /> }
];

export default function ArticlesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [activeTab, setActiveTab] = useState("all");

  // Filter articles based on search, category, and tab
  const filteredArticles = ARTICLES.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          article.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === "all" ||
                            article.category.toLowerCase().replace(/\s+/g, '-') === selectedCategory;

    const matchesTab = activeTab === "all" ||
                      (activeTab === "saved" && article.saved) ||
                      (activeTab === "trending" && article.views > 1000);

    return matchesSearch && matchesCategory && matchesTab;
  });

  // Sort articles
  const sortedArticles = [...filteredArticles].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      case "oldest":
        return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
      case "most-viewed":
        return b.views - a.views;
      case "most-liked":
        return b.likes - a.likes;
      case "most-commented":
        return b.comments - a.comments;
      default:
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    }
  });

  return (
    <div className="container max-w-7xl py-6">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
            Neurosurgical Articles
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Discover the latest research, case studies, and techniques in neurosurgery
          </p>
        </div>
        <Button className="rounded-full" size="sm" asChild>
          <Link href="/articles/create">
            <PlusCircle className="h-4 w-4 mr-2" />
            Write Article
          </Link>
        </Button>
      </div>

      {/* Search and filters */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
        <div className="md:col-span-5 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search articles by title, subtitle or tags..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="md:col-span-3">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((category) => (
                <SelectItem key={category.value} value={category.value} className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    {category.icon}
                    <span>{category.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="md:col-span-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full">
                <Filter className="h-4 w-4 mr-2" />
                Sort By
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSortBy("newest")}>
                <Calendar className="h-4 w-4 mr-2" />
                Newest
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("oldest")}>
                <Clock className="h-4 w-4 mr-2" />
                Oldest
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("most-viewed")}>
                <Eye className="h-4 w-4 mr-2" />
                Most Viewed
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("most-liked")}>
                <ThumbsUp className="h-4 w-4 mr-2" />
                Most Liked
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("most-commented")}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Most Commented
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="md:col-span-2 flex items-center justify-between bg-gray-100 dark:bg-gray-800 rounded-md px-3">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {filteredArticles.length} results
          </span>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Articles</TabsTrigger>
          <TabsTrigger value="saved">Saved</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Articles grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedArticles.length > 0 ? (
          sortedArticles.map((article) => (
            <Card key={article.id} className="overflow-hidden h-full flex flex-col transition-all duration-200 hover:shadow-md">
              <Link href={`/articles/${article.id}`} className="relative block h-48 overflow-hidden">
                <div
                  className="w-full h-full bg-center bg-cover transform transition-transform hover:scale-105"
                  style={{ backgroundImage: `url(${article.image})` }}
                />
                <div className="absolute top-2 right-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-8 w-8 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 ${article.saved ? 'text-yellow-500' : 'text-white'}`}
                    onClick={(e) => {
                      e.preventDefault();
                      // In a real app, this would toggle saved status
                    }}
                  >
                    <Bookmark className="h-4 w-4" />
                  </Button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                  <Badge variant="secondary" className="bg-blue-500/90 text-white border-none text-xs">
                    {article.category}
                  </Badge>
                </div>
              </Link>

              <CardContent className="flex-grow pt-4">
                <div className="flex items-center mb-2">
                  <div className="h-6 w-6 rounded-full overflow-hidden mr-2">
                    <img src={article.authorAvatar} alt={article.author} className="h-full w-full object-cover" />
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">{article.author}</span>
                    <span className="text-gray-500 dark:text-gray-400 text-xs block">{article.authorTitle}</span>
                  </div>
                </div>

                <Link href={`/articles/${article.id}`} className="block">
                  <h3 className="font-bold text-lg mb-1 line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-2">
                    {article.subtitle}
                  </p>
                </Link>

                <div className="flex flex-wrap gap-1 mb-2">
                  {article.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs bg-gray-100 dark:bg-gray-800">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>

              <CardFooter className="pt-0 border-t text-xs text-gray-500 dark:text-gray-400">
                <div className="flex justify-between w-full">
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {article.readTime}
                  </div>
                </div>
              </CardFooter>

              <div className="flex justify-between px-4 py-2 bg-gray-50 dark:bg-gray-800/50 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center">
                  <ThumbsUp className="h-3 w-3 mr-1" />
                  {article.likes}
                </div>
                <div className="flex items-center">
                  <MessageSquare className="h-3 w-3 mr-1" />
                  {article.comments}
                </div>
                <div className="flex items-center">
                  <Eye className="h-3 w-3 mr-1" />
                  {article.views}
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
            <FileText className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-xl font-medium mb-2">No articles found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4 max-w-md">
              We couldn't find any articles matching your criteria. Try adjusting your filters or search terms.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
                setSortBy("newest");
                setActiveTab("all");
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
