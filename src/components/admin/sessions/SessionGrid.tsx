interface SessionGridProps {
  children: React.ReactNode;
}

export function SessionGrid({ children }: SessionGridProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0 flex-1">
      {children}
    </div>
  );
}