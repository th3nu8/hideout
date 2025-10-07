import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { toast } from "sonner";
import { GlobalChat } from "@/components/GlobalChat";

const EmailSettings = () => {
  const [newslettersEnabled, setNewslettersEnabled] = useState(() => {
    const saved = localStorage.getItem('hideout_email_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.newsletters !== undefined ? parsed.newsletters : true;
      } catch {
        return true;
      }
    }
    return true;
  });

  const handleSave = () => {
    const settings = {
      newsletters: newslettersEnabled
    };
    localStorage.setItem('hideout_email_settings', JSON.stringify(settings));
    toast.success("Email settings saved successfully");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <GlobalChat />
      <main className="pt-24 px-4 sm:px-6 pb-12 max-w-2xl mx-auto">
        <Card className="p-8 border-border/50 backdrop-blur-sm bg-card/80">
          <div className="flex items-center gap-3 mb-6">
            <Mail className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Email Settings</h1>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="newsletters" className="text-base font-semibold">
                  Newsletters
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receive updates, news, and special offers from Hideout
                </p>
              </div>
              <Switch
                id="newsletters"
                checked={newslettersEnabled}
                onCheckedChange={setNewslettersEnabled}
              />
            </div>

            <Button onClick={handleSave} className="w-full">
              Save Settings
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default EmailSettings;
