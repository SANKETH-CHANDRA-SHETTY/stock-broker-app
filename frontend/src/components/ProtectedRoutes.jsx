import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import userContext from '../context/userContext';

const ProtectedRoutes = () => {
  const { user } = useContext(userContext);

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoutes;