import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  href?: string;
}

const sizeMap = {
  sm: 24,
  md: 32,
  lg: 40,
};

export function Logo({ showText = true, size = 'md', className = '', href = '/' }: LogoProps) {
  const logoSize = sizeMap[size];
  
  const logoContent = (
    <div className={`flex items-center gap-2 ${className}`}>
      <Image
        src="/logo.svg"
        alt="Oumi RL Studio Logo"
        width={logoSize}
        height={logoSize}
        className="flex-shrink-0"
        priority
      />
      {showText && (
        <span className={`font-bold text-white ${size === 'lg' ? 'text-2xl' : size === 'sm' ? 'text-lg' : 'text-xl'}`}>
          Oumi RL Studio
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="flex items-center">
        {logoContent}
      </Link>
    );
  }

  return logoContent;
}

