
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
  address: string;
  rent: number;
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


// Admin-specific types
/**
 * Represents the admin registration data.
 */
export interface AdminDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  username: string;
}

/**
 * Represents the admin login request.
 */
export interface AdminLoginDto {
  username: string;
  password: string;
}

/**
 * Represents the admin login response.
 */
export interface AdminLoginResponse {
  token: string;
  type: 'Bearer';
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}

/**
 * Represents the admin user object.
 */
export interface AdminUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}

/**
 * Represents turf status enum.
 */
export enum TurfStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING = 'PENDING'
}

/**
 * Represents GeoJSON Point for coordinates.
 */
export interface GeoJsonPoint {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

/**
 * Represents the turf DTO for creating/updating turfs via admin.
 */
export interface TurfDto {
  id?: string;
  name: string;
  status: TurfStatus;
  owner: number;
  manager: number;
  rent: number;
  amenities: string;
  phone: string;
  email: string;
  address: string;
  coordinates: GeoJsonPoint;
}

/**
 * Represents the full turf entity response.
 */
export interface TurfEntity {
  id: string;
  name: string;
  status: TurfStatus;
  owner: number;
  manager: number;
  rent: number;
  amenities: string;
  phone: string;
  email: string;
  address: string;
  coordinates: GeoJsonPoint;
  slotDuration: number;
  startHour: number;
  endHour: number;
  createdAt: string;
}
