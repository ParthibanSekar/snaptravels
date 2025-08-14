import {
  users,
  destinations,
  flights,
  hotels,
  trains,
  buses,
  bookings,
  travelGuideArticles,
  airlines,
  type User,
  type UpsertUser,
  type Destination,
  type Flight,
  type Hotel,
  type Train,
  type Bus,
  type Booking,
  type TravelGuideArticle,
  type InsertDestination,
  type InsertFlight,
  type InsertHotel,
  type InsertTrain,
  type InsertBus,
  type InsertBooking,
  type InsertTravelGuideArticle,
  type FlightSearch,
  type HotelSearch,
  type TrainSearch,
  type BusSearch,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, lte, desc, asc, like, sql, not } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Destination operations
  getDestinations(): Promise<Destination[]>;
  getDestination(id: string): Promise<Destination | undefined>;
  searchDestinations(query: string): Promise<Destination[]>;
  createDestination(destination: InsertDestination): Promise<Destination>;

  // Flight operations
  searchFlights(search: FlightSearch): Promise<Flight[]>;
  getFlight(id: string): Promise<Flight | undefined>;
  createFlight(flight: InsertFlight): Promise<Flight>;

  // Hotel operations
  searchHotels(search: HotelSearch): Promise<Hotel[]>;
  getHotel(id: string): Promise<Hotel | undefined>;
  createHotel(hotel: InsertHotel): Promise<Hotel>;

  // Train operations
  searchTrains(search: TrainSearch): Promise<Train[]>;
  getTrain(id: string): Promise<Train | undefined>;
  createTrain(train: InsertTrain): Promise<Train>;

  // Bus operations
  searchBuses(search: BusSearch): Promise<Bus[]>;
  getBus(id: string): Promise<Bus | undefined>;
  createBus(bus: InsertBus): Promise<Bus>;

  // Booking operations
  createBooking(booking: InsertBooking): Promise<Booking>;
  getBooking(id: string): Promise<Booking | undefined>;
  getUserBookings(userId: string): Promise<Booking[]>;
  updateBookingStatus(id: string, status: "pending" | "confirmed" | "cancelled" | "completed"): Promise<Booking>;

  // Travel Guide operations
  getPublishedArticles(): Promise<TravelGuideArticle[]>;
  getArticle(slug: string): Promise<TravelGuideArticle | undefined>;
  createArticle(article: InsertTravelGuideArticle): Promise<TravelGuideArticle>;
}

export class DatabaseStorage implements IStorage {
  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Destination operations
  async getDestinations(): Promise<Destination[]> {
    // Filter out airports and only return tourist destinations
    return await db.select().from(destinations)
      .where(not(like(destinations.name, '%Airport%')))
      .orderBy(desc(destinations.popularityScore));
  }

  async getDestination(id: string): Promise<Destination | undefined> {
    const [destination] = await db.select().from(destinations).where(eq(destinations.id, id));
    return destination;
  }

  async searchDestinations(query: string): Promise<Destination[]> {
    return await db
      .select()
      .from(destinations)
      .where(
        sql`${destinations.name} ILIKE ${`%${query}%`} OR ${destinations.city} ILIKE ${`%${query}%`} OR ${destinations.state} ILIKE ${`%${query}%`}`
      )
      .orderBy(desc(destinations.popularityScore));
  }

  async createDestination(destination: InsertDestination): Promise<Destination> {
    const [result] = await db.insert(destinations).values(destination).returning();
    return result;
  }

