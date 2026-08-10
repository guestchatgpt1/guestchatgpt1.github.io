import { z } from "zod";

export const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required")
  .email("Please enter a valid email address")
  .max(255, "Email must be under 255 characters");

export const newsletterSchema = z.object({
  email: emailSchema,
});

export const chatMessageSchema = z
  .string()
  .trim()
  .min(1, "Please type a message.")
  .max(1000, "Message must be under 1000 characters.");

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your full name")
    .max(100, "Name must be under 100 characters")
    .regex(/^[\p{L}\p{M}'.\- ]+$/u, "Name contains invalid characters"),
  email: emailSchema,
  company: z
    .string()
    .trim()
    .max(100, "Company name is too long")
    .optional()
    .or(z.literal("")),
  department: z.enum(["general", "sales", "support", "partnerships", "marketing", "careers"]),
  message: z
    .string()
    .trim()
    .min(10, "Please add a bit more detail (at least 10 characters)")
    .max(2000, "Message must be under 2000 characters"),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const feedbackSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your full name")
    .max(100, "Name must be under 100 characters")
    .regex(/^[\p{L}\p{M}'.\- ]+$/u, "Name contains invalid characters"),
  phone: z
    .string()
    .trim()
    .min(7, "Please enter a valid phone number")
    .max(20, "Phone number is too long")
    .regex(/^[+]?[\d\s\-()]{7,20}$/, "Please enter a valid phone number"),
  email: emailSchema,
  feedback: z
    .string()
    .trim()
    .min(10, "Please add a bit more detail (at least 10 characters)")
    .max(2000, "Feedback must be under 2000 characters"),
});

export type FeedbackInput = z.infer<typeof feedbackSchema>;
