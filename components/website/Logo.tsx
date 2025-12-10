import Image from "next/image";

export default function Logo({ className = "", isScrolled = false }: { className?: string; isScrolled?: boolean }) {
  return (
    <div className={`flex items-center group ${className}`}>
      <Image
        src={isScrolled ? "/logo.png" : "/white-logo.png"}
        alt="LCCI Global Qualifications"
        width={60}
        height={40}
        className="object-contain"
        priority
      />
    </div>
  );
}
