import * as yup from "yup";
import { sanitizeEmail, sanitizeName, sanitizePhone } from "./sanitize";

// Letters (any language, including Tamil) + combining marks, spaces, . ' -
// Built with RegExp() so TypeScript doesn't complain about the target for \p{...}
const NAME_REGEX = new RegExp("^[\\p{L}\\p{M}][\\p{L}\\p{M}\\s.'-]*$", "u");

// Indian mobile: 10 digits, starting with 6-9
const PHONE_REGEX = /^[6-9]\d{9}$/;

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;

// All 10 digits identical, e.g. 9999999999
export const isRepeatedDigits = (value: string) => /^(\d)\1{9}$/.test(value);

// Ascending/descending runs, e.g. 9876543210, 6789012345
export const isSequential = (value: string) => {
  const ascending = "01234567890123456789";
  const descending = "98765432109876543210";
  return ascending.includes(value) || descending.includes(value);
};

export const emailSchema = yup
  .string()
  .transform((value) => sanitizeEmail(value))
  .required("Email is required")
  .max(254, "Email is too long")
  .matches(EMAIL_REGEX, {
    message: "Enter a valid email address",
    excludeEmptyString: true,
  });

export const phoneSchema = yup
  .string()
  .transform((value) => sanitizePhone(value))
  .required("Phone number is required")
  .matches(PHONE_REGEX, {
    message: "Enter a valid 10-digit mobile number",
    excludeEmptyString: true,
  })
  .test(
    "not-repeated-digits",
    "Phone number cannot have all the same digits",
    (value) => !value || !isRepeatedDigits(value)
  )
  .test(
    "not-sequential",
    "Enter a valid mobile number",
    (value) => !value || !isSequential(value)
  );

export const registrationSchema = yup
  .object({
    name: yup
      .string()
      .transform((value) => sanitizeName(value))
      .required("Name is required")
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must be at most 100 characters")
      .matches(NAME_REGEX, {
        message: "Name can only contain letters, spaces, . ' and -",
        excludeEmptyString: true,
      }),

    email: emailSchema,

    phone: phoneSchema,
  })
  .required();

export type RegistrationInput = yup.InferType<typeof registrationSchema>;