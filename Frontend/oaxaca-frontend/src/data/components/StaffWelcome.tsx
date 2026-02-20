import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  getLoggedInStaffUsername,
  setLoggedInStaffUsername,
} from "./staffSession";

type StaffLocationState = {
  username?: string;
};

export default function StaffWelcome() {
  const location = useLocation();
  const state = (location.state as StaffLocationState | null) ?? null;
  const stateUsername = typeof state?.username === "string" ? state.username.trim() : "";

  const [displayName, setDisplayName] = useState(
    () => stateUsername || getLoggedInStaffUsername() || "John Doe",
  );

  useEffect(() => {
    if (stateUsername) {
      setLoggedInStaffUsername(stateUsername);
      setDisplayName(stateUsername);
      return;
    }

    const persisted = getLoggedInStaffUsername();
    if (persisted) {
      setDisplayName(persisted);
    }
  }, [stateUsername]);

  return <h2 className="welcomeText"> Welcome, {displayName} </h2>;
}
