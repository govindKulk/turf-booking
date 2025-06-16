import axios from "axios";
import { 
  Turf, 
  Slot, 
  Booking, 
  BookingRequest, 
  BookingResponse,
  CreateTurfRequest,
  UpdateTurfRequest 
} from "@/types";

const API_BASE_URL = "http://localhost:8080";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getTurfs = async (): Promise<Turf[]> => {
  const response = await api.get('/turfs/getAll');
  return response.data;
};

export const getTurfById = async (id: number): Promise<Turf> => {
    const response = await api.get(`/turfs/${id}`);
    return response.data;
};

export const getSlots = async (turfId: number, date: string): Promise<Slot[]> => {
    const response = await api.get('/turfs/getSlots', { params: { turfId, date } });
    return response.data;
};

export const bookSlot = async (bookingData: BookingRequest): Promise<BookingResponse> => {
    const response = await api.post<BookingResponse>('/turfs/bookSlot', bookingData);
    return response.data;
};

export const getUserBookings = async (): Promise<Booking[]> => {
    const response = await api.get('/bookings');
    return response.data;
};

// Admin Endpoints
export const createTurf = async (turfData: CreateTurfRequest): Promise<Turf> => {
  const response = await api.post<Turf>('/turfs', turfData);
  return response.data;
};

export const updateTurf = async (id: number, turfData: UpdateTurfRequest): Promise<Turf> => {
  const response = await api.put<Turf>(`/turfs/${id}`, turfData);
  return response.data;
};

export default api;
