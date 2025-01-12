import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import Cookies from "js-cookie";

import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/AppContext";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate({
    from: "/dashboard",
  });
  const { isLoggedIn, setIsLoggedIn } = useAppContext();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function handleLogout() {
    Cookies.remove("loggedIn");
    setIsLoggedIn(false);
    navigate({
      to: "/",
      replace: true,
    });
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${scrolled ? "py-2" : "py-4"}`}
    >
      <div className="container mx-auto px-4">
        <div
          className={`bg-background/70 backdrop-blur-md rounded-2xl shadow-lg border border-border transition-all duration-300 ${scrolled ? "py-2" : "py-3"}`}
        >
          <div className="flex items-center justify-between px-4 sm:px-6">
            <div className="flex items-center space-x-4">
              <div className="bg-yellow-100 p-2 rounded-xl">
                <img src="/images/logo.png" alt="Logo" className="h-8 w-8" />
              </div>
              <span className="text-xl font-semibold tracking-tight bg-gradient-to-r from-yellow-400 to-yellow-600 text-transparent bg-clip-text">
                KRN Construction
              </span>
            </div>
            {isLoggedIn && (
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-yellow-500 transition-colors duration-200"
                  onClick={handleLogout}
                >
                  <LogOut className="size-5 sm:mr-px" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
