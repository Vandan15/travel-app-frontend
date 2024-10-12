import { useContext } from 'react';
import { Navigate, Outlet } from "react-router-dom";
import { AppContext } from "./AppContext";
import { ROUTES } from "./common/constant";

function PublicRoute() {
  const {
    getToken,
    state: { redirectRoute },
  } = useContext(AppContext);
  const idToken = getToken();

  return idToken ? <Navigate to={redirectRoute || ROUTES.MAIN} /> : <Outlet />;
}

export default PublicRoute;
