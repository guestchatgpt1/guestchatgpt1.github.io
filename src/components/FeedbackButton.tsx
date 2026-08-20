import { useState } from "react";
import { MessageSquareHeart } from "lucide-react";
import FeedbackDialog from "@/components/FeedbackDialog";

/** Floating feedback launcher pinned to the bottom-left corner. */
const FeedbackButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Share your feedback"
        className="fixed bottom-6 left-6 z-50 flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-medium text-primary-foreground shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_hsl(var(--glow-primary)/0.4)] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <MessageSquareHeart size={18} aria-hidden="true" />
        <span className="hidden sm:inline">Feedback</span>
      </button>

      <FeedbackDialog open={open} onOpenChange={setOpen} />
    </>
  );
};

export default FeedbackButton;
