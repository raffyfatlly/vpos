interface SessionLayoutProps {
  children: React.ReactNode;
}

export function SessionLayout({ children }: SessionLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-[1600px] p-6">
        {children}
      </div>
    </div>
  );
}