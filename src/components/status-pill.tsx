import { cn } from "@/lib/utils"

export function StatusPill({
  className,
  children,
  dot = true,
}: {
  className?: string
  children: React.ReactNode
  dot?: boolean
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium shadow-[0_1px_2px_rgb(0_0_0/0.08),0_0_0_1px_rgb(255_255_255/0.03)_inset]",
        className
      )}
    >
      {dot ? (
        <span
          aria-hidden="true"
          className="size-1.5 shrink-0 rounded-full bg-current opacity-80"
        />
      ) : null}
      {children}
    </span>
  )
}