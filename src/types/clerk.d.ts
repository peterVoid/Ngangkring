import { UserRoles } from "@/db/schema";

export {};

declare global {
  interface CustomJwtSessionClaims {
    userId: string;
    role: UserRoles;
  }

  interface UserPublicMetadata {
    userId: string;
    role: UserRoles;
  }
}
