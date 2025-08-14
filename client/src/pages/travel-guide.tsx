import { useQuery } from "@tanstack/react-query";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { TravelGuideArticle } from "@shared/schema";
import { Calendar, User, MapPin } from "lucide-react";

export default function TravelGuide() {
  const { data: articles, isLoading } = useQuery<TravelGuideArticle[]>({
    queryKey: ["/api/travel-guide"],
  });

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-snap-blue to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" data-testid="guide-title">
            Travel Guide
          </h1>
          <p className="text-xl text-gray-200" data-testid="guide-subtitle">
            Tips, guides and insights for your perfect Indian vacation
          </p>
        </div>
      </section>

      {/* Articles Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i}>
                  <Skeleton className="h-48 w-full" />
                  <CardContent className="p-6">
                    <Skeleton className="h-6 w-full mb-3" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : articles && articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <Card key={article.id} className="hover:shadow-xl transition-shadow cursor-pointer">
                  <img
                    src={article.imageUrl || `data:image/svg+xml;base64,${btoa(`
                      <svg width="800" height="400" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <linearGradient id="travel-bg" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style="stop-color:#06b6d4;stop-opacity:1" />
                            <stop offset="50%" style="stop-color:#3b82f6;stop-opacity:1" />
                            <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" />
                          </linearGradient>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#travel-bg)"/>
                        <path d="M100 200 Q200 150 300 200 T500 200" stroke="white" stroke-width="3" fill="none" opacity="0.7"/>
                        <circle cx="150" cy="180" r="8" fill="white" opacity="0.9"/>
                        <circle cx="350" cy="220" r="6" fill="white" opacity="0.8"/>
                        <circle cx="450" cy="190" r="7" fill="white" opacity="0.85"/>
                        <polygon points="400,120 420,140 400,160 380,140" fill="white" opacity="0.9"/>
                        <text x="400" y="320" text-anchor="middle" fill="white" font-family="Arial" font-size="24" font-weight="bold">Travel Guide</text>
                        <text x="400" y="350" text-anchor="middle" fill="white" font-family="Arial" font-size="16" opacity="0.8">Discover Amazing Places</text>
                      </svg>
                    `)}`}
                    alt={article.title}
                    className="w-full h-48 object-cover"
                  />
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3" data-testid={`article-title-${article.id}`}>
                      {article.title}
                    </h3>
                    {article.excerpt && (
                      <p className="text-gray-600 mb-4 line-clamp-3" data-testid={`article-excerpt-${article.id}`}>
                        {article.excerpt}
                      </p>
                    )}
                    <div className="flex items-center text-sm text-gray-500 space-x-4">
                      {article.publishedAt && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>SnapTravels</span>
                      </div>
                    </div>
                    <button 
                      className="text-snap-orange font-medium hover:text-orange-600 mt-4"
                      data-testid={`button-read-${article.id}`}
                    >
                      Read More →
                    </button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Sample articles when no data */}
              <Card className="hover:shadow-xl transition-shadow">
                <img
                  src={`data:image/svg+xml;base64,${btoa(`
                    <svg width="800" height="400" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <linearGradient id="train-bg" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" style="stop-color:#10b981;stop-opacity:1" />
                          <stop offset="50%" style="stop-color:#3b82f6;stop-opacity:1" />
                          <stop offset="100%" style="stop-color:#6366f1;stop-opacity:1" />
                        </linearGradient>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#train-bg)"/>
                      <rect x="100" y="200" width="600" height="80" rx="8" fill="white" opacity="0.9"/>
                      <rect x="120" y="220" width="60" height="40" rx="4" fill="#3b82f6"/>
                      <rect x="200" y="220" width="60" height="40" rx="4" fill="#3b82f6"/>
                      <rect x="280" y="220" width="60" height="40" rx="4" fill="#3b82f6"/>
                      <rect x="360" y="220" width="60" height="40" rx="4" fill="#3b82f6"/>
                      <rect x="440" y="220" width="60" height="40" rx="4" fill="#3b82f6"/>
                      <rect x="520" y="220" width="60" height="40" rx="4" fill="#3b82f6"/>
                      <text x="400" y="320" text-anchor="middle" fill="white" font-family="Arial" font-size="24" font-weight="bold">Train Travel Guide</text>
                    </svg>
                  `)}`}
                  alt="Indian train station"
                  className="w-full h-48 object-cover"
                />
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">First Time Train Travel in India</h3>
                  <p className="text-gray-600 mb-4">Everything you need to know about booking and traveling by train in India. From seat classes to station navigation...</p>
                  <div className="flex items-center text-sm text-gray-500 space-x-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Dec 15, 2024</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>SnapTravels</span>
                    </div>
                  </div>
                  <button className="text-snap-orange font-medium hover:text-orange-600 mt-4">
                    Read More →
                  </button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-xl transition-shadow">
                <img
                  src={`data:image/svg+xml;base64,${btoa(`
                    <svg width="800" height="400" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <linearGradient id="food-bg" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" style="stop-color:#f59e0b;stop-opacity:1" />
                          <stop offset="50%" style="stop-color:#ef4444;stop-opacity:1" />
                          <stop offset="100%" style="stop-color:#dc2626;stop-opacity:1" />
                        </linearGradient>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#food-bg)"/>
                      <circle cx="300" cy="200" r="80" fill="white" opacity="0.9"/>
                      <circle cx="150" cy="150" r="30" fill="white" opacity="0.8"/>
                      <circle cx="450" cy="150" r="30" fill="white" opacity="0.8"/>
                      <circle cx="150" cy="250" r="30" fill="white" opacity="0.8"/>
                      <circle cx="450" cy="250" r="30" fill="white" opacity="0.8"/>
                      <circle cx="650" cy="200" r="40" fill="white" opacity="0.8"/>
                      <text x="400" y="320" text-anchor="middle" fill="white" font-family="Arial" font-size="24" font-weight="bold">Indian Cuisine Guide</text>
                    </svg>
                  `)}`}
                  alt="Indian cuisine thali"
                  className="w-full h-48 object-cover"
                />
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Best Indian Food by Region</h3>
                  <p className="text-gray-600 mb-4">Discover the diverse culinary landscape of India. From spicy South Indian curries to rich Punjabi delicacies...</p>
                  <div className="flex items-center text-sm text-gray-500 space-x-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Dec 12, 2024</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>SnapTravels</span>
                    </div>
                  </div>
                  <button className="text-snap-orange font-medium hover:text-orange-600 mt-4">
                    Read More →
                  </button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-xl transition-shadow">
                <img
                  src={`data:image/svg+xml;base64,${btoa(`
                    <svg width="800" height="400" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <linearGradient id="festival-bg" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" style="stop-color:#8b5cf6;stop-opacity:1" />
                          <stop offset="50%" style="stop-color:#ec4899;stop-opacity:1" />
                          <stop offset="100%" style="stop-color:#f59e0b;stop-opacity:1" />
                        </linearGradient>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#festival-bg)"/>
                      <circle cx="200" cy="150" r="20" fill="white" opacity="0.9"/>
                      <circle cx="400" cy="120" r="25" fill="white" opacity="0.8"/>
                      <circle cx="600" cy="180" r="18" fill="white" opacity="0.9"/>
                      <polygon points="350,200 370,220 350,240 330,220" fill="white" opacity="0.9"/>
                      <polygon points="450,180 470,200 450,220 430,200" fill="white" opacity="0.8"/>
                      <polygon points="250,220 270,240 250,260 230,240" fill="white" opacity="0.8"/>
                      <text x="400" y="320" text-anchor="middle" fill="white" font-family="Arial" font-size="24" font-weight="bold">Festival Travel Guide</text>
                    </svg>
                  `)}`}
                  alt="Indian festival celebration"
                  className="w-full h-48 object-cover"
                />
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Festival Season Travel Tips</h3>
                  <p className="text-gray-600 mb-4">Plan your travel around India's vibrant festivals. Best times to visit, what to expect, and booking strategies...</p>
                  <div className="flex items-center text-sm text-gray-500 space-x-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Dec 10, 2024</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>SnapTravels</span>
                    </div>
                  </div>
                  <button className="text-snap-orange font-medium hover:text-orange-600 mt-4">
                    Read More →
                  </button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
