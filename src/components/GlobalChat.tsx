import { useState } from "react";
import { MessageSquare, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export const GlobalChat = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 rounded-full w-14 h-14 shadow-lg z-50"
        size="icon"
      >
        <MessageSquare className="h-6 w-6" />
      </Button>

      {isOpen && (
        <div className="fixed bottom-20 left-4 w-96 max-w-[calc(100vw-2rem)] h-[300px] bg-background border border-border rounded-lg shadow-xl flex flex-col z-50">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h3 className="font-semibold">Global Chat</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 flex items-center justify-center p-6 text-center">
            <div className="space-y-4">
              <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground" />
              <div>
                <h4 className="font-semibold text-foreground mb-2">Chat is disabled</h4>
                <p className="text-sm text-muted-foreground">
                  Go to the GitHub for help.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
