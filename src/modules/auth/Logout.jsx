import { useContext, useEffect } from "react";
import { AppContext } from "../../AppContext";
import { ROUTES } from "../../common/constant";
import useRouter from "../../hooks/useRouter";

export default function Logout() {
  const { dispatch } = useContext(AppContext);
  const { navigate } = useRouter();

  useEffect(() => {
    navigate(ROUTES.MAIN, { replace: true });
    dispatch({ type: "LOGOUT" });
  }, [dispatch, navigate]);

  return null;
}
