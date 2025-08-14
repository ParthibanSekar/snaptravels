import { IndianRupee, Headphones, Shield, Star } from "lucide-react";

export default function WhyChooseUs() {
  const features = [
    {
      id: "best-prices",
      icon: IndianRupee,
      title: "Best Prices",
      description: "Guaranteed lowest prices on flights, hotels, and packages",
      bgColor: "bg-snap-orange"
    },
    {
      id: "support",
      icon: Headphones,
      title: "24/7 Support",
      description: "Round-the-clock customer support for all your travel needs",
      bgColor: "bg-snap-blue"
    },
    {
      id: "secure",
      icon: Shield,
      title: "Secure Booking",
      description: "Safe and secure payment options with instant confirmations",
      bgColor: "bg-snap-emerald"
    },
    {
      id: "trusted",
      icon: Star,
      title: "Trusted by Millions",
      description: "Over 5 million happy customers across India",
      bgColor: "bg-purple-500"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" data-testid="features-title">
            Why Choose SnapTravels?
          </h2>
          <p className="text-xl text-gray-600" data-testid="features-subtitle">
            Your trusted travel partner across India
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.id} className="text-center" data-testid={`feature-${feature.id}`}>
                <div className={`${feature.bgColor} text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <Icon className="text-2xl w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2" data-testid={`feature-title-${feature.id}`}>
                  {feature.title}
                </h3>
                <p className="text-gray-600" data-testid={`feature-description-${feature.id}`}>
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
