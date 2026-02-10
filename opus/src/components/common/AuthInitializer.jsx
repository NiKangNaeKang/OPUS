import { useEffect } from "react";
import { useAuthStore } from "../auth/useAuthStore";
import { useCartStore } from "../../store/cartStore";

const AuthInitializer = () => {
  const { isLoggedIn } = useAuthStore();
  const { setLoggedIn, mergeWithServer } = useCartStore();

  useEffect(() => {
    setLoggedIn(isLoggedIn);

    if (isLoggedIn) {
      mergeWithServer();
    }
  }, [isLoggedIn]);

  return null;
};

export default AuthInitializer;