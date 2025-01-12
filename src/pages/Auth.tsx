import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import Cookies from "js-cookie";

import LoginForm from "@/components/login-form";

export default function AuthPage() {
  const navigate = useNavigate({
    from: "/",
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const isLoggedIn = Cookies.get("loggedIn");
    if (isLoggedIn === "true") {
      navigate({
        to: "/dashboard",
        replace: true,
      });
    } else {
      setMounted(true);
    }
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <LoginForm />
    </div>
  );
}
