interface SessionPanelProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function SessionPanel({ title, subtitle, children }: SessionPanelProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col h-[calc(100vh-12rem)]">
      <div className="p-4 border-b bg-primary/5 sticky top-0 z-10">
        <h2 className="text-lg font-semibold text-primary">{title}</h2>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        )}
      </div>
      <div className="p-4 overflow-auto flex-1">
        {children}
      </div>
    </div>
  );
}