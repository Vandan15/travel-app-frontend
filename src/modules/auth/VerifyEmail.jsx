import { useMutation } from "@apollo/client";
import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ROUTES } from "../../common/constant";
import AppLoader from "../../components/common/loaders/AppLoader";
import useRouter from "../../hooks/useRouter";
import { VERIFY_EMAIL } from "./graphql/mutations";

export default function VerifyEmail() {
  const [verifyEmailMutate, { loading }] = useMutation(VERIFY_EMAIL);
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email")?.replace(/ /g, "+");
  const { navigate } = useRouter();
  console.log(token, email);

  useEffect(() => {
    if (token && email) {
      verifyEmailMutate({
        variables: { data: { token, email } },
        onCompleted: () => {
          navigate(ROUTES.LOGIN);
        },
        onError: () => {
          navigate(ROUTES.LOGIN);
        },
      });
    } else {
      navigate(ROUTES.LOGIN);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, email]);
  if (loading) return <AppLoader />;
  return null;
}
