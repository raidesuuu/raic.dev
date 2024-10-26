import React from 'react';

interface HeroProps {
    title: string;
    subtitle: string;
    badge?: string;
    href?: string;
}

const Hero: React.FC<HeroProps> = ({
    title,
    subtitle,
    badge,
    href
}) => {
    return (
        <div className="max-w-sm w-72 bg-gradient-to-r from-blue-900 to-purple-900 text-white rounded overflow-hidden shadow-lg">
            <a href={href} className="newtab">
                <div className="px-6 py-4">
                    <div className="font-bold text-xl mb-2">{title} {badge ? <span className="text-xs font-medium me-2 px-2.5 py-0.5 rounded bg-blue-900 text-blue-300">{badge}</span> : ""}                    </div>
                    <p className="text-base">
                        {subtitle}
                    </p>
                </div>
            </a>
        </div>
    );
}

export default Hero;
