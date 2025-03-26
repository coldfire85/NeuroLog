"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ChevronLeft,
  MessageSquare,
  ThumbsUp,
  Share,
  Bookmark,
  Calendar,
  Clock,
  Eye,
  Heart,
  Flag,
  Printer,
  Download
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Sample data for articles
const ARTICLES = [
  {
    id: "1",
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
    tags: ["brain tumor", "minimally invasive", "surgical innovation"],
    content: `
      <p class="lead">Recent advancements in minimally invasive neurosurgical techniques have revolutionized how brain tumors are treated, offering patients better outcomes with fewer complications.</p>

      <h2>Introduction</h2>
      <p>Neurosurgery has witnessed significant technological advancements in the past decade. Minimally invasive approaches to brain tumor removal represent one of the most important paradigm shifts in modern neurosurgical practice. This article reviews the latest techniques, outcomes, and future directions in this rapidly evolving field.</p>

      <h2>Key Techniques</h2>
      <p>Several innovative approaches have emerged:</p>

      <h3>1. Endoscopic Endonasal Approach (EEA)</h3>
      <p>The endoscopic endonasal approach allows neurosurgeons to access tumors in the skull base through the nasal passages. This technique avoids brain retraction and minimizes manipulation of critical neurovascular structures.</p>

      <p>Benefits include:</p>
      <ul>
        <li>No visible scarring</li>
        <li>Reduced brain manipulation</li>
        <li>Shorter hospital stays</li>
        <li>Faster recovery times</li>
      </ul>

      <h3>2. Keyhole Craniotomies</h3>
      <p>These approaches utilize smaller skull openings (typically 2-4 cm) strategically placed to access deep-seated tumors. Advanced planning with neuroimaging creates optimal trajectories that minimize brain exposure while maintaining surgical efficacy.</p>

      <h3>3. Exoscope-Assisted Surgery</h3>
      <p>The exoscope represents the evolution of the operating microscope, providing high-definition 3D visualization with greater working distance and flexibility. This technology enhances visualization while allowing for smaller cranial openings.</p>

      <h2>Clinical Outcomes</h2>
      <p>The literature increasingly demonstrates the benefits of minimally invasive approaches:</p>

      <ul>
        <li>Reduced length of hospital stay (average 2.3 days vs. 5.1 days for conventional approaches)</li>
        <li>Lower infection rates (1.2% vs. 4.7%)</li>
        <li>Decreased postoperative pain scores</li>
        <li>Earlier return to daily activities</li>
      </ul>

      <p>A meta-analysis of 32 studies including 2,190 patients found comparable or superior extent of resection for properly selected cases compared to traditional approaches.</p>

      <h2>Future Directions</h2>
      <p>The field continues to evolve with several promising technologies:</p>

      <h3>Robotic Assistance</h3>
      <p>Robotic platforms are being developed to enhance the surgeon's precision during minimally invasive procedures. Early studies show promising results for stability and accuracy in accessing deep-seated lesions.</p>

      <h3>Augmented Reality Navigation</h3>
      <p>AR overlays allow real-time visualization of critical structures and optimal surgical corridors, enhancing the surgeon's spatial awareness during minimally invasive approaches.</p>

      <h2>Conclusion</h2>
      <p>Minimally invasive techniques for brain tumor removal continue to advance, offering patients the benefits of maximal tumor resection with minimal collateral damage. As technologies evolve and more neurosurgeons receive specialized training, these approaches will likely become the standard of care for appropriately selected patients.</p>
    `
  },
  {
    id: "2",
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
    tags: ["AI", "machine learning", "predictive analytics", "patient outcomes"],
    content: `
      <p class="lead">Artificial intelligence and machine learning are revolutionizing neurosurgical practice by providing powerful tools for predicting patient outcomes, improving surgical planning, and enhancing decision-making.</p>

      <h2>Introduction</h2>
      <p>The integration of machine learning (ML) algorithms with neurosurgical practice represents one of the most significant technological advancements in the field. This article examines the current state and future potential of ML applications in predicting neurosurgical outcomes.</p>

      <h2>Current Applications</h2>

      <h3>Preoperative Risk Stratification</h3>
      <p>ML models have demonstrated superior accuracy in predicting surgical risks compared to traditional scoring systems. A recent study utilizing a random forest algorithm achieved 89% accuracy in predicting complications after craniotomy, significantly outperforming the ASA physical status classification.</p>

      <h3>Tumor Classification</h3>
      <p>Convolutional neural networks (CNNs) can now analyze MRI images to predict tumor histopathology with accuracy approaching that of experienced neuroradiologists. This allows for better preoperative planning and patient counseling.</p>

      <p>Recent advances include:</p>
      <ul>
        <li>Automated segmentation of tumor boundaries</li>
        <li>Prediction of molecular markers (e.g., IDH mutation, 1p/19q codeletion)</li>
        <li>Differentiation between tumor progression and pseudoprogression</li>
      </ul>

      <h3>Outcome Prediction</h3>
      <p>ML algorithms have been developed to predict functional outcomes following various neurosurgical procedures:</p>

      <ul>
        <li>A support vector machine model predicting functional independence after stroke thrombectomy achieved 85% accuracy</li>
        <li>Deep learning models predicting seizure outcomes after epilepsy surgery (76% accuracy, exceeding conventional methods)</li>
        <li>Neural networks predicting quality of life metrics after spine surgery with 81% accuracy</li>
      </ul>

      <h2>Implementation Challenges</h2>

      <h3>Data Quality and Quantity</h3>
      <p>The performance of ML algorithms depends heavily on the quality and quantity of training data. Multicenter collaborations are essential to develop robust models that generalize across diverse patient populations.</p>

      <h3>Interpretability</h3>
      <p>Many powerful ML algorithms function as "black boxes," making their decision-making processes opaque to clinicians. Explainable AI approaches are being developed to address this limitation.</p>

      <h3>Ethical Considerations</h3>
      <p>Implementing ML systems in clinical practice raises important ethical questions regarding:</p>
      <ul>
        <li>Algorithmic bias and health disparities</li>
        <li>Responsibility and liability for ML-guided decisions</li>
        <li>Patient privacy and data security</li>
        <li>Informed consent in the era of AI-assisted care</li>
      </ul>

      <h2>Future Directions</h2>

      <h3>Federated Learning</h3>
      <p>This approach allows multiple institutions to train ML models collaboratively without sharing sensitive patient data, potentially accelerating the development of robust algorithms while maintaining privacy.</p>

      <h3>Real-time Surgical Guidance</h3>
      <p>ML systems integrated with intraoperative imaging may provide real-time feedback during procedures, alerting surgeons to potential complications or guiding resection boundaries.</p>

      <h3>Personalized Treatment Planning</h3>
      <p>Advanced algorithms will increasingly tailor treatment recommendations to individual patients based on their unique clinical, genetic, and imaging profiles.</p>

      <h2>Conclusion</h2>
      <p>Machine learning is poised to transform neurosurgical practice by enhancing our ability to predict outcomes and tailor treatments. While significant challenges remain, the potential benefits for patient care are substantial. Neurosurgeons must actively engage with these technologies to ensure their responsible and effective implementation.</p>
    `
  }
];

