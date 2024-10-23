import { cn } from "../utils/cn";

export default function Button({
  children,
  onClick,
  className,
  disabled = false,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        `${className}`,
        "rounded-lg border-2 border-sky-200 bg-[#bf81e9] px-4 py-2",
        "hover:bg-[#b86cff]",
        "disabled:cursor-not-allowed disabled:bg-gray-300",
      )}
    >
      {children}
    </button>
  );
}
