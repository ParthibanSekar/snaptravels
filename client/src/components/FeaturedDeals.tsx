import { Button } from "@/components/ui/button";
import { Plane, Building, Package } from "lucide-react";

export default function FeaturedDeals() {
  const deals = [
    {
      id: "flight-deal",
      icon: Plane,
      title: "Flight Special",
      description: "Delhi to Mumbai flights starting from just ₹3,499. Limited seats available!",
      price: "₹3,499",
      buttonText: "Book Now",
      bgColor: "from-blue-50 to-blue-100",
      borderColor: "border-blue-200",
      iconColor: "text-snap-blue",
      priceColor: "text-snap-blue",
      buttonColor: "bg-snap-blue hover:bg-blue-700"
    },
    {
      id: "hotel-deal",
      icon: Building,
      title: "Hotel Offer",
      description: "Up to 40% off on premium hotels in Goa. Free breakfast included!",
      price: "40% OFF",
      buttonText: "Explore",
      bgColor: "from-emerald-50 to-emerald-100",
      borderColor: "border-emerald-200",
      iconColor: "text-snap-emerald",
      priceColor: "text-snap-emerald",
      buttonColor: "bg-snap-emerald hover:bg-emerald-700"
    },
    {
      id: "package-deal",
      icon: Package,
      title: "Package Deal",
      description: "Complete Kerala package: Flights + Hotels + Activities for 7 days",
      price: "₹12,999",
      buttonText: "View Details",
      bgColor: "from-orange-50 to-orange-100",
      borderColor: "border-orange-200",
      iconColor: "text-snap-orange",
      priceColor: "text-snap-orange",
      buttonColor: "bg-snap-orange hover:bg-orange-600"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" data-testid="deals-title">
            Featured Deals
          </h2>
          <p className="text-xl text-gray-600" data-testid="deals-subtitle">
            Limited time offers on flights, hotels and packages
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {deals.map((deal) => {
            const Icon = deal.icon;
            return (
              <div
                key={deal.id}
                className={`bg-gradient-to-br ${deal.bgColor} rounded-xl p-6 border ${deal.borderColor}`}
                data-testid={`deal-${deal.id}`}
              >
                <div className="flex items-center mb-4">
                  <Icon className={`${deal.iconColor} text-2xl mr-3 w-8 h-8`} />
                  <h3 className="text-xl font-semibold text-gray-900" data-testid={`deal-title-${deal.id}`}>
                    {deal.title}
                  </h3>
                </div>
                <p className="text-gray-700 mb-4" data-testid={`deal-description-${deal.id}`}>
                  {deal.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className={`text-2xl font-bold ${deal.priceColor}`} data-testid={`deal-price-${deal.id}`}>
                    {deal.price}
                  </span>
                  <Button 
                    className={`${deal.buttonColor} text-white transition-colors`}
                    data-testid={`deal-button-${deal.id}`}
                  >
                    {deal.buttonText}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
