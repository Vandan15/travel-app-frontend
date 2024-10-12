import { ApolloClient, ApolloLink, createHttpLink, from } from "@apollo/client";
import { InMemoryCache } from "@apollo/client/cache";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import toast from "react-hot-toast";
import { TOKEN } from "./common/constant";

let disableToastTimeout = null;
export const cacheData = new InMemoryCache();

const httpLink = createHttpLink({
  uri: process.env.REACT_APP_SERVER_URL,
});

const toastMessage = ({ message: content, type }) => {
  toast.dismiss();
  switch (type) {
    case "success":
      toast.success(content);
      break;
    case "error":
      toast.error(content);
      break;
    default:
      break;
  }
};

const authLink = setContext((ctx, { headers }) => {
  // eslint-disable-next-line no-undef
  const userToken = localStorage.getItem(TOKEN);
  let newHeaders = headers || {};

  newHeaders = {
    ...newHeaders,
    Authorization: userToken ? `Bearer ${userToken}` : "",
  };

  return {
    headers: newHeaders,
  };
});

const responseMessageLink = new ApolloLink((operation, forward) =>
  forward(operation)?.map((response) => {
    const { data } = response;
    const keys = Object.keys(data ?? {});
    if (keys?.length > 0 && data?.[`${keys?.[0]}`]?.message) {
      console.log(keys?.[0]);
      if (keys?.[0] === "forgotUserPassword") {
        if (data?.[`${keys?.[0]}`]?.status !== "ERROR") {
          setTimeout(() => {
            toastMessage({
              message:
                data?.[`${keys?.[0]}`]?.message || "Operation successful",
              type: "success",
            });
          }, 1000);
        }
      } else {
        setTimeout(() => {
          const oResponse = data?.[`${keys?.[0]}`];

          if (!response) {
            return;
          }

          toastMessage({
            message: oResponse?.message || "Operation successful",
            type: oResponse?.status === "ERROR" ? "error" : "success",
          });
        }, 1000);
      }
    }
    return response;
  })
);

const errorLink = onError((options) => {
  const { graphQLErrors, networkError, response } = options;
  if (networkError && "statusCode" in networkError) {
    if (networkError.statusCode === 405) {
      if (disableToastTimeout) {
        clearTimeout(disableToastTimeout);
      }

      disableToastTimeout = setTimeout(() => {
        if (networkError.message) {
          toastMessage({
            message: networkError.message,
            type: "error",
          });
        }
      }, 200);

      return;
    }
  }

  if (graphQLErrors && graphQLErrors?.length > 0) {
    const isForBidden = graphQLErrors?.[0]?.extensions?.code === "FORBIDDEN";
    const isTokenExpired =
      graphQLErrors?.[0]?.extensions?.code === "TOKEN_EXPIRED"; // make sure you get this code from backend

    if (isTokenExpired) {
      if (!isForBidden) {
        setTimeout(() => {
          toastMessage({
            message: graphQLErrors?.[0]?.message,
            type: "error",
          });
        }, 1000);
      } else {
        setTimeout(() => {
          toastMessage({
            message: "Something went wrong!",
            type: "error",
          });
        }, 1000);
      }
    }
  }

  if (response) {
    response?.errors?.map((error) => {
      const { message: errorMessage, locations, path, extensions } = error;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const exceptionName = extensions?.exception;

      // Enable when sentry integrated
      // Sentry?.captureException(
      //   new Error(
      //     `[Response error]: Message: ${errorMessage}, Location: ${locations}, Path: ${path}`,
      //   ),
      // );

      if (extensions?.code === "SESSION_EXPIRED") {
        // window.location.href = ROUTES?.AUTHENTICATION;
      }

      if (
        extensions?.code === "UNAUTHORIZED" ||
        extensions?.code === 405 ||
        extensions?.code === "INVALID_TOKEN" ||
        extensions?.code === "LOGIN_REQUIRED" ||
        exceptionName?.name === "JsonWebTokenError"
      ) {
        localStorage.clear();
      }

      toastMessage({
        message: errorMessage,
        type: "error",
      });

      // eslint-disable-next-line no-console
      return console?.log(
        `[Response error]: Message: ${errorMessage}, Location: ${locations}, Path: ${path}`
      );
    });
  }

  if (networkError) {
    // eslint-disable-next-line no-console
    console?.log(`[Network error]: ${networkError}`);
    toastMessage({ message: networkError?.message, type: "error" });
    // Sentry?.captureException(new Error(`[Network error]: ${networkError}`));
  }
});

const client = new ApolloClient({
  cache: cacheData,
  link: from([errorLink, authLink, httpLink, responseMessageLink]), // responseMessageLink - removed for future use
});

export default client;
