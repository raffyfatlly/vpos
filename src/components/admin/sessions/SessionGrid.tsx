interface SessionGridProps {
  children: React.ReactNode;
}

export function SessionGrid({ children }: SessionGridProps) {
  return (
    <div className="flex flex-col gap-4 md:gap-6 min-h-0 w-full max-w-full overflow-hidden">
      {children}
    </div>
  );
}