import { useState } from "react";
import { useLocation } from "wouter";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plane, Building, Train, Bus, Search, MapPin, Calendar, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";

export default function SearchTabs() {
  const [location, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("flights");
  const { theme } = useTheme();
  const isModernTheme = theme === "theme-modern";

  // Search form states
  const [flightSearch, setFlightSearch] = useState({
    from: "",
    to: "",
    departureDate: "",
    passengers: "1"
  });

  const [hotelSearch, setHotelSearch] = useState({
    destination: "",
    checkInDate: "",
    checkOutDate: "",
    guests: "2-1"
  });

  const [trainSearch, setTrainSearch] = useState({
    from: "",
    to: "",
    journeyDate: "",
    seatClass: "sleeper"
  });

  const [busSearch, setBusSearch] = useState({
    from: "",
    to: "",
    journeyDate: "",
    passengers: "1"
  });

  const tabs = [
    { id: "flights", label: "Flights", icon: Plane, gradient: "from-purple-500 to-pink-500" },
    { id: "hotels", label: "Hotels", icon: Building, gradient: "from-blue-500 to-cyan-500" },
    { id: "trains", label: "Trains", icon: Train, gradient: "from-green-500 to-emerald-500" },
    { id: "buses", label: "Buses", icon: Bus, gradient: "from-orange-500 to-red-500" },
  ];

  const handleSearch = (tabType: string) => {
    console.log('Search triggered for:', tabType, { flightSearch });
    console.log('Current form values:', flightSearch);
    switch (tabType) {
      case "flights":
        if (!flightSearch.from || !flightSearch.to || !flightSearch.departureDate) {
          console.error('Missing required flight search fields:', flightSearch);
          alert('Please fill in all required fields: From, To, and Departure Date');
          return;
        }
        const url = `/flights/search?from=${encodeURIComponent(flightSearch.from)}&to=${encodeURIComponent(flightSearch.to)}&date=${flightSearch.departureDate}&passengers=${flightSearch.passengers}`;
        console.log('Navigating to:', url);
        navigate(url);
        break;
      case "hotels":
        navigate(`/hotels/search?destination=${encodeURIComponent(hotelSearch.destination)}&checkin=${hotelSearch.checkInDate}&checkout=${hotelSearch.checkOutDate}&guests=${hotelSearch.guests}`);
        break;
      case "trains":
        navigate(`/trains/search?from=${encodeURIComponent(trainSearch.from)}&to=${encodeURIComponent(trainSearch.to)}&date=${trainSearch.journeyDate}&class=${trainSearch.seatClass}`);
        break;
      case "buses":
        navigate(`/buses/search?from=${encodeURIComponent(busSearch.from)}&to=${encodeURIComponent(busSearch.to)}&date=${busSearch.journeyDate}&passengers=${busSearch.passengers}`);
        break;
    }
  };

  const modernInputClass = "form-input";

  return (
    <div className={cn("rounded-lg shadow-lg max-w-5xl mx-auto", 
      isModernTheme 
        ? "bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl" 
        : "bg-white border-2 border-yellow-400"
    )}>
      {/* Tab Navigation */}
      <div className={cn("flex rounded-t-lg border-b", 
        isModernTheme 
          ? "bg-white/5 border-white/10" 
          : "bg-white border-gray-200"
      )}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-200 ${
                isActive
                  ? "text-blue-600 bg-blue-50 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab(tab.id)}
              data-testid={`tab-${tab.id}`}
            >
              <div className="flex flex-col items-center space-y-2">
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{tab.label}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Flight Search Form */}
      {activeTab === "flights" && (
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="space-y-2">
              <label className="block text-gray-700 text-sm font-medium">
                <MapPin className="w-4 h-4 inline mr-2 flight-accent" />
                From
              </label>
              <input
                placeholder="Delhi (DEL)"
                value={flightSearch.from}
                onChange={(e) => setFlightSearch({ ...flightSearch, from: e.target.value })}
                data-testid="flight-from"
                className={modernInputClass}
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-gray-700 text-sm font-medium">
                <MapPin className="w-4 h-4 inline mr-2 flight-accent" />
                To
              </label>
              <input
                placeholder="Mumbai (BOM)"
                value={flightSearch.to}
                onChange={(e) => setFlightSearch({ ...flightSearch, to: e.target.value })}
                data-testid="flight-to"
                className={modernInputClass}
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-gray-700 text-sm font-medium">
                <Calendar className="w-4 h-4 inline mr-2 flight-accent" />
                Departure
              </label>
              <input
                type="date"
                value={flightSearch.departureDate}
                onChange={(e) => setFlightSearch({ ...flightSearch, departureDate: e.target.value })}
                data-testid="flight-departure"
                className={modernInputClass}
              />

            </div>
            
            <div className="space-y-2">
              <label className="block text-gray-700 text-sm font-medium">
                <Users className="w-4 h-4 inline mr-2 flight-accent" />
                Passengers
              </label>
              <Select
                value={flightSearch.passengers}
                onValueChange={(value) => setFlightSearch({ ...flightSearch, passengers: value })}
              >
                <SelectTrigger data-testid="flight-passengers" className={modernInputClass}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Adult</SelectItem>
                  <SelectItem value="2">2 Adults</SelectItem>
                  <SelectItem value="3">3 Adults</SelectItem>
                  <SelectItem value="4">4 Adults</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="text-center">
            <button
              onClick={() => handleSearch("flights")}
              className="booking-button px-12 py-3 text-lg font-medium"
              data-testid="search-flights"
            >
              <Search className="w-5 h-5 mr-2" />
              Search Flights
            </button>
          </div>
        </div>
      )}

      {/* Hotel Search Form */}
      {activeTab === "hotels" && (
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="space-y-2">
              <label className="block text-gray-700 text-sm font-medium">
                <Building className="w-4 h-4 inline mr-2 hotel-accent" />
                Destination
              </label>
              <input
                placeholder="Goa, India"
                value={hotelSearch.destination}
                onChange={(e) => setHotelSearch({ ...hotelSearch, destination: e.target.value })}
                data-testid="hotel-destination"
                className={modernInputClass}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-gray-700 text-sm font-medium">
                <Calendar className="w-4 h-4 inline mr-2 hotel-accent" />
                Check-in
              </label>
              <input
                type="date"
                value={hotelSearch.checkInDate}
                onChange={(e) => setHotelSearch({ ...hotelSearch, checkInDate: e.target.value })}
                data-testid="hotel-checkin"
                className={modernInputClass}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-gray-700 text-sm font-medium">
                <Calendar className="w-4 h-4 inline mr-2 hotel-accent" />
                Check-out
              </label>
              <input
                type="date"
                value={hotelSearch.checkOutDate}
                onChange={(e) => setHotelSearch({ ...hotelSearch, checkOutDate: e.target.value })}
                data-testid="hotel-checkout"
                className={modernInputClass}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-gray-700 text-sm font-medium">
                <Users className="w-4 h-4 inline mr-2 hotel-accent" />
                Guests
              </label>
              <Select
                value={hotelSearch.guests}
                onValueChange={(value) => setHotelSearch({ ...hotelSearch, guests: value })}
              >
                <SelectTrigger data-testid="hotel-guests" className={modernInputClass}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-0">1 Adult</SelectItem>
                  <SelectItem value="2-0">2 Adults</SelectItem>
                  <SelectItem value="2-1">2 Adults, 1 Child</SelectItem>
                  <SelectItem value="3-0">3 Adults</SelectItem>
                  <SelectItem value="4-0">4 Adults</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="text-center">
            <button
              onClick={() => handleSearch("hotels")}
              className="booking-button px-12 py-3 text-lg font-medium"
              data-testid="search-hotels"
            >
              <Search className="w-5 h-5 mr-2" />
              Search Hotels
            </button>
          </div>
        </div>
      )}

      {/* Train Search Form */}
      {activeTab === "trains" && (
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="space-y-2">
              <label className="block text-gray-700 text-sm font-medium">
                <Train className="w-4 h-4 inline mr-2 train-accent" />
                From
              </label>
              <input
                placeholder="Delhi (NDLS)"
                value={trainSearch.from}
                onChange={(e) => setTrainSearch({ ...trainSearch, from: e.target.value })}
                data-testid="train-from"
                className={modernInputClass}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-gray-700 text-sm font-medium">
                <Train className="w-4 h-4 inline mr-2 train-accent" />
                To
              </label>
              <input
                placeholder="Mumbai (CST)"
                value={trainSearch.to}
                onChange={(e) => setTrainSearch({ ...trainSearch, to: e.target.value })}
                data-testid="train-to"
                className={modernInputClass}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-gray-700 text-sm font-medium">
                <Calendar className="w-4 h-4 inline mr-2 train-accent" />
                Journey Date
              </label>
              <input
                type="date"
                value={trainSearch.journeyDate}
                onChange={(e) => setTrainSearch({ ...trainSearch, journeyDate: e.target.value })}
                data-testid="train-date"
                className={modernInputClass}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-gray-700 text-sm font-medium">
                <Train className="w-4 h-4 inline mr-2 train-accent" />
                Class
              </label>
              <Select
                value={trainSearch.seatClass}
                onValueChange={(value) => setTrainSearch({ ...trainSearch, seatClass: value })}
              >
                <SelectTrigger data-testid="train-class" className={modernInputClass}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sleeper">Sleeper (SL)</SelectItem>
                  <SelectItem value="3a">3rd AC (3A)</SelectItem>
                  <SelectItem value="2a">2nd AC (2A)</SelectItem>
                  <SelectItem value="1a">1st AC (1A)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="text-center">
            <button
              onClick={() => handleSearch("trains")}
              className="booking-button px-12 py-3 text-lg font-medium"
              data-testid="search-trains"
            >
              <Search className="w-5 h-5 mr-2" />
              Search Trains
            </button>
          </div>
        </div>
      )}

      {/* Bus Search Form */}
      {activeTab === "buses" && (
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="space-y-2">
              <label className="block text-gray-700 text-sm font-medium">
                <Bus className="w-4 h-4 inline mr-2 bus-accent" />
                From
              </label>
              <input
                placeholder="Delhi"
                value={busSearch.from}
                onChange={(e) => setBusSearch({ ...busSearch, from: e.target.value })}
                data-testid="bus-from"
                className={modernInputClass}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-gray-700 text-sm font-medium">
                <Bus className="w-4 h-4 inline mr-2 bus-accent" />
                To
              </label>
              <input
                placeholder="Mumbai"
                value={busSearch.to}
                onChange={(e) => setBusSearch({ ...busSearch, to: e.target.value })}
                data-testid="bus-to"
                className={modernInputClass}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-gray-700 text-sm font-medium">
                <Calendar className="w-4 h-4 inline mr-2 bus-accent" />
                Journey Date
              </label>
              <input
                type="date"
                value={busSearch.journeyDate}
                onChange={(e) => setBusSearch({ ...busSearch, journeyDate: e.target.value })}
                data-testid="bus-date"
                className={modernInputClass}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-gray-700 text-sm font-medium">
                <Users className="w-4 h-4 inline mr-2 bus-accent" />
                Passengers
              </label>
              <Select
                value={busSearch.passengers}
                onValueChange={(value) => setBusSearch({ ...busSearch, passengers: value })}
              >
                <SelectTrigger data-testid="bus-passengers" className={modernInputClass}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Passenger</SelectItem>
                  <SelectItem value="2">2 Passengers</SelectItem>
                  <SelectItem value="3">3 Passengers</SelectItem>
                  <SelectItem value="4">4 Passengers</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="text-center">
            <button
              onClick={() => handleSearch("buses")}
              className="booking-button px-12 py-3 text-lg font-medium"
              data-testid="search-buses"
            >
              <Search className="w-5 h-5 mr-2" />
              Search Buses
            </button>
          </div>
        </div>
      )}
    </div>
  );
}