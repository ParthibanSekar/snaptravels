import { Link } from "wouter";
import { Facebook, Twitter, Instagram, Youtube, Phone, Mail, MapPin } from "lucide-react";
import Logo from "./Logo";

export default function Footer() {
  const quickLinks = [
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Careers", href: "/careers" },
    { name: "Press", href: "/press" }
  ];

  const supportLinks = [
    { name: "Help Center", href: "/help" },
    { name: "Cancellation", href: "/cancellation" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" }
  ];

  const socialLinks = [
    { name: "Facebook", icon: Facebook, href: "#" },
    { name: "Twitter", icon: Twitter, href: "#" },
    { name: "Instagram", icon: Instagram, href: "#" },
    { name: "YouTube", icon: Youtube, href: "#" }
  ];

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <Logo size="md" />
              <h3 className="text-2xl font-bold text-white drop-shadow-lg" data-testid="footer-brand">
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  SnapTravels
                </span>
              </h3>
            </div>
            <p className="text-gray-400 mb-4" data-testid="footer-description">
              Your trusted partner for exploring incredible India. Book flights, hotels, trains, and buses with ease.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className="text-gray-400 hover:text-snap-orange transition-colors"
                    aria-label={social.name}
                    data-testid={`social-${social.name.toLowerCase()}`}
                  >
                    <Icon className="w-6 h-6" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4" data-testid="footer-quick-links-title">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href}>
                    <span 
                      className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                      data-testid={`quick-link-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {link.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4" data-testid="footer-support-title">
              Support
            </h4>
            <ul className="space-y-2">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href}>
                    <span 
                      className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                      data-testid={`support-link-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {link.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4" data-testid="footer-contact-title">
              Contact Info
            </h4>
            <div className="space-y-3 text-gray-400">
              <div className="flex items-center gap-2" data-testid="contact-phone">
                <Phone className="w-4 h-4" />
                <span>+91 1800-123-4567</span>
              </div>
              <div className="flex items-center gap-2" data-testid="contact-email">
                <Mail className="w-4 h-4" />
                <span>support@snaptravels.online</span>
              </div>
              <div className="flex items-center gap-2" data-testid="contact-address">
                <MapPin className="w-4 h-4" />
                <span>Mumbai, India</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400" data-testid="footer-copyright">
            &copy; 2024 SnapTravels. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
