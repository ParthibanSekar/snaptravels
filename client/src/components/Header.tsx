import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { User, LogOut, Settings, UserCircle, BookOpen, Plane, Palette } from "lucide-react";
import { ThemeSelector } from "@/components/ThemeSelector";

export default function Header() {
  const { user, isAuthenticated, isLoading } = useAuth();

  return (
    <header className="main-header sticky top-0 z-50">
      <div className="container-main">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">ST</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">SnapTravels</h1>
                <p className="text-xs text-gray-500">Your Travel Partner</p>
              </div>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-600 hover:text-blue-600 font-medium">
              Home
            </Link>
            <Link href="/flights" className="text-gray-600 hover:text-blue-600 font-medium">
              Flights
            </Link>
            <Link href="/hotels" className="text-gray-600 hover:text-blue-600 font-medium">
              Hotels
            </Link>
            <Link href="/trains" className="text-gray-600 hover:text-blue-600 font-medium">
              Trains
            </Link>
            <Link href="/buses" className="text-gray-600 hover:text-blue-600 font-medium">
              Buses
            </Link>
          </nav>

          {/* User Account Section */}
          <div className="flex items-center space-x-4">
            {isLoading ? (
              <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full"></div>
            ) : isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center space-x-2 hover:bg-gray-50 rounded-lg p-2 transition-colors cursor-pointer" data-testid="user-menu-trigger">
                    {user.profileImageUrl ? (
                      <img 
                        src={user.profileImageUrl} 
                        alt={user.firstName || "User"} 
                        className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div className="hidden sm:block text-left">
                      <p className="text-sm font-medium text-gray-900">
                        {user.firstName || user.email}
                      </p>
                      <p className="text-xs text-gray-500">Traveler</p>
                    </div>
                  </button>
                </DropdownMenuTrigger>
                
                <DropdownMenuContent align="end" className="w-64 bg-white border border-gray-200 shadow-lg rounded-lg" data-testid="user-dropdown-menu">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      {user.profileImageUrl ? (
                        <img 
                          src={user.profileImageUrl} 
                          alt={user.firstName || "User"} 
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {user.firstName && user.lastName 
                            ? `${user.firstName} ${user.lastName}`
                            : user.firstName || user.email
                          }
                        </p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </div>
                  
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 cursor-pointer" data-testid="menu-profile">
                      <UserCircle className="w-5 h-5" />
                      <span>Your Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem asChild>
                    <Link href="/flights/manage" className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 cursor-pointer" data-testid="menu-bookings">
                      <Plane className="w-5 h-5" />
                      <span>My Bookings</span>
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem asChild>
                    <Link href="/travel-guide" className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 cursor-pointer" data-testid="menu-guides">
                      <BookOpen className="w-5 h-5" />
                      <span>Travel Guides</span>
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 cursor-pointer" data-testid="menu-settings">
                      <Settings className="w-5 h-5" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  
                  <div className="px-2 py-1">
                    <ThemeSelector />
                  </div>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem asChild>
                    <a href="/api/logout" className="flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 cursor-pointer" data-testid="menu-logout">
                      <LogOut className="w-5 h-5" />
                      <span>Sign Out</span>
                    </a>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-3">
                <a href="/api/login">
                  <Button className="booking-button-secondary">
                    Sign In
                  </Button>
                </a>
                <a href="/api/login">
                  <Button className="booking-button">
                    Sign Up
                  </Button>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}