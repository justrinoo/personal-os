import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { APIError } from "better-auth/api";

import { prisma } from "@/lib/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: {
    enabled: true,
  },
  databaseHooks: {
    user: {
      create: {
        // Single-user system: only the very first account may register.
        before: async (user) => {
          const existingUsers = await prisma.user.count();
          if (existingUsers > 0) {
            throw new APIError("FORBIDDEN", {
              message: "Sign-up is disabled — this Personal OS already has an owner.",
            });
          }
          return { data: user };
        },
      },
    },
  },
});
