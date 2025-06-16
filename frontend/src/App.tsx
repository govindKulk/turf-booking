
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Turfs from "./pages/Turfs";
import TurfDetails from "./pages/TurfDetails";
import BookingCalendar from "./pages/BookingCalendar";
import MyBookings from "./pages/MyBookings";
import Profile from "./pages/Profile";
import Layout from "./components/layout/Layout";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { AdminAuthProvider, useAdminAuth } from "./contexts/AdminAuthContext";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminSignup from "./pages/AdminSignup";
import AdminTurfManagement from "./pages/AdminTurfManagement";

const queryClient = new QueryClient();

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

const AdminRoute = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  
  if (isLoading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  const isAdmin = user?.roles.includes('ROLE_ADMIN');

  return isAuthenticated && isAdmin ? <Outlet /> : <Navigate to="/" replace />;
};

const AdminProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAdminAuth();
  
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

const AppRoutes = () => {
    const { isAuthenticated } = useAuth();
    const { isAuthenticated: isAdminAuthenticated } = useAdminAuth();
    
    return (
        <Routes>
            <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
            <Route path="/signup" element={isAuthenticated ? <Navigate to="/" /> : <Signup />} />

            {/* Admin Authentication Routes */}
            <Route path="/admin/login" element={isAdminAuthenticated ? <Navigate to="/admin" /> : <AdminLogin />} />
            <Route path="/admin/register" element={isAdminAuthenticated ? <Navigate to="/admin" /> : <AdminSignup />} />

            <Route element={<Layout><Outlet/></Layout>}>
                <Route path="/" element={<Home />} />
                <Route path="/turfs" element={<Turfs />} />
                <Route path="/turfs/:id" element={<TurfDetails />} />
                
                <Route element={<ProtectedRoute />}>
                    <Route path="/book/:turfId" element={<BookingCalendar />} />
                    <Route path="/my-bookings" element={<MyBookings />} />
                    <Route path="/profile" element={<Profile />} />
                </Route>

                <Route element={<AdminRoute />}>
                  <Route path="/admin" element={<AdminDashboard />} />
                </Route>

                {/* Admin Protected Routes */}
                <Route element={<AdminProtectedRoute />}>
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/turfs" element={<AdminTurfManagement />} />
                </Route>

                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    )
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Sonner richColors />
    <BrowserRouter>
        <AuthProvider>
            <AdminAuthProvider>
                <AppRoutes />
            </AdminAuthProvider>
        </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
