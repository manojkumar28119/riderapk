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