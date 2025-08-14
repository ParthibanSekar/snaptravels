import { sql } from "drizzle-orm";
import { relations } from "drizzle-orm";
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  decimal,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (mandatory for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);

// User storage table (mandatory for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  phone: varchar("phone"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Enums
export const travelTypeEnum = pgEnum("travel_type", ["flight", "hotel", "train", "bus"]);
export const bookingStatusEnum = pgEnum("booking_status", ["pending", "confirmed", "cancelled", "completed"]);
export const seatClassEnum = pgEnum("seat_class", ["economy", "business", "first", "sleeper", "ac1", "ac2", "ac3"]);

// Destinations
export const destinations = pgTable("destinations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  city: varchar("city").notNull(),
  state: varchar("state").notNull(),
  country: varchar("country").notNull().default("India"),
  description: text("description"),
  imageUrl: varchar("image_url"),
  popularityScore: integer("popularity_score").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Airlines
export const airlines = pgTable("airlines", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  code: varchar("code").notNull().unique(),
  logoUrl: varchar("logo_url"),
});

// Flights
export const flights = pgTable("flights", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  airlineId: varchar("airline_id").notNull().references(() => airlines.id),
  flightNumber: varchar("flight_number").notNull(),
  fromDestinationId: varchar("from_destination_id").notNull().references(() => destinations.id),
  toDestinationId: varchar("to_destination_id").notNull().references(() => destinations.id),
  departureTime: timestamp("departure_time").notNull(),
  arrivalTime: timestamp("arrival_time").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  availableSeats: integer("available_seats").notNull(),
  totalSeats: integer("total_seats").notNull(),
  seatClass: seatClassEnum("seat_class").notNull(),
  duration: integer("duration_minutes").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Hotels
export const hotels = pgTable("hotels", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  destinationId: varchar("destination_id").notNull().references(() => destinations.id),
  address: text("address").notNull(),
  rating: decimal("rating", { precision: 2, scale: 1 }),
  pricePerNight: decimal("price_per_night", { precision: 10, scale: 2 }).notNull(),
  amenities: text("amenities").array(),
  imageUrl: varchar("image_url"),
  description: text("description"),
  availableRooms: integer("available_rooms").notNull(),
  totalRooms: integer("total_rooms").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Trains
export const trains = pgTable("trains", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  trainNumber: varchar("train_number").notNull(),
  trainName: varchar("train_name").notNull(),
  fromDestinationId: varchar("from_destination_id").notNull().references(() => destinations.id),
  toDestinationId: varchar("to_destination_id").notNull().references(() => destinations.id),
  departureTime: timestamp("departure_time").notNull(),
  arrivalTime: timestamp("arrival_time").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  availableSeats: integer("available_seats").notNull(),
  seatClass: seatClassEnum("seat_class").notNull(),
  duration: integer("duration_minutes").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Buses
export const buses = pgTable("buses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  operatorName: varchar("operator_name").notNull(),
  fromDestinationId: varchar("from_destination_id").notNull().references(() => destinations.id),
  toDestinationId: varchar("to_destination_id").notNull().references(() => destinations.id),
  departureTime: timestamp("departure_time").notNull(),
  arrivalTime: timestamp("arrival_time").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  availableSeats: integer("available_seats").notNull(),
  totalSeats: integer("total_seats").notNull(),
  busType: varchar("bus_type").notNull(), // AC, Non-AC, Sleeper, etc.
  duration: integer("duration_minutes").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Bookings
export const bookings = pgTable("bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  travelType: travelTypeEnum("travel_type").notNull(),
  flightId: varchar("flight_id").references(() => flights.id),
  hotelId: varchar("hotel_id").references(() => hotels.id),
  trainId: varchar("train_id").references(() => trains.id),
  busId: varchar("bus_id").references(() => buses.id),
  passengerDetails: jsonb("passenger_details").notNull(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  status: bookingStatusEnum("status").notNull().default("pending"),
  bookingDate: timestamp("booking_date").defaultNow(),
  travelDate: timestamp("travel_date").notNull(),
  checkInDate: timestamp("check_in_date"), // for hotels
  checkOutDate: timestamp("check_out_date"), // for hotels
  paymentId: varchar("payment_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Travel Guide Articles
export const travelGuideArticles = pgTable("travel_guide_articles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  content: text("content").notNull(),
  excerpt: varchar("excerpt"),
  imageUrl: varchar("image_url"),
  slug: varchar("slug").notNull().unique(),
  authorId: varchar("author_id").notNull().references(() => users.id),
  destinationId: varchar("destination_id").references(() => destinations.id),
  published: boolean("published").default(false),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  bookings: many(bookings),
  articles: many(travelGuideArticles),
}));

export const destinationsRelations = relations(destinations, ({ many }) => ({
  departingFlights: many(flights, { relationName: "departingFlights" }),
  arrivingFlights: many(flights, { relationName: "arrivingFlights" }),
  hotels: many(hotels),
  departingTrains: many(trains, { relationName: "departingTrains" }),
  arrivingTrains: many(trains, { relationName: "arrivingTrains" }),
  departingBuses: many(buses, { relationName: "departingBuses" }),
  arrivingBuses: many(buses, { relationName: "arrivingBuses" }),
  articles: many(travelGuideArticles),
}));

export const airlinesRelations = relations(airlines, ({ many }) => ({
  flights: many(flights),
}));

export const flightsRelations = relations(flights, ({ one, many }) => ({
  airline: one(airlines, {
    fields: [flights.airlineId],
    references: [airlines.id],
  }),
  fromDestination: one(destinations, {
    fields: [flights.fromDestinationId],
    references: [destinations.id],
    relationName: "departingFlights",
  }),
  toDestination: one(destinations, {
    fields: [flights.toDestinationId],
    references: [destinations.id],
    relationName: "arrivingFlights",
  }),
  bookings: many(bookings),
}));

export const hotelsRelations = relations(hotels, ({ one, many }) => ({
  destination: one(destinations, {
    fields: [hotels.destinationId],
    references: [destinations.id],
  }),
  bookings: many(bookings),
}));

export const trainsRelations = relations(trains, ({ one, many }) => ({
  fromDestination: one(destinations, {
    fields: [trains.fromDestinationId],
    references: [destinations.id],
    relationName: "departingTrains",
  }),
  toDestination: one(destinations, {
    fields: [trains.toDestinationId],
    references: [destinations.id],
    relationName: "arrivingTrains",
  }),
  bookings: many(bookings),
}));

export const busesRelations = relations(buses, ({ one, many }) => ({
  fromDestination: one(destinations, {
    fields: [buses.fromDestinationId],
    references: [destinations.id],
    relationName: "departingBuses",
  }),
  toDestination: one(destinations, {
    fields: [buses.toDestinationId],
    references: [destinations.id],
    relationName: "arrivingBuses",
  }),
  bookings: many(bookings),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
  user: one(users, {
    fields: [bookings.userId],
    references: [users.id],
  }),
  flight: one(flights, {
    fields: [bookings.flightId],
    references: [flights.id],
  }),
  hotel: one(hotels, {
    fields: [bookings.hotelId],
    references: [hotels.id],
  }),
  train: one(trains, {
    fields: [bookings.trainId],
    references: [trains.id],
  }),
  bus: one(buses, {
    fields: [bookings.busId],
    references: [buses.id],
  }),
}));

export const travelGuideArticlesRelations = relations(travelGuideArticles, ({ one }) => ({
  author: one(users, {
    fields: [travelGuideArticles.authorId],
    references: [users.id],
  }),
  destination: one(destinations, {
    fields: [travelGuideArticles.destinationId],
    references: [destinations.id],
  }),
}));

// Insert schemas
export const insertDestinationSchema = createInsertSchema(destinations).omit({ id: true, createdAt: true });
export const insertFlightSchema = createInsertSchema(flights).omit({ id: true, createdAt: true });
export const insertHotelSchema = createInsertSchema(hotels).omit({ id: true, createdAt: true });
export const insertTrainSchema = createInsertSchema(trains).omit({ id: true, createdAt: true });
export const insertBusSchema = createInsertSchema(buses).omit({ id: true, createdAt: true });
export const insertBookingSchema = createInsertSchema(bookings).omit({ id: true, createdAt: true, bookingDate: true });
export const insertTravelGuideArticleSchema = createInsertSchema(travelGuideArticles).omit({ id: true, createdAt: true, updatedAt: true });

// Search schemas
export const flightSearchSchema = z.object({
  from: z.string().min(1),
  to: z.string().min(1),
  departureDate: z.string(),
  passengers: z.number().min(1).default(1),
  seatClass: z.enum(["economy", "business", "first"]).default("economy"),
});

export const hotelSearchSchema = z.object({
  destination: z.string().min(1),
  checkInDate: z.string(),
  checkOutDate: z.string(),
  guests: z.number().min(1).default(1),
  rooms: z.number().min(1).default(1),
});

export const trainSearchSchema = z.object({
  from: z.string().min(1),
  to: z.string().min(1),
  journeyDate: z.string(),
  seatClass: z.enum(["sleeper", "ac3", "ac2", "ac1"]).default("sleeper"),
});

export const busSearchSchema = z.object({
  from: z.string().min(1),
  to: z.string().min(1),
  journeyDate: z.string(),
  passengers: z.number().min(1).default(1),
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Destination = typeof destinations.$inferSelect;
export type Flight = typeof flights.$inferSelect;
export type Hotel = typeof hotels.$inferSelect;
export type Train = typeof trains.$inferSelect;
export type Bus = typeof buses.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
export type TravelGuideArticle = typeof travelGuideArticles.$inferSelect;
export type InsertDestination = z.infer<typeof insertDestinationSchema>;
export type InsertFlight = z.infer<typeof insertFlightSchema>;
export type InsertHotel = z.infer<typeof insertHotelSchema>;
export type InsertTrain = z.infer<typeof insertTrainSchema>;
export type InsertBus = z.infer<typeof insertBusSchema>;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type InsertTravelGuideArticle = z.infer<typeof insertTravelGuideArticleSchema>;
export type FlightSearch = z.infer<typeof flightSearchSchema>;
export type HotelSearch = z.infer<typeof hotelSearchSchema>;
export type TrainSearch = z.infer<typeof trainSearchSchema>;
export type BusSearch = z.infer<typeof busSearchSchema>;
