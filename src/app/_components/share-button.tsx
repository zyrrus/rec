"use client";

import { Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "~/app/_components/ui/button";

export const ShareButton = () => {
  const handleShare = async () => {
    await navigator.clipboard.writeText(window.location.href);
    toast.success("Copied profile URL to clipboard.");
  };

  return (
    <Button variant="outline" size="icon" onClick={handleShare}>
      <Share2 className="h-4 w-4" />
    </Button>
  );
};
