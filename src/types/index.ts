export type Role = "PROFESSIONAL" | "CUSTOMER";
export type BookingStatus = "CONFIRMED" | "CANCELLED";

export interface UserPublic {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: Role;
  bio: string | null;
  speciality: string | null;
}

export interface SlotPublic {
  id: string;
  professionalId: string;
  startTime: string; // ISO string
  endTime: string;   // ISO string
  isBooked: boolean;
}

export interface SlotWithProfessional extends SlotPublic {
  professional: UserPublic;
}

export interface BookingPublic {
  id: string;
  slotId: string;
  customerId: string;
  status: BookingStatus;
  notes: string | null;
  createdAt: string;
  slot: SlotWithProfessional;
  customer: UserPublic;
}

// Extend next-auth types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: Role;
    };
  }
  interface User {
    role: Role;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: Role;
    needsOnboarding?: boolean;
  }
}
