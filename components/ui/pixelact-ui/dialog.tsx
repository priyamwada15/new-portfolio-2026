import * as React from "react";
import { cn } from "@/lib/utils";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  Dialog as ShadcnDialog,
  DialogContent as ShadcnDialogContent,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogTitle as ShadcnDialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import "@/components/ui/pixelact-ui/styles/styles.css";
import "@/components/ui/pixelact-ui/pixel-dialog-exit.css";
export interface PixelDialogContentProps
  extends React.ComponentProps<typeof ShadcnDialogContent> {
  trigger?: React.ReactNode;
}

const Dialog = ({ ...props }: React.ComponentProps<typeof ShadcnDialog>) => {
  return <ShadcnDialog {...props} />;
};

const DialogTitle = React.forwardRef<
  React.ComponentRef<typeof ShadcnDialogTitle>,
  React.ComponentPropsWithoutRef<typeof ShadcnDialogTitle>
>(({ className, ...props }, ref) => {
  return (
    <ShadcnDialogTitle
      className={cn("pixel-font text-neutral-100", className)}
      ref={ref}
      {...props}
    />
  );
});

const DialogContent = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogPrimitive.Overlay
      className={cn(
        "pixel-dialog-overlay fixed inset-0 z-50 bg-black/70 supports-backdrop-filter:backdrop-blur-none data-open:animate-in data-open:fade-in-0 data-open:duration-200"
      )}
    />
    <DialogPrimitive.Content
      ref={ref}
      data-slot="pixel-dialog-content"
      className={cn(
        "pixel-dialog-content fixed left-[50%] top-[50%] z-[51] grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 rounded-none border-0 p-6 text-neutral-300 ring-0 outline-none pixel-font box-shadow-margin data-open:animate-in data-open:fade-in-0 data-open:duration-200",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-none text-neutral-300 opacity-90 transition-opacity hover:opacity-100 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:pointer-events-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          className="cursor-pointer"
          aria-hidden="true"
        >
          <path
            className="fill-current"
            d="M5 5h2v2H5zm4 4H7V7h2zm2 2H9V9h2zm2 0h-2v2H9v2H7v2H5v2h2v-2h2v-2h2v-2h2v2h2v2h2v2h2v-2h-2v-2h-2v-2h-2zm2-2v2h-2V9zm2-2v2h-2V7zm0 0V5h2v2z"
          />
        </svg>
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));

export {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
};
