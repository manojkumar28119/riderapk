import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

/* -------------------- Component -------------------- */

interface NotificationSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}


/* -------------------- Utils -------------------- */

const formatDate = (date: Date) =>
  date.toLocaleDateString("en-GB"); // DD/MM/YY

const getRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();

  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);

  if (diffSec < 60) return `${diffSec}s ago`;
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;

  if (diffHr >= 24) return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getGroupLabel = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();

  const isToday = date.toDateString() === now.toDateString();

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    date.toDateString() === yesterday.toDateString();

  if (isToday) return "Today";
  if (isYesterday) return "Yesterday";
  return formatDate(date);
};


export const NotificationSheet = ({
  open,
  onOpenChange,
}: NotificationSheetProps) => {

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex flex-col w-[100%] sm:w-[60%] md:w-[45%] lg:w-[30%]">
        <SheetHeader>
          <SheetTitle className="pb-2">Notifications</SheetTitle>
        </SheetHeader>

        <hr className="border-blue-200" />

        <div className="px-3 py-4 overflow-y-auto">
          Notification list
        </div>
      </SheetContent>
    </Sheet>
  );
};