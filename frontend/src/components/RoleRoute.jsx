import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const RoleRoute = ({ allowedRoles }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const role = userInfo?.role;

  if (!role) {
    return <Navigate to="/" replace />;
  }

  return allowedRoles.includes(Number(role)) ? <Outlet /> : <Navigate to="/profile" replace />;
};

export default RoleRoute;
