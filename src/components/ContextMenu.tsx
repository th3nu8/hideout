import { useEffect, useState } from "react";
import { LogOut, Trash2, Save, Code } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  isOnBrowser?: boolean;
}

export const ContextMenu = ({ x, y, onClose, isOnBrowser }: ContextMenuProps) => {
  const navigate = useNavigate();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('hideout_user') || sessionStorage.getItem('hideout_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    }
  }, []);

  const handleOpenInAboutBlank = () => {
    const currentUrl = window.location.href;
    const aboutBlankWindow = window.open('about:blank', '_blank');
    if (aboutBlankWindow) {
      aboutBlankWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Hideout</title>
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              html, body { width: 100%; height: 100%; overflow: hidden; }
              iframe { width: 100%; height: 100%; border: none; }
            </style>
          </head>
          <body>
            <iframe src="${currentUrl}"></iframe>
          </body>
        </html>
      `);
      aboutBlankWindow.document.close();
    }
    onClose();
  };

  const handleDeleteCookies = () => {
    document.cookie.split(";").forEach((c) => {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    toast.success("Cookies deleted");
    onClose();
  };

  const handleDeleteLocalStorage = () => {
    const confirmDelete = window.confirm("This will delete all local storage data. Are you sure?");
    if (confirmDelete) {
      localStorage.clear();
      toast.success("Local storage cleared");
      onClose();
    }
  };

  const handleSaveToAccount = async () => {
    if (!user) {
      toast.error("Please login to save data to your account");
      return;
    }
    
    try {
      // Import and use the saveToAccount function
      const { useUserData } = await import("@/hooks/use-user-data");
      const { saveToAccount } = useUserData();
      await saveToAccount();
      toast.success("All data saved to account");
    } catch (error) {
      console.error('Error saving to account:', error);
      toast.error("Failed to save data to account");
    }
    onClose();
  };

  const handleLogout = () => {
    if (!user) return;
    setShowLogoutDialog(true);
  };

  const confirmLogout = async () => {
    try {
      // Import the setLoggingOut function
      const { setLoggingOut } = await import('@/hooks/use-user-data');
      
      // Helper functions to get all data
      const getAllLocalStorage = (): Record<string, any> => {
        const allData: Record<string, any> = {};
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && !key.includes('hideout_user')) {
            try {
              const value = localStorage.getItem(key);
              if (value) allData[key] = JSON.parse(value);
            } catch (error) {
              const value = localStorage.getItem(key);
              if (value) allData[key] = value;
            }
          }
        }
        return allData;
      };

      const getAllCookies = (): Record<string, string> => {
        const cookies: Record<string, string> = {};
        const cookieString = document.cookie;
        if (cookieString) {
          cookieString.split(';').forEach(cookie => {
            const [name, ...rest] = cookie.split('=');
            cookies[name.trim()] = rest.join('=').trim();
          });
        }
        return cookies;
      };

      // Save to account before clearing
      const localStorageData = getAllLocalStorage();
      const cookiesData = getAllCookies();
      
      const { supabase } = await import('@/integrations/supabase/client');
      await (supabase as any).from('user_data').upsert({
        user_id: user.id,
        local_storage: localStorageData,
        cookies: cookiesData
      }, { onConflict: 'user_id' });

      // Set flag to prevent auto-save during clear
      setLoggingOut(true);
      
      // Small delay to ensure save completes
      await new Promise(resolve => setTimeout(resolve, 100));

      // Clear ALL data
      const keysToRemove = Object.keys(localStorage).filter(key => !key.includes('hideout_user'));
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      Object.keys(cookiesData).forEach(name => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      });

      localStorage.removeItem('hideout_user');
      sessionStorage.removeItem('hideout_user');
      
      toast.success("Logged out successfully - data saved to account");
      setShowLogoutDialog(false);
      onClose();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error("Logout failed");
    }
  };

  const handleInspect = () => {
    // Dispatch event to open DevTools
    window.dispatchEvent(new CustomEvent('hideout:toggle-devtools'));
    onClose();
  };

  return (
    <>
      <div
        className="fixed inset-0 z-[9998]"
        onClick={onClose}
      />
      <div
        className="fixed z-[9999] bg-card border border-border rounded-lg shadow-2xl py-1 min-w-[220px] backdrop-blur-xl"
        style={{ top: y, left: x }}
      >
        <button
          onClick={handleOpenInAboutBlank}
          className="w-full px-4 py-2.5 text-left text-sm hover:bg-muted/50 flex items-center gap-3 transition-colors"
        >
          <Code className="w-4 h-4" />
          Open in about:blank
        </button>

        <div className="my-1 border-t border-border" />

        <button
          onClick={handleSaveToAccount}
          disabled={!user}
          className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 transition-colors ${
            user ? 'hover:bg-muted/50' : 'opacity-50 cursor-not-allowed'
          }`}
        >
          <Save className="w-4 h-4" />
          Save to account
        </button>

        {isOnBrowser && (
          <>
            <div className="my-1 border-t border-border" />
            <button
              onClick={handleInspect}
              className="w-full px-4 py-2.5 text-left text-sm hover:bg-muted/50 flex items-center gap-3 transition-colors"
            >
              <Code className="w-4 h-4" />
              Inspect
            </button>
          </>
        )}

        <div className="my-1 border-t border-border" />

        <button
          onClick={handleLogout}
          disabled={!user}
          className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 transition-colors ${
            user ? 'hover:bg-destructive/10 hover:text-destructive' : 'opacity-50 cursor-not-allowed'
          }`}
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>

      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to logout? This action could be accidental.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmLogout}>Logout</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
