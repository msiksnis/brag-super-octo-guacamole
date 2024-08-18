import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "./ui/button";
import { LoaderCircle } from "lucide-react";

interface LoadingButtonProps extends ButtonProps {
  loading: boolean;
}

export default function LoadingButton({
  loading,
  disabled,
  className,
  ...props
}: LoadingButtonProps) {
  return (
    <Button
      {...props}
      disabled={disabled || loading}
      className={cn("group relative", className)}
    >
      <span className="flex items-center gap-2 z-10">
        {loading && <LoaderCircle className="size-5 animate-spin" />}
        {props.children}
      </span>
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-200 via-accent to-yellow-200"></div>
      <div className="hover-target absolute inset-0 bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-300 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
    </Button>
  );
}
