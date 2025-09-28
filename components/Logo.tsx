import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className }) => (
    <svg 
        width="24" 
        height="24" 
        viewBox="0 0 48 48" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <defs>
            <linearGradient id="logo-gradient" x1="4" y1="8" x2="44" y2="44" gradientUnits="userSpaceOnUse">
                <stop stopColor="#2563EB"/>
                <stop offset="1" stopColor="#059669"/>
            </linearGradient>
        </defs>
        <path d="M4 10C4 8.89543 4.89543 8 6 8H42C43.1046 8 44 8.89543 44 10V30.1264C44 31.3013 43.4141 32.3938 42.4648 33.0279L26.4648 43.5936C25.0499 44.5422 23.2327 44.5422 21.8178 43.5936L5.53521 33.0279C4.5859 32.3938 4 31.3013 4 30.1264V10Z" fill="url(#logo-gradient)"/>
        <path d="M16 22L22 28L34 16" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);
