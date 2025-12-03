import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const vigilSchema = z.object({
  numeroTurno: z.number().min(1, 'El número de turno debe ser mayor a 0'),
  fechaInicio: z.string().min(1, 'La fecha de inicio es requerida'),
  fechaFin: z.string().min(1, 'La fecha de fin es requerida'),
  parroquia: z.string().optional(),
  titular: z.string().min(1, 'El titular es requerido'),
  estado: z.enum(['programada', 'en_curso', 'finalizada', 'cancelada']),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type VigilInput = z.infer<typeof vigilSchema>;
