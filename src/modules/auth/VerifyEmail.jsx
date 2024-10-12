import { useMutation } from "@apollo/client";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import { ROUTES } from "../../common/constant";
import AppLoader from "../../components/common/loaders/AppLoader";
import useRouter from "../../hooks/useRouter";
import { VERIFY_EMAIL } from "./graphql/mutations";

export default function VerifyEmail() {
  const [verifyEmailMutate, { loading }] = useMutation(VERIFY_EMAIL);
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const userId = searchParams.get("uid");
  const { navigate } = useRouter();

  useEffect(() => {
    if (token && userId) {
      verifyEmailMutate({
        variables: { data: { token, userId } },
        onCompleted: (res) => {
          toast.success(res?.verifyEmail?.message);
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
  }, [token, userId]);
  if (loading) return <AppLoader />;
  return null;
}
