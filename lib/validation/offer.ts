import { z } from "zod";

export const offerFormSchema = z.object({
  title: z.string().min(2, "Poné un título para la oferta."),
  product_ids: z.array(z.string()).min(1, "Elegí al menos un producto."),
  ends_at: z.string().optional(),
});

export type OfferFormValues = z.infer<typeof offerFormSchema>;
