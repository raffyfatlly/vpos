interface SessionGridProps {
  children: React.ReactNode;
}

export function SessionGrid({ children }: SessionGridProps) {
  return (
    <div className="flex flex-col gap-6 min-h-0">
      {children}
    </div>
  );
}