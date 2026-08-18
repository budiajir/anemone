import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

/**
 * ProtectedRoute component to guard all /admin routes.
 * Checks localStorage and sessionStorage for active admin authentication.
 * Redirects to /admin/login if not authenticated.
 */
export default function ProtectedRoute() {
  const location = useLocation();
  const isAuthenticated = 
    localStorage.getItem('anemone_admin_auth') === 'true' ||
    sessionStorage.getItem('anemone_admin_auth') === 'true';

  if (!isAuthenticated) {
    // Redirect to login page and retain previous path in state for post-login redirect
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
