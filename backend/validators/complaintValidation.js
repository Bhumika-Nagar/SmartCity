const { z } = require("zod");

const locationSchema = z.union([
  
  z.string().min(3, "Location is too short"),

  z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
    address: z.string().optional(),
  }),
]);

const complaintSchema = z.object({
  title: z.string().min(5).max(100),
  description: z.string().min(10).max(500),
  location: locationSchema.optional(),
});

module.exports = {complaintSchema};