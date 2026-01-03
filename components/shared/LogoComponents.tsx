interface TournamentLogoProps {
    logo: string | null | undefined;
    name?: string;
    className?: string;
}

/**
 * Renders a tournament logo from either an inline SVG string or an image URL.
 * Automatically detects the format and renders accordingly.
 */
export function TournamentLogo({ logo, name = "Tournament", className = "w-6 h-6" }: TournamentLogoProps) {
    if (!logo) return null;

    // If the logo is an inline SVG
    if (logo.trim().startsWith('<svg')) {
        return (
            <div
                className={`${className} text-gold [&>svg]:w-full [&>svg]:h-full [&>svg]:fill-current`}
                dangerouslySetInnerHTML={{ __html: logo }}
                title={name}
            />
        );
    }

    // If the logo is a URL
    return (
        <img
            src={logo}
            alt={name}
            className={`${className} object-contain`}
            title={name}
        />
    );
}

interface TeamLogoProps {
    logoUrl: string | null | undefined;
    name?: string;
    className?: string;
    fallback?: React.ReactNode;
}

/**
 * Renders a team logo from an image URL.
 * Shows a fallback (placeholder or custom element) if no logo is provided.
 */
export function TeamLogo({ logoUrl, name = "Team", className = "w-8 h-8", fallback }: TeamLogoProps) {
    if (!logoUrl) {
        if (fallback) return <>{fallback}</>;
        return (
            <div className={`${className} bg-white/10 rounded-lg flex items-center justify-center text-gray-500`}>
                <span className="text-xs font-bold">{name.substring(0, 2).toUpperCase()}</span>
            </div>
        );
    }

    return (
        <img
            src={logoUrl}
            alt={name}
            className={`${className} object-contain`}
            title={name}
            onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
            }}
        />
    );
}
