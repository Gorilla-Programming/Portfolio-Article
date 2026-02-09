import React from 'react';

const Logo = ({ size = 28, className = "" }) => {
    return (
        <div className={`logo-wrapper ${className}`} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Stylized Emblem (SVG version of the circular logo) */}
            <svg
                width={size + 4}
                height={size + 4}
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="logo-emblem"
            >
                <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" opacity="0.4" />
                <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="4" />
                <path
                    d="M50 25C36.1929 25 25 36.1929 25 50C25 63.8071 36.1929 75 50 75C63.8071 75 75 63.8071 75 50C75 42.5 71 36 65 32"
                    stroke="currentColor"
                    strokeWidth="6"
                    strokeLinecap="round"
                />
                <circle cx="50" cy="50" r="10" fill="currentColor" />
                <path d="M50 40C55 35 60 40 60 45" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>

            {/* Typography: अंKiT */}
            <h1 className="logo-text" style={{
                fontFamily: "'Teko', sans-serif",
                fontSize: `${size}px`,
                lineHeight: 1,
                letterSpacing: '0.05em',
                margin: 0,
                display: 'flex',
                alignItems: 'baseline'
            }}>
                <span style={{ fontSize: '1.2em', color: 'var(--primary)', marginRight: '2px' }}>अं</span>
                <span>KiT</span>
            </h1>
        </div>
    );
};

export default Logo;
