
import axios from "axios";
import { 
  AdminDto, 
  AdminLoginDto, 
  AdminLoginResponse, 
  TurfDto, 
  TurfEntity 
} from "@/types";

const API_BASE_URL = "http://localhost:8080";

const adminApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

adminApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Admin Authentication
export const adminSignup = async (adminData: AdminDto): Promise<{ message: string }> => {
  const response = await adminApi.post('/admin/new', adminData);
  return response.data;
};

export const adminSignin = async (loginData: AdminLoginDto): Promise<AdminLoginResponse> => {
  const response = await adminApi.post<AdminLoginResponse>('/admin/signin', loginData);
  return response.data;
};

// Admin Turf Management
export const createTurf = async (turfData: TurfDto): Promise<TurfEntity> => {
  const response = await adminApi.post<TurfEntity>('/turfs/new', turfData);
  return response.data;
};


export const getAllTurfs = async (adminId: string): Promise<TurfEntity[]> => {
  const response = await adminApi.get('/admin/turfs/' + adminId);
  return response.data;
};

export const updateTurf = async (id: string, turfData: TurfDto): Promise<TurfEntity> => {
  const response = await adminApi.put<TurfEntity>(`/admin/turfs/${id}`, turfData);
  return response.data;
};

export const deleteTurf = async (id: string): Promise<void> => {
  await adminApi.delete(`/admin/turfs/${id}`);
};

export default adminApi;
