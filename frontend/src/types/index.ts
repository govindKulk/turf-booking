
/**
 * Represents the data required to log in.
 */
export interface LoginRequest {
  username: string;
  password: string;
}

/**
 * Represents the data required to sign up.
 */
export interface SignupRequest {
  fname: string;
  lname: string;
  username: string;
  email: string;
  password: string;
  phone: string;
}

/**
 * Represents the response from a successful signup.
 */
export interface SignupResponse {
  message: string;
}

/**
 * Represents the full response from the /users/signin endpoint.
 */
export interface LoginResponse {
  userId: number;
  token: string;
  username: string;
  roles: string[];
}

/**
 * Represents the user object stored in the AuthContext.
 */
export interface AuthUser {
  userId: number;
  username: string;
  roles: string[];
}

/**
 * Represents a single turf object from the /turfs endpoint.
 */
export interface Turf {
  id: number;
  name: string;
  description: string;
  location: string;
  pricePerHour: number;
  amenities: string[];
  images: string[];
  rating: number;
  isActive: boolean;
  latitude: number;
  longitude: number;
  contactNumber: string;
  openTime: string;
  closeTime: string;
  sports: string[];
}

/**
 * Represents the data required to create/update a turf (Admin).
 */
export interface CreateTurfRequest {
  name: string;
  description: string;
  location: string;
  pricePerHour: number;
  amenities: string[];
  images: string[];
  latitude: number;
  longitude: number;
  contactNumber: string;
  openTime: string;
  closeTime: string;
  sports: string[];
}

export type UpdateTurfRequest = CreateTurfRequest;

/**
 * Represents a single time slot for a turf.
 */
export interface Slot {
  slotId: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  price: number;
}

/**
 * Represents the data required to book a slot.
 */
export interface BookingRequest {
  turfId: number;
  slotId: string;
  bookingDate: string; // Format: "YYYY-MM-DD"
  startTime: string; // Format: "HH:mm"
  endTime: string; // Format: "HH:mm"
  totalPrice: number;
  notes?: string;
}

/**
 * Represents the response from a successful booking.
 */
export interface BookingResponse {
  bookingId: number;
  message: string;
  bookingReference: string;
}

/**
 * Represents a user's booking record.
 */
export interface Booking {
  bookingId: number;
  turfName: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  status: 'UPCOMING' | 'COMPLETED' | 'CANCELLED';
  bookingReference: string;
  createdAt: string;
  notes?: string;
}
