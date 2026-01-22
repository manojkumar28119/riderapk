// lib/schemas/auth.schema.ts
import * as z from "zod";

import { Errors } from "@/data/constants/errors.constants";

export const loginSchema = z.object({
  email: z.string().min(1, Errors.email.required).max(150, Errors.textMaxLength).email(Errors.email.invalid),
  password: z.string().min(1, Errors.password.required).max(150, Errors.textMaxLength),
});

export const registerSchema = z.object({
  email: z.string().min(1, Errors.email.required).max(150, Errors.textMaxLength).email(Errors.email.invalid),
  phoneNumber: z.string().min(1, Errors.phoneNumber.required).max(150, Errors.textMaxLength),
  password: z.string().max(150, Errors.textMaxLength),
  confirmPassword: z.string().min(1, Errors.password.required).max(150, Errors.textMaxLength),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: Errors.acceptTerms,
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: Errors.password.mismatch,
  path: ["confirmPassword"],
});

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, Errors.email.required).max(150, Errors.textMaxLength).email(Errors.email.invalid),
});

export const resetPasswordSchema = z
  .object({
    newPassword: z.string().max(150, Errors.textMaxLength),
    confirmPassword: z
      .string()
      .min(1, Errors.password.required)
      .max(150, Errors.textMaxLength),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: Errors.password.mismatch,
    path: ["confirmPassword"],
  });

export const otpVerificationSchema = z.object({
  code: z.string().length(6, Errors.otp.required),
});