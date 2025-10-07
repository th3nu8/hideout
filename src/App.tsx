import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ContextMenu } from "@/components/ContextMenu";
import Index from "./pages/Index";
import Games from "./pages/Games";
import GamePlayer from "./pages/GamePlayer";
import Apps from "./pages/Apps";
import Help from "./pages/Help";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";
import Signup from "./pages/Signup";
import Account from "./pages/Account";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Browser from "./pages/Browser";
import EmailSettings from "./pages/EmailSettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; isOnBrowser: boolean } | null>(null);

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      const isOnBrowser = window.location.pathname === '/browser';
      setContextMenu({ x: e.clientX, y: e.clientY, isOnBrowser });
    };

    document.addEventListener('contextmenu', handleContextMenu);
    return () => document.removeEventListener('contextmenu', handleContextMenu);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {contextMenu && (
          <ContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            isOnBrowser={contextMenu.isOnBrowser}
            onClose={() => setContextMenu(null)}
          />
        )}
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/games" element={<Games />} />
            <Route path="/game" element={<GamePlayer />} />
            <Route path="/apps" element={<Apps />} />
            <Route path="/browser" element={<Browser />} />
            <Route path="/help" element={<Help />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/email-settings" element={<EmailSettings />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/account" element={<Account />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
