interface SessionLayoutProps {
  children: React.ReactNode;
}

export function SessionLayout({ children }: SessionLayoutProps) {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="container mx-auto max-w-[1600px] p-6 h-full">
        {children}
      </div>
    </div>
  );
}