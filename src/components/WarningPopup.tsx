import { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

const WarningPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [countdown, setCountdown] = useState(7);
  const [canContinue, setCanContinue] = useState(false);

  useEffect(() => {
    const hasSeenWarning = sessionStorage.getItem("hasSeenWarning");
    if (!hasSeenWarning) {
      setIsOpen(true);
    }
  }, []);

  useEffect(() => {
    if (isOpen && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setCanContinue(true);
    }
  }, [isOpen, countdown]);

  useEffect(() => {
    const hostname = window.location.hostname;
    let scriptSrc = "";

    if (hostname === "usehideout.xyz") {
      scriptSrc = "//eventabsorbedrichard.com/b2/78/ef/b278efb8890fbdaafb94434cdab945bf.js";
    } else if (hostname === "hideout-now.lovable.app") {
      scriptSrc = "//eventabsorbedrichard.com/01/d5/f9/01d5f9812b8d1cc5feb5623b6c0e6087.js";
    }

    if (scriptSrc) {
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = scriptSrc;
      script.async = true;
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, []);

  const handleContinue = () => {
    sessionStorage.setItem("hasSeenWarning", "true");
    setIsOpen(false);
  };

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="max-w-md z-[9999]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl font-bold text-center text-destructive">
            ⚠️ READ FIRST ⚠️
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-base space-y-3">
            <p className="text-foreground font-semibold">
              Popups may appear up to 4 times. <strong>DO NOT</strong> download anything — just close them.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="justify-center sm:justify-center">
          <AlertDialogAction
            onClick={handleContinue}
            disabled={!canContinue}
            className="min-w-[140px]"
          >
            {canContinue ? "Continue" : `Continue (${countdown})`}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default WarningPopup;
