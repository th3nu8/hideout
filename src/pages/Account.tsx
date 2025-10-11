import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { GlobalChat } from "@/components/GlobalChat";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Eye, EyeOff, LogOut, Trash2, Key, User } from "lucide-react";
import { ChangePasswordDialog } from "@/components/ChangePasswordDialog";
import { ChangeUsernameDialog } from "@/components/ChangeUsernameDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Account = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showChangePasswordDialog, setShowChangePasswordDialog] = useState(false);
  const [showChangeUsernameDialog, setShowChangeUsernameDialog] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('hideout_user') || sessionStorage.getItem('hideout_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate('/auth');
    }
  }, [navigate]);

  const handleLogout = async () => {
    if (!user) return;

    try {
      // Just clear local/session storage - user still exists in DB
      localStorage.removeItem('hideout_user');
      sessionStorage.removeItem('hideout_user');
      
      toast({
        title: "Logged Out",
        description: "Make sure you remember your credentials!",
      });
      
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Error",
        description: "Failed to logout properly",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    try {
      // Try Edge Function first
      const { data, error } = await supabase.functions.invoke('delete-account', {
        body: { userId: user.id, password: user.username }
      });

      if (error || (data && (data as any).error)) {
        throw new Error((data as any)?.error || error?.message || 'edge-fn-failed');
      }

      // Success via function
      localStorage.clear();
      sessionStorage.clear();
      toast({ title: 'Account Deleted', description: 'Your account and all data have been permanently deleted' });
      navigate('/');
      return;
    } catch (_edgeErr) {
      // Fallback: delete directly with anon key (no SQL editor required)
      try {
        await (supabase as any).from('favorites').delete().eq('user_id', user.id);
        await (supabase as any).from('global_chat').delete().eq('user_id', user.id);
        await (supabase as any).from('browser_data').delete().eq('user_id', user.id);
        await (supabase as any).from('users').delete().eq('id', user.id);

        localStorage.clear();
        sessionStorage.clear();
        toast({ title: 'Account Deleted', description: 'Your account and all data have been permanently deleted' });
        navigate('/');
        return;
      } catch (error: any) {
        console.error('Delete account error:', error);
        toast({
          title: 'Error',
          description: error?.message || 'Failed to delete account',
          variant: 'destructive',
        });
      }
    }
  };
  const handleUsernameChangeSuccess = (newUsername: string) => {
    setUser({ ...user, username: newUsername });
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <GlobalChat />
      <main className="pt-24 px-4 sm:px-6 pb-12 max-w-2xl mx-auto">
        <Card className="p-8 bg-card border-border">
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-foreground mb-2">My Account</h1>
              <p className="text-muted-foreground">Manage your Hideout Network account</p>
            </div>

            <div className="space-y-6">
              <div className="p-4 bg-background rounded-lg border border-border">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Username</h3>
                <p className="text-xl font-bold text-foreground">{user.username}</p>
              </div>

              <div className="p-4 bg-background rounded-lg border border-border">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-medium text-muted-foreground">Password</h3>
                </div>
                <p className="text-xl font-mono text-foreground">
                  ••••••••••••••••
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Password is securely encrypted. Use "Change Password" to update.
                </p>
              </div>

              <div className="pt-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={() => setShowChangePasswordDialog(true)}
                  >
                    <Key className="w-4 h-4" />
                    Change Password
                  </Button>
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={() => setShowChangeUsernameDialog(true)}
                  >
                    <User className="w-4 h-4" />
                    Change Username
                  </Button>
                </div>

                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() => setShowLogoutDialog(true)}
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>

                <Button
                  variant="destructive"
                  className="w-full gap-2"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Account
                </Button>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Note:</strong> Accounts inactive for 2 weeks are automatically deleted to save storage space.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Logout Dialog */}
        <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
          <AlertDialogContent className="bg-card border-border">
            <AlertDialogHeader>
              <AlertDialogTitle>Logout</AlertDialogTitle>
              <AlertDialogDescription>
                Make sure you remember your username and password before logging out.
                You will need them to log back in.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleLogout}>Logout</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Delete Account Dialog */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent className="bg-card border-border">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Account</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your account,
                all your game data, and favorites. Are you absolutely sure?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteAccount}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete Account
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Change Password Dialog */}
        <ChangePasswordDialog
          open={showChangePasswordDialog}
          onOpenChange={setShowChangePasswordDialog}
          userId={user?.id}
          username={user?.username}
        />

        {/* Change Username Dialog */}
        <ChangeUsernameDialog
          open={showChangeUsernameDialog}
          onOpenChange={setShowChangeUsernameDialog}
          userId={user?.id}
          currentUsername={user?.username}
          onSuccess={handleUsernameChangeSuccess}
        />
      </main>
    </div>
  );
};

export default Account;