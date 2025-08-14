import SearchTabs from "@/components/SearchTabs";
import Logo from "@/components/Logo";
import { useQuery } from "@tanstack/react-query";
import { Plane, Shield, Clock, Star, Globe, Sparkles, TrendingUp, MapPin, Users, Award } from "lucide-react";

export default function Landing() {
  const { data: destinations } = useQuery({
    queryKey: ["/api/destinations"],
  });

  const popularDestinations = Array.isArray(destinations) ? destinations.slice(0, 6) : [];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-12">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <Logo size="xl" className="float-animation" />
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-xl animate-pulse"></div>
              </div>
            </div>
            <h1 className="heading-xl text-white mb-6 float-delayed" style={{textShadow: '0 4px 20px rgba(0,0,0,0.8)'}}>
              Reimagining{" "}
              <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent" style={{textShadow: '0 0 30px rgba(34,211,238,0.8)'}}>Travel</span>{" "}
              Experiences
            </h1>
            <p className="text-xl text-white/70 max-w-4xl mx-auto leading-relaxed float-delayed">
              Step into the future of travel booking. Our immersive platform combines cutting-edge design 
              with powerful technology to make your journey planning effortless and inspiring.
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              { icon: Plane, text: "Smart Flight Search", color: "from-cyan-500 to-blue-500" },
              { icon: Shield, text: "Secure Booking", color: "from-blue-500 to-cyan-500" },
              { icon: Clock, text: "24/7 Support", color: "from-green-500 to-emerald-500" },
              { icon: Star, text: "Best Price Guarantee", color: "from-orange-500 to-red-500" }
            ].map((item, index) => (
              <div key={index} className="group">
                <div className={`w-20 h-20 bg-gradient-to-r ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-4 glow-cyan group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className="w-10 h-10 text-white" />
                </div>
                <p className="text-white/80 font-medium text-sm">{item.text}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-center space-x-6 mb-16">
            <a 
              href="/api/login"
              className="modern-button hover-lift text-lg font-semibold px-10 py-4"
            >
              <Sparkles className="w-6 h-6 mr-3" />
              Start Your Journey
            </a>
            <button className="glass-hover px-10 py-4 rounded-2xl text-white font-semibold border border-white/20 hover-lift transition-all">
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              <Globe className="w-10 h-10 inline mr-3 text-cyan-400" />
              Explore Without Limits
            </h2>
            <p className="text-white/60 text-lg">
              Search flights, hotels, trains, and buses with our advanced booking system
            </p>
          </div>
          <SearchTabs />
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="heading-lg text-white mb-4">
              Why Choose SnapTravels?
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Experience the difference with our innovative approach to travel booking
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: TrendingUp,
                title: "AI-Powered Recommendations",
                description: "Smart suggestions based on your preferences and travel history",
                color: "from-purple-500 to-pink-500"
              },
              {
                icon: Shield,
                title: "Secure & Trusted",
                description: "Bank-level security with instant booking confirmations",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: Clock,
                title: "Real-Time Updates",
                description: "Live flight tracking and instant notifications",
                color: "from-green-500 to-emerald-500"
              },
              {
                icon: Award,
                title: "Best Price Promise",
                description: "We guarantee the lowest prices or we'll match them",
                color: "from-orange-500 to-red-500"
              },
              {
                icon: Users,
                title: "24/7 Customer Support",
                description: "Round-the-clock assistance from our travel experts",
                color: "from-indigo-500 to-purple-500"
              },
              {
                icon: Globe,
                title: "Global Coverage",
                description: "Access to 500+ airlines and millions of hotels worldwide",
                color: "from-pink-500 to-rose-500"
              }
            ].map((feature, index) => (
              <div key={index} className="flight-card hover-lift group text-center">
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mx-auto mb-6 glow-purple group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-gradient-purple transition-all">
                  {feature.title}
                </h3>
                <p className="text-white/60 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="heading-lg text-white mb-4">
              <MapPin className="w-8 h-8 inline mr-3 text-gradient-purple" />
              Popular Destinations
            </h2>
            <p className="text-white/60 text-lg">
              Discover amazing places around the world
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {popularDestinations.map((destination: any, index: number) => (
              <div
                key={destination.id}
                className="group flight-card hover-lift cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-2xl mb-6">
                  <div className="h-48 bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-pink-500/20 flex items-center justify-center">
                    <MapPin className="w-16 h-16 text-white/60" />
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="glass px-3 py-1 rounded-full">
                      <Star className="w-4 h-4 text-yellow-400 inline mr-1" />
                      <span className="text-white text-sm font-semibold">4.8</span>
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <div className="glass px-3 py-1 rounded-full">
                      <span className="text-white text-sm font-semibold">
                        From ₹{Math.floor(Math.random() * 5000) + 3000}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white group-hover:text-gradient-purple transition-all">
                      {destination.name}
                    </h3>
                    <p className="text-white/60">{destination.country}</p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-white/60">
                      <span className="flex items-center">
                        <Plane className="w-4 h-4 mr-1" />
                        2h 30m
                      </span>
                    </div>
                    <button className="text-purple-400 hover:text-pink-400 font-semibold text-sm transition-colors">
                      Explore →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="heading-lg text-white mb-4">
              Trusted by Millions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { number: "2.5M+", label: "Bookings", icon: Plane },
              { number: "500K+", label: "Happy Travelers", icon: Users },
              { number: "200+", label: "Destinations", icon: Globe },
              { number: "4.9★", label: "User Rating", icon: Star }
            ].map((stat, index) => (
              <div key={index} className="text-center flight-card hover-lift">
                <stat.icon className="w-12 h-12 text-gradient-purple mx-auto mb-4" />
                <div className="text-4xl font-bold text-gradient-purple mb-2">
                  {stat.number}
                </div>
                <div className="text-white/60 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass p-12 rounded-3xl">
            <h2 className="heading-lg text-white mb-6">
              Ready to Start Your Adventure?
            </h2>
            <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
              Join millions of travelers who trust SnapTravels for their booking needs. 
              Experience the future of travel today.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
              <a 
                href="/api/login"
                className="modern-button hover-lift text-lg font-semibold px-10 py-4"
              >
                <Sparkles className="w-6 h-6 mr-3" />
                Get Started Now
              </a>
              <button className="text-white/70 hover:text-white transition-colors font-medium">
                Learn more about our services →
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}