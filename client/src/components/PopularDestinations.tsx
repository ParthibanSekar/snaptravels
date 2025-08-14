import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Destination } from "@shared/schema";

export default function PopularDestinations() {
  const { data: destinations, isLoading } = useQuery<Destination[]>({
    queryKey: ["/api/destinations"],
  });

  // Sample destinations when no data is available
  const sampleDestinations = [
    {
      id: "1",
      name: "Rajasthan",
      description: "Royal palaces and desert landscapes",
      imageUrl: null,
      price: "From ₹4,999",
      duration: "5 Days"
    },
    {
      id: "2",
      name: "Kerala",
      description: "God's own country with backwaters",
      imageUrl: null,
      price: "From ₹6,499",
      duration: "7 Days"
    },
    {
      id: "3",
      name: "Goa",
      description: "Beautiful beaches and vibrant culture",
      imageUrl: null,
      price: "From ₹3,999",
      duration: "4 Days"
    },
    {
      id: "4",
      name: "Himachal Pradesh",
      description: "Hill stations and mountain adventures",
      imageUrl: null,
      price: "From ₹5,499",
      duration: "6 Days"
    },
    {
      id: "5",
      name: "Uttarakhand",
      description: "Spiritual journey and mountain peaks",
      imageUrl: null,
      price: "From ₹7,999",
      duration: "8 Days"
    },
    {
      id: "6",
      name: "Tamil Nadu",
      description: "Ancient temples and rich culture",
      imageUrl: null,
      price: "From ₹4,499",
      duration: "5 Days"
    },
    {
      id: "7",
      name: "Kashmir",
      description: "Paradise on earth with stunning valleys",
      imageUrl: null,
      price: "From ₹8,999",
      duration: "7 Days"
    },
    {
      id: "8",
      name: "Andaman Islands",
      description: "Pristine beaches and crystal clear waters",
      imageUrl: null,
      price: "From ₹12,999",
      duration: "6 Days"
    }
  ];

  const displayDestinations = destinations && destinations.length > 0 ? destinations : sampleDestinations;

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" data-testid="destinations-title">
            Popular Destinations
          </h2>
          <p className="text-xl text-gray-600" data-testid="destinations-subtitle">
            Discover India's most beautiful places
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <Skeleton className="w-full h-48" />
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            displayDestinations.slice(0, 8).map((destination, index) => (
              <Card 
                key={destination.id || index} 
                className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                data-testid={`destination-${destination.id || index}`}
              >
                <img
                  src={(() => {
                    // Map destination names to local image files
                    const imageMap: { [key: string]: string } = {
                      'Delhi Capital': '/images/destinations/delhi.jpg',
                      'Goa Beaches': '/images/destinations/goa.jpg',
                      'Mumbai Gateway': '/images/destinations/mumbai.jpg',
                      'Jaipur Pink City': '/images/destinations/jaipur.jpg',
                      'Bangalore Silicon Valley': '/images/destinations/bangalore.jpg',
                      'Varanasi Sacred City': '/images/destinations/varanasi.jpg',
                      'Chennai Gateway': '/images/destinations/chennai.jpg',
                      'Kochi Backwaters': '/images/destinations/kochi.jpg',
                      'Hyderabad Cyberabad': '/images/destinations/hyderabad.jpg',
                      'Kolkata Cultural Hub': '/images/destinations/kolkata.jpg'
                    };
                    
                    return imageMap[destination.name] || `data:image/svg+xml;base64,${btoa(`
                      <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <linearGradient id="bg-${index}" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
                            <stop offset="100%" style="stop-color:#1d4ed8;stop-opacity:1" />
                          </linearGradient>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#bg-${index})"/>
                        <circle cx="200" cy="150" r="40" fill="white" opacity="0.8"/>
                        <path d="M180 130 L220 130 L200 160 Z" fill="white"/>
                        <text x="200" y="220" text-anchor="middle" fill="white" font-family="Arial" font-size="18" font-weight="bold">${destination.name || 'Destination'}</text>
                      </svg>
                    `)}`;
                  })()}
                  alt={destination.name}
                  className="w-full h-48 object-cover"
                />
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2" data-testid={`destination-name-${destination.id || index}`}>
                    {destination.name}
                  </h3>
                  <p className="text-gray-600 mb-4" data-testid={`destination-description-${destination.id || index}`}>
                    {destination.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-snap-orange font-semibold" data-testid={`destination-price-${destination.id || index}`}>
                      Contact for price
                    </span>
                    <span className="text-sm text-gray-500" data-testid={`destination-duration-${destination.id || index}`}>
                      Flexible
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
