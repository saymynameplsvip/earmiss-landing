import React, { useEffect } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Privacy from "./pages/Privacy";
import QueryPage from "./pages/Summaries";
import StatsPage from "./pages/Stats";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { setupInterceptors } from "./api/axiosInstance";

const queryClient = new QueryClient();

function AppInner() {
  const auth = useAuth();

  useEffect(() => {
    const eject = setupInterceptors(auth);
    return () => eject();
  }, [auth, auth.accessToken, auth.refreshToken]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/summaries/:uuid" element={<QueryPage />} />
        <Route path="/stats" element={<StatsPage />} />
      </Routes>
    </Router>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppInner />
      </AuthProvider>
    </QueryClientProvider>
  );
}
