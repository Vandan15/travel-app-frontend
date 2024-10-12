import React, { createContext, useReducer } from "react";
import client from "./apollo";
import { AppContextAction, TOKEN } from "./common/constant";

const initialState = {
  currentUser: {},
  authenticated: !!localStorage.getItem(TOKEN),
  authToken: localStorage.getItem(TOKEN),
};

const reducer = (state, action) => {
  switch (action?.type) {
    case AppContextAction.SET_CURRENT_USER:
      // eslint-disable-next-line no-case-declarations
      const user = action.data || {};
      return { ...state, currentUser: { ...state?.currentUser, ...user } };
    case AppContextAction.SET_AUTH_TOKEN:
      localStorage.setItem(TOKEN, action.data ?? "");
      return { ...state, authToken: action.data };
    case AppContextAction.LOGOUT:
      localStorage.clear();
      client?.clearStore();
      return {
        ...initialState,
        authenticated: false,
        authToken: null,
        user: {},
      };
    case AppContextAction.SET_AUTHENTICATED:
      return { ...state, authenticated: action.data };

    default:
      return { ...state };
  }
};

const AppContext = createContext(null);

const AppContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const getToken = () => localStorage.getItem(TOKEN) || null;

  const isAuthenticated = () => state.authenticated;

  const initializeAuth = (authToken, userData) => {
    const token = authToken || getToken();
    const user = userData || {};
    if (token) {
      dispatch({ type: "SET_AUTH_TOKEN", data: token });
      dispatch({ type: "SET_AUTHENTICATED", data: true });
      dispatch({ type: "SET_CURRENT_USER", data: user });
    }
  };

  const value = {
    state,
    dispatch,
    isAuthenticated,
    getToken,
    initializeAuth,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

const AppContextConsumer = AppContext.Consumer;

export { AppContext, AppContextConsumer, AppContextProvider };
