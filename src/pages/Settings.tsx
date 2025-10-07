import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { GlobalChat } from "@/components/GlobalChat";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Settings as SettingsIcon, Bell, Palette, Database, Trash2, Mail } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type SettingsData = {
  reducedMotion: boolean;
  fontSize: 'small' | 'medium' | 'large';
  highContrast: boolean;
  notificationsEnabled: boolean;
  generalNotifications: boolean;
};

const Settings = () => {
  const location = useLocation();
  const fromBrowser = (location.state as { fromBrowser?: boolean })?.fromBrowser;
  const [user, setUser] = useState<any>(null);
  const [settings, setSettings] = useState<SettingsData>({
    reducedMotion: false,
    fontSize: 'medium',
    highContrast: false,
    notificationsEnabled: false,
    generalNotifications: true,
  });

  useEffect(() => {
    // Load user
    const storedUser = localStorage.getItem('hideout_user') || sessionStorage.getItem('hideout_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Load settings from localStorage
    const savedSettings = localStorage.getItem('hideout_settings');
    if (savedSettings) {
      const loadedSettings = JSON.parse(savedSettings);
      setSettings(loadedSettings);
      applySettings(loadedSettings);
    }

    // Check notification permission
    if ('Notification' in window) {
      setSettings(prev => ({
        ...prev,
        notificationsEnabled: Notification.permission === 'granted'
      }));
    }
  }, []);

  const applySettings = (newSettings: SettingsData) => {
    // Apply font size
    const root = document.documentElement;
    if (newSettings.fontSize === 'small') {
      root.style.fontSize = '14px';
    } else if (newSettings.fontSize === 'large') {
      root.style.fontSize = '18px';
    } else {
      root.style.fontSize = '16px';
    }

    // Apply reduced motion
    if (newSettings.reducedMotion) {
      root.style.setProperty('--transition-smooth', 'none');
    } else {
      root.style.setProperty('--transition-smooth', 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)');
    }

    // Apply high contrast
    if (newSettings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
  };

  const saveSettings = async (newSettings: SettingsData) => {
    setSettings(newSettings);
    applySettings(newSettings);
    
    // Save to localStorage
    localStorage.setItem('hideout_settings', JSON.stringify(newSettings));
    
    // Note: Settings are saved to localStorage only
    // Future: Could add settings column to users table if needed
  };

  const handleSettingChange = (key: keyof SettingsData, value: any) => {
    const newSettings = { ...settings, [key]: value };
    saveSettings(newSettings);
    toast.success("Setting updated", { duration: 5000 });
  };

  const handleRequestNotifications = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setSettings(prev => ({ ...prev, notificationsEnabled: true }));
        toast.success("Notifications enabled!", { duration: 5000 });
      } else {
        toast.error("Notification permission denied", { duration: 5000 });
      }
    }
  };

  const handleClearLocalStorage = () => {
    const storedUser = localStorage.getItem('hideout_user') || sessionStorage.getItem('hideout_user');
    
    localStorage.clear();
    
    if (storedUser) {
      toast.info("Local storage cleared - you have been logged out", { duration: 5000 });
      window.location.href = '/';
    } else {
      toast.success("Local storage cleared successfully!", { duration: 5000 });
    }
  };

  const handleClearCookies = () => {
    const storedUser = localStorage.getItem('hideout_user') || sessionStorage.getItem('hideout_user');
    
    // Clear session storage
    sessionStorage.clear();
    
    // Clear cookies (if any)
    document.cookie.split(";").forEach((c) => {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    
    if (storedUser) {
      toast.info("Cookies cleared - you have been logged out", { duration: 5000 });
      window.location.href = '/';
    } else {
      toast.success("Cookies cleared successfully!", { duration: 5000 });
    }
  };

  const handleResetDefaults = () => {
    const defaultSettings: SettingsData = {
      reducedMotion: false,
      fontSize: 'medium',
      highContrast: false,
      notificationsEnabled: settings.notificationsEnabled,
      generalNotifications: true,
    };
    saveSettings(defaultSettings);
    toast.success("Settings reset to defaults", { duration: 5000 });
  };

  const handleClearCache = () => {
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => caches.delete(name));
      });
    }
    toast.success("Cache cleared successfully!", { duration: 5000 });
  };

  const handleSaveChanges = () => {
    toast.success("All settings saved successfully!", { duration: 5000 });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <GlobalChat />

      <main className="pt-24 px-4 sm:px-6 pb-12 max-w-4xl mx-auto">
        {fromBrowser && (
          <div className="mb-8 p-8 bg-card border border-border rounded-lg text-center animate-fade-in">
            <h2 className="text-2xl font-bold mb-2">🚧 Under Construction</h2>
            <p className="text-muted-foreground">Browser-specific settings are coming soon!</p>
          </div>
        )}
        
        {/* Header */}
        <div className="space-y-6 mb-12 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <SettingsIcon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Settings</h1>
              <p className="text-muted-foreground text-sm sm:text-base">Manage your preferences and account</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Appearance Settings */}
          <Card className="p-4 sm:p-6 bg-card border-border">
            <div className="flex items-center gap-3 mb-4">
              <Palette className="w-5 h-5 text-primary" />
              <h2 className="text-lg sm:text-xl font-semibold">Appearance</h2>
            </div>
            <Separator className="mb-4" />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Reduced Motion</Label>
                  <p className="text-sm text-muted-foreground">Minimize animations</p>
                </div>
                <Switch 
                  checked={settings.reducedMotion} 
                  onCheckedChange={(v) => handleSettingChange('reducedMotion', v)} 
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>High Contrast</Label>
                  <p className="text-sm text-muted-foreground">Increase color contrast</p>
                </div>
                <Switch 
                  checked={settings.highContrast} 
                  onCheckedChange={(v) => handleSettingChange('highContrast', v)} 
                />
              </div>
              <div className="space-y-2">
                <Label>Font Size</Label>
                <div className="flex gap-2">
                  {(['small', 'medium', 'large'] as const).map((size) => (
                    <Button
                      key={size}
                      variant={settings.fontSize === size ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleSettingChange('fontSize', size)}
                      className="capitalize"
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Data Settings */}
          <Card className="p-4 sm:p-6 bg-card border-border">
            <div className="flex items-center gap-3 mb-4">
              <Database className="w-5 h-5 text-primary" />
              <h2 className="text-lg sm:text-xl font-semibold">Data & Storage</h2>
            </div>
            <Separator className="mb-4" />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Cache</Label>
                  <p className="text-sm text-muted-foreground">Clear cached data</p>
                </div>
                <Button variant="outline" size="sm" onClick={handleClearCache} className="gap-2">
                  <Trash2 className="w-4 h-4" />
                  Clear Cache
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Local Storage</Label>
                  <p className="text-sm text-muted-foreground">This will log you out</p>
                </div>
                <Button variant="outline" size="sm" onClick={handleClearLocalStorage} className="gap-2">
                  <Trash2 className="w-4 h-4" />
                  Clear Storage
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Cookies</Label>
                  <p className="text-sm text-muted-foreground">This will log you out</p>
                </div>
                <Button variant="outline" size="sm" onClick={handleClearCookies} className="gap-2">
                  <Trash2 className="w-4 h-4" />
                  Clear Cookies
                </Button>
              </div>
            </div>
          </Card>

          {/* Notification Settings */}
          <Card className="p-4 sm:p-6 bg-card border-border">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="w-5 h-5 text-primary" />
              <h2 className="text-lg sm:text-xl font-semibold">Notifications</h2>
            </div>
            <Separator className="mb-4" />
            {!settings.notificationsEnabled ? (
              <div className="text-center py-6 space-y-4">
                <p className="text-muted-foreground">Enable notifications to receive updates</p>
                <Button onClick={handleRequestNotifications} className="gap-2">
                  <Bell className="w-4 h-4" />
                  Allow Notifications
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive general notifications</p>
                  </div>
                  <Switch 
                    checked={settings.generalNotifications} 
                    onCheckedChange={(v) => handleSettingChange('generalNotifications', v)} 
                  />
                </div>
              </div>
            )}
          </Card>

          {/* Email Settings Link */}
          <Link to="/email-settings">
            <Card className="p-4 sm:p-6 bg-card border-border hover:border-primary/50 transition-colors cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <div>
                    <h2 className="text-lg sm:text-xl font-semibold">Email Settings</h2>
                    <p className="text-sm text-muted-foreground">Manage newsletter and email preferences</p>
                  </div>
                </div>
              </div>
            </Card>
          </Link>

          {/* Save Button */}
          <div className="flex flex-col sm:flex-row justify-end gap-3">
            <Button variant="outline" onClick={handleResetDefaults}>Reset to Defaults</Button>
            <Button onClick={handleSaveChanges}>Save Changes</Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
