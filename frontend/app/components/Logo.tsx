import Image from 'next/image';
import Link from 'next/link';

type LogoProps = {
    variant?: 'full' | 'icon';
    theme?: 'light' | 'dark';
    size?: 'sm' | 'md' | 'lg';
    href?: string;
    className?: string;
};

export default function Logo({
    variant = 'full',
    theme = 'light',
    size = 'md',
    href = '/',
    className = ''
}: LogoProps) {
    const sizes = {
        sm: { full: { width: 100, height: 30 }, icon: { width: 32, height: 32 } },
        md: { full: { width: 120, height: 35 }, icon: { width: 40, height: 40 } },
        lg: { full: { width: 140, height: 40 }, icon: { width: 48, height: 48 } }
    };

    const dimensions = sizes[size][variant];

    // For the full logo, we'll use CSS to handle the text color based on theme
    const logoContent = variant === 'icon' ? (
        <Image
            src="/bodi-icon.png"
            alt="BODI"
            width={dimensions.width}
            height={dimensions.height}
            style={{ objectFit: 'contain' }}
        />
    ) : (
        <div className={`logo-full ${theme === 'dark' ? 'logo-dark' : 'logo-light'}`}>
            <Image
                src="/bodi-icon.png"
                alt="BODI"
                width={dimensions.height}
                height={dimensions.height}
                style={{ objectFit: 'contain' }}
            />
            <div className="logo-text-wrapper">
                <span className="logo-text-main">BODI</span>
                <span className="logo-text-sub">Real Estate Platform</span>
            </div>
        </div>
    );

    if (href) {
        return (
            <Link href={href} className={`logo-link ${className}`}>
                {logoContent}
            </Link>
        );
    }

    return <div className={className}>{logoContent}</div>;
}
