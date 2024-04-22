import { z } from 'zod';

const fileSchema = z.instanceof(File, { message: 'Required' });
const imageSchema = fileSchema.refine((f) => f.size === 0 || f.type.startsWith('image/'));

export const ProductNewSchema = z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    price: z.coerce.number().int().min(1),
    file: fileSchema.refine((f) => f.size > 0, 'Required'),
    image: imageSchema.refine((f) => f.size > 0, 'Required'),
});

export const ProductEditSchema = z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    price: z.coerce.number().int().min(1),
    file: fileSchema.optional(),
    image: imageSchema.optional(),
});
