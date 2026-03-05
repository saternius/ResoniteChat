import { cn } from "@/lib/utils/format";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  children: React.ReactNode;
}

export function Card({ hover, className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "glass rounded-xl p-4",
        hover && "glass-hover cursor-pointer transition-all duration-300",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
