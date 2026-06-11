export default function TechBackground({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative min-h-screen bg-page overflow-hidden ${className}`}>
      {/* Very subtle grid — barely visible */}
      <div className="absolute inset-0 tech-blueprint pointer-events-none opacity-80" aria-hidden="true" />

      <div className="relative z-10">{children}</div>
    </div>
  );
}
