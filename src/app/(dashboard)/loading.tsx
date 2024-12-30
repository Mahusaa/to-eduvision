import LogoSVG from "public/Logo";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-white">
      {/* Centered Container */}
      <div className="text-center animate-pulse">
        {/* Logo */}
        <LogoSVG className="text-primary w-60 h-60 mx-auto " />
        {/* Name below the logo */}
        <div className="mt-4 text-5xl font-bold text-primary">
          LOADING ...
        </div>
      </div>
    </div>
  );
}

