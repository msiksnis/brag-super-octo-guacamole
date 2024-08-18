import { z } from "zod";

export const signUpSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Invalid email address"),
  username: z
    .string()
    .trim()
    .min(1, "Username is required")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    ),
  password: z.string().trim().min(8, "Password must be at least 8 characters"),
});

export type SignUpValues = z.infer<typeof signUpSchema>;

export const loginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, "Username is required")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    ),
  password: z.string().trim().min(8, "Password must be at least 8 characters"),
});

export type LoginValues = z.infer<typeof loginSchema>;

// export const createPostSchema = z.object({
//   content: z.string().trim().min(1, "Required"),
//   mediaIds: z.array(z.string()).max(8, "Cannot have more than 8 attachments"),
// });

export const createPostSchema = z
  .object({
    content: z.string().trim().optional(),
    mediaIds: z.array(z.string()).max(8, "Cannot have more than 8 attachments"),
  })
  .refine(
    (data) => {
      return data.content?.trim().length! > 0 || data.mediaIds.length > 0;
    },
    {
      message: "Content or at least one attachment is required",
      path: ["content"],
    }
  );

export const updateUserProfileSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(1, "Required")
    .max(15, "Displayname cannot be longer than 15 characters"),
  bio: z.string().max(1000, "Bio cannot be more than 1000 characters"),
});

export type UpdateUserProfileValues = z.infer<typeof updateUserProfileSchema>;

export const createCommentSchema = z.object({
  content: z.string().trim().min(1, "Required"),
});
