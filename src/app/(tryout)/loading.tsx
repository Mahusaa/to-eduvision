import LogoSVG from "public/Logo";
export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white relative">
      {/* Animation Container */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="opacity-0 animate-fade-in-out">
          {/* Logo */}
          <LogoSVG className="text-primary w-20 h-20" />
          {/* Name below the logo */}
          <div className="mt-4 text-2xl font-bold text-primary">
            EDUVISION
          </div>
        </div>
      </div>
    </div>
  );
}

