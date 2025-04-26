import { useEffect } from "react";
import { useAppStore } from "@/lib/store";
import Header from "./Header";
import BetSlip from "./BetSlip";
import { ToastProvider } from "@/components/ui/toast";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { isDarkMode } = useAppStore();
  
  useEffect(() => {
    // Set initial theme based on store
    if (!isDarkMode) {
      document.documentElement.classList.add("light");
    }
  }, []);
  
  return (
    <ToastProvider>
      <div className="min-h-screen flex flex-col bg-gradient-to-bl from-background to-zinc-900/80">
        <Header />
        <div className="pt-20">{children}</div>
        <BetSlip />
      </div>
    </ToastProvider>
  );
};

export default Layout;