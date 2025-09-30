import { z } from "zod";

export const ConnectorSchema = z.object({
  type: z.enum(["Tesla", "CCS", "Type 2", "CHAdeMO"]),
  speed: z.number().positive(),
});

export const StationSchema = z.object({
  id: z.string(),
  name: z.string().min(3, "Name must be at least 3 characters."),
  address: z.string().min(10, "Address must be at least 10 characters."),
  coordinates: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
  }),
  connectors: z
    .array(ConnectorSchema)
    .min(1, "At least one connector is required."),
  price: z.number().nonnegative("Price must be a positive number."),
  totalChargers: z.number().int().min(1, "Total chargers must be at least 1."),
  availableChargers: z.number().int().nonnegative(),
  rating: z.number().min(0).max(5),
});

// Full schema (with id) + refinement
export const RefinedStationSchema = StationSchema.refine(
  (data) => data.availableChargers <= data.totalChargers,
  {
    message: "Available chargers cannot exceed total chargers.",
    path: ["availableChargers"],
  }
);

// Schema for creating (no id, still refined)
export const CreateStationSchema = StationSchema.omit({ id: true }).refine(
  (data) => data.availableChargers <= data.totalChargers,
  {
    message: "Available chargers cannot exceed total chargers.",
    path: ["availableChargers"],
  }
);