interface Article {
  id: string;
  title: string;
  subtitle: string;
  author: string;
  authorAvatar: string;
  authorTitle: string;
  category: string;
  publishedAt: string;
  readTime: string;
  likes: number;
  comments: number;
  views: number;
  image: string;
  saved: boolean;
  tags: string[];
  content: string;
}

export default function ArticleViewPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [article, setArticle] = useState<Article | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch article data
  useEffect(() => {
    if (params.id) {
      // In a real app, this would be an API call
      const foundArticle = ARTICLES.find(a => a.id === params.id);
      if (foundArticle) {
        setArticle(foundArticle);
        setLikeCount(foundArticle.likes);
        setIsSaved(foundArticle.saved);
      } else {
        // Article not found
        router.push('/articles');
      }
      setLoading(false);
    }
  }, [params.id, router]);

  // Handle like action
  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);

    toast({
      title: isLiked ? "Removed like" : "Article liked",
      description: isLiked ? "You've removed your like from this article" : "You've liked this article",
    });
  };

  // Handle bookmark/save action
  const handleSave = () => {
    setIsSaved(!isSaved);

    toast({
      title: isSaved ? "Removed from saved" : "Article saved",
      description: isSaved ? "Article removed from your saved items" : "Article saved to your collection",
    });
  };

  // Handle share action
  const handleShare = () => {
    // In a real app, this would open a share dialog
    navigator.clipboard.writeText(window.location.href);

    toast({
      title: "Link copied",
      description: "Article link copied to clipboard",
    });
  };

  if (loading) {
    return (
      <div className="container max-w-4xl py-8">
        <div className="animate-pulse">
          <div className="h-8 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded mb-8"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
          <div className="space-y-3 mt-8">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container max-w-4xl py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Article not found</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          The article you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild>
          <Link href="/articles">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Articles
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900">
      {/* Hero section with article image */}
      <div
        className="w-full h-96 bg-center bg-cover relative"
        style={{
          backgroundImage: `url(${article.image})`,
          backgroundPosition: 'center 30%'
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="container max-w-4xl mx-auto h-full flex flex-col justify-end p-6 relative z-10">
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-4 left-6 text-white hover:bg-white/20 mb-auto"
            asChild
          >
            <Link href="/articles">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Articles
            </Link>
          </Button>

          <Badge className="mb-3 bg-blue-500 hover:bg-blue-600 text-white border-none">
            {article.category}
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {article.title}
          </h1>
          <p className="text-xl text-white/80 mb-4">
            {article.subtitle}
          </p>
          <div className="flex flex-wrap items-center gap-6 text-white/70 text-sm">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8 border-2 border-white/20">
                <AvatarImage src={article.authorAvatar} alt={article.author} />
                <AvatarFallback>{article.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <span className="font-medium text-white">{article.author}</span>
                <span className="block text-xs">{article.authorTitle}</span>
              </div>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {article.readTime}
            </div>
            <div className="flex items-center">
              <Eye className="h-4 w-4 mr-1" />
              {article.views.toLocaleString()} views
            </div>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="container max-w-4xl mx-auto py-8 px-6">
        <div className="flex flex-wrap gap-2 mb-6">
          {article.tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="bg-gray-100 dark:bg-gray-800 text-sm">
              #{tag}
            </Badge>
          ))}
        </div>

        {/* Action buttons */}
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 mb-8 flex flex-wrap justify-between gap-2">
          <div className="flex gap-2">
            <Button
              variant={isLiked ? "default" : "outline"}
              size="sm"
              className={isLiked ? "bg-blue-500 hover:bg-blue-600" : ""}
              onClick={handleLike}
            >
              <Heart className={`h-4 w-4 mr-1.5 ${isLiked ? "fill-current" : ""}`} />
              <span>{likeCount}</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const commentSection = document.getElementById('comments');
                if (commentSection) {
                  commentSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              <MessageSquare className="h-4 w-4 mr-1.5" />
              <span>{article.comments}</span>
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              variant={isSaved ? "default" : "outline"}
              size="sm"
              className={isSaved ? "bg-yellow-500 hover:bg-yellow-600" : ""}
              onClick={handleSave}
            >
              <Bookmark className={`h-4 w-4 mr-1.5 ${isSaved ? "fill-current" : ""}`} />
              {isSaved ? "Saved" : "Save"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
            >
              <Share className="h-4 w-4 mr-1.5" />
              Share
            </Button>
            <Button
              variant="outline"
              size="sm"
            >
              <Printer className="h-4 w-4 mr-1.5" />
              Print
            </Button>
            <Button
              variant="outline"
              size="sm"
            >
              <Download className="h-4 w-4 mr-1.5" />
              PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-red-500 hover:text-red-600"
            >
              <Flag className="h-4 w-4 mr-1.5" />
              Report
            </Button>
          </div>
        </div>

        {/* Article content */}
        <div
          className="prose dark:prose-invert max-w-none mb-12"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Author info */}
        <div className="border dark:border-gray-700 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={article.authorAvatar} alt={article.author} />
              <AvatarFallback>{article.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-bold text-lg mb-1">{article.author}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">{article.authorTitle}</p>
              <p className="text-sm">
                Clinical researcher and neurosurgeon specializing in minimally invasive techniques.
                Published in leading journals including Journal of Neurosurgery and Neurosurgical Focus.
              </p>
            </div>
          </div>
        </div>

        {/* Comments section */}
        <div id="comments" className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Comments ({article.comments})</h2>

          {/* This would be replaced with actual comments component */}
          <div className="space-y-6">
            <div className="p-4 rounded-lg border dark:border-gray-700">
              <div className="flex items-start gap-3 mb-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://randomuser.me/api/portraits/men/41.jpg" alt="Dr. James Wilson" />
                  <AvatarFallback>JW</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Dr. James Wilson</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">2 days ago</span>
                  </div>
                  <p className="text-sm mt-1">
                    Great overview of the latest techniques. I've been implementing the endoscopic approach in my practice with good results. Have you found any specific contraindications that aren't widely discussed in the literature?
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <button className="flex items-center gap-1 hover:text-blue-500">
                      <ThumbsUp className="h-3 w-3" /> 12
                    </button>
                    <button className="flex items-center gap-1 hover:text-blue-500">
                      <MessageSquare className="h-3 w-3" /> Reply
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg border dark:border-gray-700">
              <div className="flex items-start gap-3 mb-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://randomuser.me/api/portraits/women/68.jpg" alt="Dr. Maria Lopez" />
                  <AvatarFallback>ML</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Dr. Maria Lopez</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">5 days ago</span>
                  </div>
                  <p className="text-sm mt-1">
                    I would add that patient selection is critical for these techniques. Not every tumor is appropriate for minimally invasive approaches, and proper preoperative planning with high-quality imaging is essential.
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <button className="flex items-center gap-1 hover:text-blue-500">
                      <ThumbsUp className="h-3 w-3" /> 8
                    </button>
                    <button className="flex items-center gap-1 hover:text-blue-500">
                      <MessageSquare className="h-3 w-3" /> Reply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related articles */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ARTICLES.filter(a => a.id !== article.id).slice(0, 2).map((relatedArticle) => (
              <Link key={relatedArticle.id} href={`/articles/${relatedArticle.id}`} className="group">
                <div className="border dark:border-gray-700 rounded-lg overflow-hidden flex flex-col h-full hover:shadow-md transition-all">
                  <div className="h-40 relative">
                    <div
                      className="w-full h-full bg-center bg-cover transform transition-transform group-hover:scale-105"
                      style={{ backgroundImage: `url(${relatedArticle.image})` }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                      <Badge variant="secondary" className="bg-blue-500/90 text-white border-none text-xs">
                        {relatedArticle.category}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4 flex-grow">
                    <h3 className="font-bold text-lg mb-1 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {relatedArticle.title}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2">
                      {relatedArticle.subtitle}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
