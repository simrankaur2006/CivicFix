import { useEffect, useRef } from "react";
import { useAuth } from "@clerk/clerk-react";
import api, { setAuthToken } from "../services/api.js";

// Ensures every axios request carries the current Clerk session token.
export const useApi = () => {
  const { getToken } = useAuth();
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      setAuthToken(getToken);
      initialized.current = true;
    }
  }, [getToken]);

  return api;
};
