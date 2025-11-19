import Image from "next/image";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center group ${className}`}>
      <Image
        src="/logo.png"
        alt="LCCI Global Qualifications"
        width={60}
        height={40}
        className="object-contain"
        priority
      />
    </div>
  );
}
