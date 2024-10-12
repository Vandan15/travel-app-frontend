import { useLazyQuery } from "@apollo/client";
import { isEmpty } from "lodash";
import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter as Router, useRoutes } from "react-router-dom";
import { AppContext } from "./AppContext";
import { ROUTES } from "./common/constant";
import AppLayout from "./common/layouts/AppLayout";
import Error404 from "./components/common/error/Error404";
import AppLoader from "./components/common/loaders/AppLoader";
import ForgotPassword from "./modules/auth/ForgotPassword";
import { GET_CURRENT_USER } from "./modules/auth/graphql/queries";
import Login from "./modules/auth/Login";
import Logout from "./modules/auth/Logout";
import Register from "./modules/auth/Register";
import ResetPassword from "./modules/auth/ResetPassword";
import VerifyEmail from "./modules/auth/VerifyEmail";
import Home from "./pages/Home/Home";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";

const RoutesCollection = () => {
  const AUTH_MODULES = [
    {
      path: ROUTES.LOGIN,
      element: <PublicRoute />,
      children: [
        {
          path: ROUTES.LOGIN,
          element: <Login />,
        },
      ],
    },
    {
      path: ROUTES.REGISTER,
      element: <PublicRoute />,
      children: [
        {
          path: ROUTES.REGISTER,
          element: <Register />,
        },
      ],
    },
    {
      path: ROUTES.VERIFY_EMAIL,
      element: <PublicRoute />,
      children: [
        {
          path: ROUTES.VERIFY_EMAIL,
          element: <VerifyEmail />,
        },
      ],
    },
    {
      path: ROUTES.FORGET_PASSWORD,
      element: <PublicRoute />,
      children: [
        {
          path: ROUTES.FORGET_PASSWORD,
          element: <ForgotPassword />,
        },
      ],
    },
    {
      path: ROUTES.RESET,
      element: <PublicRoute />,
      children: [
        {
          path: ROUTES.RESET,
          element: <ResetPassword />,
        },
      ],
    },
    {
      path: ROUTES.LOGOUT,
      element: <PrivateRoute />,
      children: [{ path: ROUTES.LOGOUT, element: <Logout /> }],
    },
  ];

  const OTHER_MODULES = [
    {
      path: ROUTES.MAIN,
      element: <PublicRoute />,
      children: [
        {
          path: ROUTES.MAIN,
          children: [
            {
              path: ROUTES.MAIN,
              element: (
                <AppLayout>
                  <Home />
                </AppLayout>
              ),
            },
            {
              path: "*",
              element: <Error404 />,
            },
          ],
        },
      ],
    },
  ];

  const element = useRoutes([
    ...AUTH_MODULES,
    ...OTHER_MODULES,
  ]);
  return element;
};

const RoutesWrapper = () => {
  const {
    initializeAuth,
    getToken,
    state: { currentUser },
  } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const idToken = getToken();

  const [getCurrentUser] = useLazyQuery(GET_CURRENT_USER, {
    fetchPolicy: "network-only",
    onCompleted: (res) => {
      initializeAuth(idToken, res?.currentUser ?? null);
      setLoading(false);
    },
    onError: () => {
      setLoading(false);
    },
  });

  useEffect(() => {
    if (idToken && isEmpty(currentUser)) {
      getCurrentUser();
    } else {
      setLoading(false);
    }

    // Below line is disabling Eslint auto fix we don't want any value in use effect array
    // We want to call initializeAuth once. Please add this line while you working with hooks and you want to call it once.
    // eslint-disable-next-line
  }, []);

  if (loading) return <AppLoader />;
  return (
    <Router>
      <RoutesCollection />
    </Router>
  );
};
export default RoutesWrapper;
