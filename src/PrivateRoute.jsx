import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AppContext } from './AppContext';
import { ROUTES } from "./common/constant";
import useRouter from "./hooks/useRouter";

const PrivateRoute = () => {
  const { getToken } = useContext(AppContext);
  const idToken = getToken();
  const { location } = useRouter();
  return !idToken ? (
    <Navigate to={ROUTES.LOGIN} state={{ from: location }} />
  ) : (
    <Outlet />
  );
};
export default PrivateRoute;
