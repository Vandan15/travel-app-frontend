import { ApolloClient, createHttpLink, from } from "@apollo/client";
import { InMemoryCache } from "@apollo/client/cache";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { TOKEN } from "./common/constant";

let disableToastTimeout = null;
export const cacheData = new InMemoryCache();

const httpLink = createHttpLink({
  uri: process.env.REACT_APP_SERVER_URL,
});

const toast = ({ message: content, type }) => {
  // messageContext?.destroy();
  // switch (type) {
  //   case "info":
  //     messageContext?.info(content);
  //     break;
  //   case "success":
  //     messageContext?.success(content);
  //     break;
  //   case "warning":
  //     messageContext?.warning(content);
  //     break;
  //   case "error":
  //     messageContext?.error(content);
  //     break;
  //   default:
  //     break;
  // }
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

const errorLink = onError((options) => {
  const { graphQLErrors, networkError, response } = options;
  if (networkError && "statusCode" in networkError) {
    if (networkError.statusCode === 405) {
      if (disableToastTimeout) {
        clearTimeout(disableToastTimeout);
      }

      disableToastTimeout = setTimeout(() => {
        if (networkError.message) {
          toast({
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
          toast({
            message: graphQLErrors?.[0]?.message,
            type: "error",
          });
        }, 1000);
      } else {
        setTimeout(() => {
          toast({
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

      // commenting for future use
      // setTimeout(() => {
      //   toast({
      //     message: errorMessage,
      //     type: 'error',
      //   });
      // }, 1000);

      // eslint-disable-next-line no-console
      return console?.log(
        `[Response error]: Message: ${errorMessage}, Location: ${locations}, Path: ${path}`
      );
    });
  }

  if (networkError) {
    // eslint-disable-next-line no-console
    console?.log(`[Network error]: ${networkError}`);
    toast({ message: networkError?.message, type: "error" });
    // Sentry?.captureException(new Error(`[Network error]: ${networkError}`));
  }
});

const client = new ApolloClient({
  cache: cacheData,
  link: from([errorLink, authLink, httpLink]), // responseMessageLink - removed for future use
});

export default client;
