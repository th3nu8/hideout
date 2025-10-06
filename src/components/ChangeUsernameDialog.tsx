import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type ChangeUsernameDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  currentUsername: string;
  onSuccess: (newUsername: string) => void;
};

export const ChangeUsernameDialog = ({ open, onOpenChange, userId, currentUsername, onSuccess }: ChangeUsernameDialogProps) => {
  const [newUsername, setNewUsername] = useState("");
  const { toast } = useToast();

  const handleChangeUsername = async () => {
    if (newUsername.length < 3 || newUsername.length > 20) {
      toast({
        title: "Error",
        description: "Username must be between 3 and 20 characters",
        variant: "destructive",
      });
      return;
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(newUsername)) {
      toast({
        title: "Error",
        description: "Username can only contain letters, numbers, hyphens, and underscores",
        variant: "destructive",
      });
      return;
    }

    try {
      // Check if username is already taken
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', newUsername)
        .maybeSingle();

      if (existingUser) {
        toast({
          title: "Error",
          description: "Username is already taken",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update({ username: newUsername })
        .eq('id', userId);

      if (error) throw error;

      // Update local storage
      const storedUser = localStorage.getItem('hideout_user') || sessionStorage.getItem('hideout_user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        user.username = newUsername;
        if (localStorage.getItem('hideout_user')) {
          localStorage.setItem('hideout_user', JSON.stringify(user));
        } else {
          sessionStorage.setItem('hideout_user', JSON.stringify(user));
        }
      }

      toast({
        title: "Success",
        description: "Username updated successfully",
      });
      
      onSuccess(newUsername);
      setNewUsername("");
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update username",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle>Change Username</DialogTitle>
          <DialogDescription>
            Enter your new username. It must be 3-20 characters and contain only letters, numbers, hyphens, and underscores.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="current-username">Current Username</Label>
            <Input
              id="current-username"
              value={currentUsername}
              disabled
              className="opacity-50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-username">New Username</Label>
            <Input
              id="new-username"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="Enter new username"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleChangeUsername}>Change Username</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
