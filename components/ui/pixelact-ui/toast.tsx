import { toast as sonnerToast } from "sonner";
import { Button } from "@/components/ui/pixelact-ui/button";
import "@/components/ui/pixelact-ui/styles/styles.css";

export function toast(message: string) {
  return sonnerToast.custom(() => <Toast title={message} />);
}

/** Paired with Pixelact `Toaster`; long-lived until dismissed or action runs. */
export function toastRestartPrompt(onRestart: () => void) {
  return sonnerToast.custom(
    (id) => (
      <div className="box-shadow-margin flex w-full flex-col gap-3 bg-background p-4 shadow-(--pixel-box-shadow) md:max-w-[364px]">
        <p className="pixel-font text-center text-sm text-foreground">
          Oops! Let&apos;s restart the game.
        </p>
        <Button
          type="button"
          variant="default"
          className="w-full"
          onClick={() => {
            sonnerToast.dismiss(id);
            onRestart();
          }}
        >
          Restart
        </Button>
      </div>
    ),
    { duration: Infinity }
  );
}

interface ToastProps {
  title: string;
}

function Toast(props: ToastProps) {
  const { title } = props;

  return (
    <div className="box-shadow-margin flex w-full items-center bg-background p-4 shadow-(--pixel-box-shadow) md:max-w-[364px]">
      <p className="pixel-font text-sm text-foreground">{title}</p>
    </div>
  );
}

export { Toast };
