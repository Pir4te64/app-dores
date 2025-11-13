import { z } from 'zod';

export const registerSchema = z.object({
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  email: z.string().email('Dirección de correo electrónico inválida'),
  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'La contraseña debe contener al menos una letra mayúscula')
    .regex(/[a-z]/, 'La contraseña debe contener al menos una letra minúscula')
    .regex(/[0-9]/, 'La contraseña debe contener al menos un número'),
  code: z.string().min(4, 'El código debe tener al menos 6 caracteres'),
  termsAndConditions: z.boolean().refine((val) => val, {
    message: 'Debes aceptar los términos y condiciones',
  }),
});

export const loginSchema = z.object({
  email: z.string().email('Dirección de correo electrónico inválida'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export const resetPassword = z.object({
  email: z.string().email('Dirección de correo electrónico inválida'),
});

export const verifyResetCode = z
  .object({
    code: z.string().min(4),
    newPassword: z
      .string()
      .min(6, 'La contraseña debe tener al menos 6 caracteres')
      .regex(/[A-Z]/, 'La contraseña debe contener al menos una letra mayúscula')
      .regex(/[a-z]/, 'La contraseña debe contener al menos una letra minúscula')
      .regex(/[0-9]/, 'La contraseña debe contener al menos un número'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPassword>;
export type VerifyResetCodeFormData = z.infer<typeof verifyResetCode>;
