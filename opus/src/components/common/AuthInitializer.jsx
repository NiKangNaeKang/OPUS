import { useEffect, useRef } from "react";
import { useAuthStore } from "../auth/useAuthStore";
import { useCartStore } from "../../store/useCartStore";
import { useNotificationStore } from "../../store/useNotificationStore";

const AuthInitializer = () => {
  const { isLoggedIn } = useAuthStore();
  const { setLoggedIn, mergeWithServer } = useCartStore();
  const fetchNotifications = useNotificationStore((s) => s.fetchNotifications);

  useEffect(() => {
    setLoggedIn(isLoggedIn);

    if (isLoggedIn) {
      mergeWithServer();
      fetchNotifications();
    }

  }, [isLoggedIn]);

  return null;
};

export default AuthInitializer;