import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";

const categories = [
  "Action",
  "Adventure",
  "Arcade",
  "Classic",
  "Puzzle",
  "Racing",
  "Simulation",
  "Sports",
  "Strategy",
];

export const RequestGameDialog = () => {
  const [open, setOpen] = useState(false);
  const [gameName, setGameName] = useState("");
  const [category, setCategory] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");

  const handleSubmit = () => {
    const subject = "Game Request";
    const body = `Game Name: ${gameName}\nCategory: ${category}\nSource URL: ${sourceUrl || "Not provided"}`;
    const mailto = `mailto:hideout-network-buisness@hotmail.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    setOpen(false);
    setGameName("");
    setCategory("");
    setSourceUrl("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Request Game
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Request a Game</DialogTitle>
          <DialogDescription>
            Tell us what game you'd like to see added to Hideout.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="game-name">Game Name *</Label>
            <Input
              id="game-name"
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
              placeholder="Enter game name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="source-url">Source URL (Optional)</Label>
            <Input
              id="source-url"
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              placeholder="https://..."
              type="url"
            />
          </div>
        </div>
        <Button
          onClick={handleSubmit}
          disabled={!gameName || !category}
          className="w-full"
        >
          Submit Request
        </Button>
      </DialogContent>
    </Dialog>
  );
};
