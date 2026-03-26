import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast glass-panel group-[.toaster]:text-foreground group-[.toaster]:border-white/40 group-[.toaster]:shadow-xl dark:group-[.toaster]:border-white/10",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:bg-[image:var(--gradient-primary)] group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:glass-field group-[.toast]:text-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
