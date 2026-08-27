import { z } from "zod";
import { AVAILABILITIES, CATEGORIES } from "@/lib/types";

export const describeImageSchema = z.object({
  imageUrls: z.array(z.string().url()).min(1).max(5),
  productName: z.string().optional(),
  category: z.string().optional(),
});

export const productFormSchema = z.object({
  name: z.string().min(2, "Poné un nombre para el producto."),
  category: z.enum(CATEGORIES),
  subcategory: z.string().optional(),
  images: z.array(z.string()).min(1, "Subí al menos una foto."),
  description: z.string().optional(),
  availability: z.enum(AVAILABILITIES),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;