  // Flight operations
  async searchFlights(search: FlightSearch): Promise<any[]> {
    const departureDate = new Date(search.departureDate);
    const nextDay = new Date(departureDate);
    nextDay.setDate(nextDay.getDate() + 1);

    // Create aliases for the destinations table
    const fromDestinations = alias(destinations, "fromDest");
    const toDestinations = alias(destinations, "toDest");

    return await db
      .select({
        id: flights.id,
        flightNumber: flights.flightNumber,
        departureTime: flights.departureTime,
        arrivalTime: flights.arrivalTime,
        price: flights.price,
        availableSeats: flights.availableSeats,
        totalSeats: flights.totalSeats,
        seatClass: flights.seatClass,
        duration: flights.duration,
        airline: {
          name: airlines.name,
          code: airlines.code,
          logoUrl: airlines.logoUrl,
        },
        fromDestination: {
          name: fromDestinations.name,
          city: fromDestinations.city,
        },
        toDestination: {
          name: toDestinations.name,
          city: toDestinations.city,
        },
      })
      .from(flights)
      .innerJoin(airlines, eq(flights.airlineId, airlines.id))
      .innerJoin(fromDestinations, eq(flights.fromDestinationId, fromDestinations.id))
      .innerJoin(toDestinations, eq(flights.toDestinationId, toDestinations.id))
      .where(
        and(
          sql`${fromDestinations.city} ILIKE ${`%${search.from}%`}`,
          sql`${toDestinations.city} ILIKE ${`%${search.to}%`}`,
          gte(flights.departureTime, departureDate),
          lte(flights.departureTime, nextDay),
          eq(flights.seatClass, search.seatClass || "economy"),
          gte(flights.availableSeats, search.passengers)
        )
      )
      .orderBy(asc(flights.departureTime));
  }

  async getFlight(id: string): Promise<Flight | undefined> {
    const [flight] = await db.select().from(flights).where(eq(flights.id, id));
    return flight;
  }

  async createFlight(flight: InsertFlight): Promise<Flight> {
    const [result] = await db.insert(flights).values(flight).returning();
    return result;
  }

  // Hotel operations
  async searchHotels(search: HotelSearch): Promise<Hotel[]> {
    const results = await db
      .select({
        id: hotels.id,
        name: hotels.name,
        description: hotels.description,
        address: hotels.address,
        imageUrl: hotels.imageUrl,
        destinationId: hotels.destinationId,
        rating: hotels.rating,
        pricePerNight: hotels.pricePerNight,
        amenities: hotels.amenities,
        availableRooms: hotels.availableRooms,
        totalRooms: hotels.totalRooms,
        createdAt: hotels.createdAt,
      })
      .from(hotels)
      .innerJoin(destinations, eq(hotels.destinationId, destinations.id))
      .where(
        and(
          sql`${destinations.city} ILIKE ${`%${search.destination}%`} OR ${destinations.name} ILIKE ${`%${search.destination}%`}`,
          gte(hotels.availableRooms, search.rooms)
        )
      )
      .orderBy(asc(hotels.pricePerNight));
    return results;
  }

  async getHotel(id: string): Promise<Hotel | undefined> {
    const [hotel] = await db.select().from(hotels).where(eq(hotels.id, id));
    return hotel;
  }

  async createHotel(hotel: InsertHotel): Promise<Hotel> {
    const [result] = await db.insert(hotels).values(hotel).returning();
    return result;
  }

  // Train operations
  async searchTrains(search: TrainSearch): Promise<Train[]> {
    const journeyDate = new Date(search.journeyDate);
    const nextDay = new Date(journeyDate);
    nextDay.setDate(nextDay.getDate() + 1);

    // Create aliases for the destinations table
    const fromDestinations = alias(destinations, "fromDest");
    const toDestinations = alias(destinations, "toDest");

    const results = await db
      .select({
        id: trains.id,
        trainNumber: trains.trainNumber,
        trainName: trains.trainName,
        fromDestinationId: trains.fromDestinationId,
        toDestinationId: trains.toDestinationId,
        departureTime: trains.departureTime,
        arrivalTime: trains.arrivalTime,
        duration: trains.duration,
        price: trains.price,
        seatClass: trains.seatClass,
        availableSeats: trains.availableSeats,

        createdAt: trains.createdAt,
      })
      .from(trains)
      .innerJoin(fromDestinations, eq(trains.fromDestinationId, fromDestinations.id))
      .innerJoin(toDestinations, eq(trains.toDestinationId, toDestinations.id))
      .where(
        and(
          sql`${fromDestinations.city} ILIKE ${`%${search.from}%`}`,
          sql`${toDestinations.city} ILIKE ${`%${search.to}%`}`,
          gte(trains.departureTime, journeyDate),
          lte(trains.departureTime, nextDay),
          eq(trains.seatClass, search.seatClass),
          gte(trains.availableSeats, 1)
        )
      )
      .orderBy(asc(trains.departureTime));
    return results;
  }

