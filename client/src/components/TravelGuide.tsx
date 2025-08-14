import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { TravelGuideArticle } from "@shared/schema";
import { Calendar, User } from "lucide-react";

export default function TravelGuide() {
  const { data: articles, isLoading } = useQuery<TravelGuideArticle[]>({
    queryKey: ["/api/travel-guide"],
  });

  // Sample articles when no data is available
  const sampleArticles = [
    {
      id: "1",
      title: "First Time Train Travel in India",
      excerpt: "Everything you need to know about booking and traveling by train in India. From seat classes to station navigation...",
      imageUrl: null,
      publishedAt: "2024-12-15T00:00:00Z"
    },
    {
      id: "2",
      title: "Best Indian Food by Region",
      excerpt: "Discover the diverse culinary landscape of India. From spicy South Indian curries to rich Punjabi delicacies...",
      imageUrl: null,
      publishedAt: "2024-12-12T00:00:00Z"
    },
    {
      id: "3",
      title: "Festival Season Travel Tips",
      excerpt: "Plan your travel around India's vibrant festivals. Best times to visit, what to expect, and booking strategies...",
      imageUrl: null,
      publishedAt: "2024-12-10T00:00:00Z"
    }
  ];

  const displayArticles = articles && articles.length > 0 ? articles.slice(0, 3) : sampleArticles;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" data-testid="guide-section-title">
            Travel Guide
          </h2>
          <p className="text-xl text-gray-600" data-testid="guide-section-subtitle">
            Tips, guides and insights for your perfect Indian vacation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <Skeleton className="w-full h-48" />
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-full mb-3" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-24" />
                </CardContent>
              </Card>
            ))
          ) : (
            displayArticles.map((article, index) => (
              <Card 
                key={article.id || index} 
                className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                data-testid={`guide-article-${article.id || index}`}
              >
                <img
                  src={article.imageUrl || `data:image/svg+xml;base64,${btoa(`
                    <svg width="800" height="400" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <linearGradient id="guide-bg-${index}" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" style="stop-color:#10b981;stop-opacity:1" />
                          <stop offset="50%" style="stop-color:#3b82f6;stop-opacity:1" />
                          <stop offset="100%" style="stop-color:#6366f1;stop-opacity:1" />
                        </linearGradient>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#guide-bg-${index})"/>
                      <circle cx="150" cy="120" r="25" fill="white" opacity="0.8"/>
                      <path d="M135 105 L165 105 L150 140 Z" fill="white"/>
                      <rect x="300" y="100" width="200" height="120" rx="8" fill="white" opacity="0.9"/>
                      <rect x="320" y="120" width="160" height="8" rx="4" fill="#3b82f6"/>
                      <rect x="320" y="140" width="120" height="6" rx="3" fill="#6b7280"/>
                      <rect x="320" y="155" width="140" height="6" rx="3" fill="#6b7280"/>
                      <text x="400" y="300" text-anchor="middle" fill="white" font-family="Arial" font-size="20" font-weight="bold">${article.title || 'Travel Guide'}</text>
                    </svg>
                  `)}`}
                  alt={article.title}
                  className="w-full h-48 object-cover"
                />
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3" data-testid={`guide-article-title-${article.id || index}`}>
                    {article.title}
                  </h3>
                  <p className="text-gray-600 mb-4" data-testid={`guide-article-excerpt-${article.id || index}`}>
                    {article.excerpt}
                  </p>
                  <div className="flex items-center text-sm text-gray-500 space-x-4 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : "Recently"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>SnapTravels</span>
                    </div>
                  </div>
                  <button 
                    className="text-snap-orange font-medium hover:text-orange-600"
                    data-testid={`guide-read-more-${article.id || index}`}
                  >
                    Read More →
                  </button>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="text-center mt-12">
          <Link href="/travel-guide">
            <button 
              className="bg-snap-blue text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              data-testid="view-all-articles"
            >
              View All Articles
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
