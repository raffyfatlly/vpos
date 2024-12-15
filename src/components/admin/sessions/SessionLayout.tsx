interface SessionLayoutProps {
  children: React.ReactNode;
}

export function SessionLayout({ children }: SessionLayoutProps) {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <div className="container mx-auto max-w-[1600px] px-4 py-6 md:p-6">
        {children}
      </div>
    </div>
  );
}