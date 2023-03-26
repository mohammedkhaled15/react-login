import { useLocation, Outlet, Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import jwt_decode from "jwt-decode";


const RequireAuth = ({ allowedRoles }) => {
  const location = useLocation();
  const { auth } = useAuth();

  const decoded = auth?.accessToken
    ? jwt_decode(auth.accessToken)
    : undefined

  const roles = decoded?.userInfo?.roles

  return roles.find((role) => allowedRoles.includes(role)) ? (
    <Outlet />
  ) : auth?.user ? (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    <>
      {<Navigate to="/login" state={{ from: location }} replace />}
    </>
  );
};

export default RequireAuth;
