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
import { Bug } from "lucide-react";

export const ReportBugDialog = () => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pageSection, setPageSection] = useState("");

  const handleSubmit = () => {
    const subject = `Bug Report: ${title}`;
    const body = `Bug Title: ${title}\n\nDescription:\n${description}\n\nPage/Section: ${pageSection || "Not specified"}`;
    const mailto = `mailto:hideout-network-buisness@hotmail.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    setOpen(false);
    setTitle("");
    setDescription("");
    setPageSection("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Bug className="w-4 h-4" />
          Report Bug
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Report a Bug</DialogTitle>
          <DialogDescription>
            Help us improve Hideout by reporting any issues you encounter.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="bug-title">Bug Title *</Label>
            <Input
              id="bug-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Brief description of the bug"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bug-description">Description *</Label>
            <Textarea
              id="bug-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description of the bug and steps to reproduce"
              rows={5}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="page-section">Page/Section (Optional)</Label>
            <Input
              id="page-section"
              value={pageSection}
              onChange={(e) => setPageSection(e.target.value)}
              placeholder="e.g., Games page, Browser, Home"
            />
          </div>
        </div>
        <Button
          onClick={handleSubmit}
          disabled={!title || !description}
          className="w-full"
        >
          Submit Bug Report
        </Button>
      </DialogContent>
    </Dialog>
  );
};
