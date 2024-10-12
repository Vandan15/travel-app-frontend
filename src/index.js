import { ApolloProvider } from "@apollo/client";
import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import client from "./apollo";
import { AppContextProvider } from "./AppContext";
import "./index.css";
import RoutesWrapper from "./RoutesWrapper";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ApolloProvider client={client}>
    <AppContextProvider>
      <RoutesWrapper />
    </AppContextProvider>
    <Toaster />
  </ApolloProvider>
);
