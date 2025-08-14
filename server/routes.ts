import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { ObjectStorageService } from "./objectStorage";
import {
  flightSearchSchema,
  hotelSearchSchema,
  trainSearchSchema,
  busSearchSchema,
  insertBookingSchema,
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get("/api/auth/user", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Public assets route
  app.get("/public-objects/:filePath(*)", async (req, res) => {
    const filePath = req.params.filePath;
    const objectStorageService = new ObjectStorageService();
    try {
      const file = await objectStorageService.searchPublicObject(filePath);
      if (!file) {
        return res.status(404).json({ error: "File not found" });
      }
      objectStorageService.downloadObject(file, res);
    } catch (error) {
      console.error("Error searching for public object:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // Destination routes
  app.get("/api/destinations", async (req, res) => {
    try {
      const destinations = await storage.getDestinations();
      res.json(destinations);
    } catch (error) {
      console.error("Error fetching destinations:", error);
      res.status(500).json({ message: "Failed to fetch destinations" });
    }
  });

  app.get("/api/destinations/search", async (req, res) => {
    try {
      const { q } = req.query;
      if (!q || typeof q !== "string") {
        return res.status(400).json({ message: "Query parameter 'q' is required" });
      }
      const destinations = await storage.searchDestinations(q);
      res.json(destinations);
    } catch (error) {
      console.error("Error searching destinations:", error);
      res.status(500).json({ message: "Failed to search destinations" });
    }
  });

  // Flight routes
  app.post("/api/flights/search", async (req, res) => {
    try {
      const searchParams = flightSearchSchema.parse(req.body);
      const flights = await storage.searchFlights(searchParams);
      res.json(flights);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid search parameters", errors: error.errors });
      }
      console.error("Error searching flights:", error);
      res.status(500).json({ message: "Failed to search flights" });
    }
  });

  app.get("/api/flights/:id", async (req, res) => {
    try {
      const flight = await storage.getFlight(req.params.id);
      if (!flight) {
        return res.status(404).json({ message: "Flight not found" });
      }
      res.json(flight);
    } catch (error) {
      console.error("Error fetching flight:", error);
      res.status(500).json({ message: "Failed to fetch flight" });
    }
  });

  // Hotel routes
  app.post("/api/hotels/search", async (req, res) => {
    try {
      const searchParams = hotelSearchSchema.parse(req.body);
      const hotels = await storage.searchHotels(searchParams);
      res.json(hotels);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid search parameters", errors: error.errors });
      }
      console.error("Error searching hotels:", error);
      res.status(500).json({ message: "Failed to search hotels" });
    }
  });

  app.get("/api/hotels/:id", async (req, res) => {
    try {
      const hotel = await storage.getHotel(req.params.id);
      if (!hotel) {
        return res.status(404).json({ message: "Hotel not found" });
      }
      res.json(hotel);
    } catch (error) {
      console.error("Error fetching hotel:", error);
      res.status(500).json({ message: "Failed to fetch hotel" });
    }
  });

  // Train routes
  app.post("/api/trains/search", async (req, res) => {
    try {
      const searchParams = trainSearchSchema.parse(req.body);
      const trains = await storage.searchTrains(searchParams);
      res.json(trains);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid search parameters", errors: error.errors });
      }
      console.error("Error searching trains:", error);
      res.status(500).json({ message: "Failed to search trains" });
    }
  });

  app.get("/api/trains/:id", async (req, res) => {
    try {
      const train = await storage.getTrain(req.params.id);
      if (!train) {
        return res.status(404).json({ message: "Train not found" });
      }
      res.json(train);
    } catch (error) {
      console.error("Error fetching train:", error);
      res.status(500).json({ message: "Failed to fetch train" });
    }
  });

  // Bus routes
  app.post("/api/buses/search", async (req, res) => {
    try {
      const searchParams = busSearchSchema.parse(req.body);
      const buses = await storage.searchBuses(searchParams);
      res.json(buses);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid search parameters", errors: error.errors });
      }
      console.error("Error searching buses:", error);
      res.status(500).json({ message: "Failed to search buses" });
    }
  });

  app.get("/api/buses/:id", async (req, res) => {
    try {
      const bus = await storage.getBus(req.params.id);
      if (!bus) {
        return res.status(404).json({ message: "Bus not found" });
      }
      res.json(bus);
    } catch (error) {
      console.error("Error fetching bus:", error);
      res.status(500).json({ message: "Failed to fetch bus" });
    }
  });

  // Booking creation endpoint (for the booking flow)
  app.post('/api/bookings/create', async (req, res) => {
    try {
      const { flight, passengers, contact, totalAmount, paymentMethod, paymentData } = req.body;
      
      // Generate booking ID
      const bookingId = `BK${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create booking confirmation data
      const bookingConfirmation = {
        bookingId,
        flight,
        passengers,
        contact,
        totalAmount,
        paymentMethod: getPaymentMethodDescription(paymentMethod, paymentData),
        bookingDate: new Date().toISOString(),
        status: 'confirmed'
      };
      
      console.log('Booking created:', bookingId);
      res.json(bookingConfirmation);
    } catch (error) {
      console.error('Booking creation error:', error);
      res.status(500).json({ message: 'Failed to create booking' });
    }
  });

  function getPaymentMethodDescription(method: string, data: any): string {
    switch (method) {
      case 'card':
        return `Credit Card ending in ${data.cardNumber?.slice(-4) || '****'}`;
      case 'upi':
        return `UPI: ${data.upiId}`;
      case 'wallet':
        return `${data.walletType} Wallet`;
      default:
        return 'Online Payment';
    }
  }

  // Booking routes (protected)
  app.post("/api/bookings", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Convert date strings back to Date objects
      const bookingData = { ...req.body, userId };
      if (bookingData.travelDate) {
        bookingData.travelDate = new Date(bookingData.travelDate);
      }
      if (bookingData.checkInDate) {
        bookingData.checkInDate = new Date(bookingData.checkInDate);
      }
      if (bookingData.checkOutDate) {
        bookingData.checkOutDate = new Date(bookingData.checkOutDate);
      }
      
      const validatedData = insertBookingSchema.parse(bookingData);
      const booking = await storage.createBooking(validatedData);
      res.json(booking);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid booking data", errors: error.errors });
      }
      console.error("Error creating booking:", error);
      res.status(500).json({ message: "Failed to create booking" });
    }
  });

  app.get("/api/bookings", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const bookings = await storage.getUserBookings(userId);
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching user bookings:", error);
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  app.get("/api/bookings/:id", isAuthenticated, async (req: any, res) => {
    try {
      const booking = await storage.getBooking(req.params.id);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      // Check if booking belongs to user
      const userId = req.user.claims.sub;
      if (booking.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      res.json(booking);
    } catch (error) {
      console.error("Error fetching booking:", error);
      res.status(500).json({ message: "Failed to fetch booking" });
    }
  });

  // Travel Guide routes
  app.get("/api/travel-guide", async (req, res) => {
    try {
      const articles = await storage.getPublishedArticles();
      res.json(articles);
    } catch (error) {
      console.error("Error fetching articles:", error);
      res.status(500).json({ message: "Failed to fetch articles" });
    }
  });

  app.get("/api/travel-guide/:slug", async (req, res) => {
    try {
      const article = await storage.getArticle(req.params.slug);
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      res.json(article);
    } catch (error) {
      console.error("Error fetching article:", error);
      res.status(500).json({ message: "Failed to fetch article" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
