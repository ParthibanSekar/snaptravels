import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import SearchTabs from "@/components/SearchTabs";
import PopularDestinations from "@/components/PopularDestinations";
import { Plane, Calendar, Users, Globe, Award, Heart } from "lucide-react";

export default function Home() {
  const { user } = useAuth();

  const { data: destinations } = useQuery({
    queryKey: ["/api/destinations"],
  });

  const { data: bookings } = useQuery({
    queryKey: ["/api/bookings"],
  });


  const recentBookings = Array.isArray(bookings) ? bookings.slice(0, 3) : [];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-16 px-6 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="container-main text-center">
          <div className="mb-8">
            <h1 className="text-5xl font-bold text-white mb-6">
              Book Your Perfect Trip
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Find and book flights, hotels, trains, and buses across India. 
              Compare prices and save with our best deals guarantee.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 mb-16">
            {[
              { icon: Plane, text: "500K+ Flights" },
              { icon: Globe, text: "200+ Destinations" },
              { icon: Award, text: "Best Price Guarantee" },
              { icon: Heart, text: "Trusted by Millions" }
            ].map((item, index) => (
              <div key={index} className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <item.icon className="w-5 h-5 text-white" />
                <span className="text-white font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="px-6 py-12 bg-gray-50">
        <div className="container-main">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Find Your Next Trip
            </h2>
            <p className="text-gray-600 text-lg">
              Compare prices and book with confidence
            </p>
          </div>
          <SearchTabs />
        </div>
      </section>

      {/* Popular Destinations */}
      <PopularDestinations />

      {/* Recent Bookings */}
      {recentBookings.length > 0 && (
        <section className="px-6 py-16 bg-gray-50">
          <div className="container-main">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                <Calendar className="w-8 h-8 inline mr-3 text-blue-600" />
                Your Recent Bookings
              </h2>
              <p className="text-gray-600">Your travel history and upcoming trips</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentBookings.map((booking: any, index: number) => (
                <div
                  key={booking.id}
                  className="booking-card"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                          <Plane className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">Flight Booking</h3>
                          <p className="text-gray-500 text-sm">#{booking.id.slice(0, 8)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="price-display">
                          ₹{booking.totalAmount?.toLocaleString() || '0'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Status</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          booking.status === 'confirmed' 
                            ? 'bg-green-100 text-green-600'
                            : 'bg-orange-100 text-orange-600'
                        }`}>
                          {booking.status || 'Pending'}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Passengers</span>
                        <span className="text-gray-900">{booking.passengers || 1}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Date</span>
                        <span className="text-gray-900">
                          {new Date(booking.createdAt || Date.now()).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <button className="w-full mt-4 booking-button">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Stats Section */}
      <section className="px-6 py-16 bg-white">
        <div className="container-main">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                title: "Total Bookings", 
                value: "2.5M+", 
                icon: Plane, 
                description: "Successfully completed bookings" 
              },
              { 
                title: "Happy Travelers", 
                value: "500K+", 
                icon: Users, 
                description: "Satisfied customers worldwide" 
              },
              { 
                title: "Destinations", 
                value: "200+", 
                icon: Globe, 
                description: "Cities and countries covered" 
              }
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center booking-card p-8"
              >
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <stat.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-4xl font-bold text-blue-600 mb-2">{stat.value}</h3>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">{stat.title}</h4>
                <p className="text-gray-600">{stat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}