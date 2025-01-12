import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Toaster } from "sonner";

import { AppProvider } from "@/context/AppContext";
import { ProjectProvider } from "@/context/ProjectContext";
import { ThemeProvider } from "@/context/ThemeContext";
import Navbar from "@/components/navbar";

export const Route = createRootRoute({
  component: () => (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AppProvider>
        <ProjectProvider>
          <div className="h-screen relative">
            <Toaster
              richColors
              duration={1250}
              toastOptions={{ className: "font-spaceGrotesk" }}
            />
            <Navbar />
            <Outlet />
          </div>
        </ProjectProvider>
      </AppProvider>
    </ThemeProvider>
  ),
});