  async getTrain(id: string): Promise<Train | undefined> {
    const [train] = await db.select().from(trains).where(eq(trains.id, id));
    return train;
  }

  async createTrain(train: InsertTrain): Promise<Train> {
    const [result] = await db.insert(trains).values(train).returning();
    return result;
  }

  // Bus operations
  async searchBuses(search: BusSearch): Promise<Bus[]> {
    const journeyDate = new Date(search.journeyDate);
    const nextDay = new Date(journeyDate);
    nextDay.setDate(nextDay.getDate() + 1);

    // Create aliases for the destinations table
    const fromDestinations = alias(destinations, "fromDest");
    const toDestinations = alias(destinations, "toDest");

    const results = await db
      .select({
        id: buses.id,
        operatorName: buses.operatorName,
        busType: buses.busType,
        fromDestinationId: buses.fromDestinationId,
        toDestinationId: buses.toDestinationId,
        departureTime: buses.departureTime,
        arrivalTime: buses.arrivalTime,
        duration: buses.duration,
        price: buses.price,
        availableSeats: buses.availableSeats,
        totalSeats: buses.totalSeats,
        createdAt: buses.createdAt,
      })
      .from(buses)
      .innerJoin(fromDestinations, eq(buses.fromDestinationId, fromDestinations.id))
      .innerJoin(toDestinations, eq(buses.toDestinationId, toDestinations.id))
      .where(
        and(
          sql`${fromDestinations.city} ILIKE ${`%${search.from}%`}`,
          sql`${toDestinations.city} ILIKE ${`%${search.to}%`}`,
          gte(buses.departureTime, journeyDate),
          lte(buses.departureTime, nextDay),
          gte(buses.availableSeats, search.passengers)
        )
      )
      .orderBy(asc(buses.departureTime));
    return results;
  }

  async getBus(id: string): Promise<Bus | undefined> {
    const [bus] = await db.select().from(buses).where(eq(buses.id, id));
    return bus;
  }

  async createBus(bus: InsertBus): Promise<Bus> {
    const [result] = await db.insert(buses).values(bus).returning();
    return result;
  }

  // Booking operations
  async createBooking(booking: InsertBooking): Promise<Booking> {
    const [result] = await db.insert(bookings).values(booking).returning();
    return result;
  }

  async getBooking(id: string): Promise<Booking | undefined> {
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
    return booking;
  }

  async getUserBookings(userId: string): Promise<Booking[]> {
    return await db
      .select()
      .from(bookings)
      .where(eq(bookings.userId, userId))
      .orderBy(desc(bookings.createdAt));
  }

  async updateBookingStatus(id: string, status: "pending" | "confirmed" | "cancelled" | "completed"): Promise<Booking> {
    const [result] = await db
      .update(bookings)
      .set({ status })
      .where(eq(bookings.id, id))
      .returning();
    return result;
  }

  // Travel Guide operations
  async getPublishedArticles(): Promise<TravelGuideArticle[]> {
    return await db
      .select()
      .from(travelGuideArticles)
      .where(eq(travelGuideArticles.published, true))
      .orderBy(desc(travelGuideArticles.publishedAt));
  }

  async getArticle(slug: string): Promise<TravelGuideArticle | undefined> {
    const [article] = await db
      .select()
      .from(travelGuideArticles)
      .where(eq(travelGuideArticles.slug, slug));
    return article;
  }

  async createArticle(article: InsertTravelGuideArticle): Promise<TravelGuideArticle> {
    const [result] = await db.insert(travelGuideArticles).values(article).returning();
    return result;
  }
}

export const storage = new DatabaseStorage();
