import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const BRAND_CONFIGS = {
    'anant': {
        words: ['Anant', 'अनंत'],
        bottom: 'CHAUDHARY'
    },
    'sons': {
        words: ['Chaudhary', 'चौधरी'],
        bottom: '& SONS'
    },
    'connect': {
        words: ['Chaudhary', 'चौधरी'],
        bottom: 'CONNECT'
    },
    'docs': {
        words: ['Chaudhary', 'चौधरी'],
        bottom: 'DOCS'
    },
    'articles': {
        words: ['Chaudhary', 'चौधरी'],
        bottom: 'ARTICLES'
    },
    'default': {
        words: ['Ankit', 'अंकित'],
        bottom: 'CHAUDHARY'
    }
};

const Logo = ({ className = "", variant }) => {
    let location;
    try {
        location = useLocation();
    } catch (e) {
        location = { pathname: '/' };
    }

    const currentVariant = variant || (
        location?.pathname === '/anant-chaudhary' ? 'anant' :
        (location?.pathname === '/chaudhary-and-sons' || location?.pathname === '/profile' || location?.pathname.startsWith('/admin')) ? 'sons' :
        location?.pathname === '/courses' ? 'connect' :
        location?.pathname === '/docs' ? 'docs' :
        (location?.pathname.startsWith('/articles') || location?.pathname === '/post') ? 'articles' :
        'default'
    );

    const config = BRAND_CONFIGS[currentVariant] || BRAND_CONFIGS['default'];

    // Bilingual Typewriter States
    const [wordIndex, setWordIndex] = useState(0);
    const [displayText, setDisplayText] = useState(config.words[0]);
    const [isDeleting, setIsDeleting] = useState(false);
    const [typingSpeed, setTypingSpeed] = useState(120);

    // Reset when route/variant changes
    useEffect(() => {
        setWordIndex(0);
        setDisplayText(config.words[0]);
        setIsDeleting(false);
    }, [currentVariant]);

    useEffect(() => {
        const fullWord = config.words[wordIndex % config.words.length];

        const handleType = () => {
            const currentArray = Array.from(displayText);
            const fullArray = Array.from(fullWord);

            if (!isDeleting) {
                // Typing forward
                const nextText = fullArray.slice(0, currentArray.length + 1).join('');
                setDisplayText(nextText);
                setTypingSpeed(110);

                if (nextText === fullWord) {
                    // Hold complete word for 2.4s
                    setTimeout(() => setIsDeleting(true), 2400);
                }
            } else {
                // Erasing backward
                const nextText = currentArray.slice(0, -1).join('');
                setDisplayText(nextText);
                setTypingSpeed(60);

                if (nextText === '') {
                    setIsDeleting(false);
                    setWordIndex((prev) => (prev + 1) % config.words.length);
                    setTypingSpeed(350); // Brief pause before next language starts
                }
            }
        };

        const timer = setTimeout(handleType, typingSpeed);
        return () => clearTimeout(timer);
    }, [displayText, isDeleting, wordIndex, typingSpeed, config.words]);

    // Detect if current text is Hindi / Devanagari
    const isHindi = /[\u0900-\u097F]/.test(displayText);

    return (
        <div className={`compact-two-row-logo ${className}`}>
            {/* Row 1: Bilingual Animated Typewriter Name (English Cursive <-> Hindi Cursive) */}
            <span className={`logo-row-top ${isHindi ? 'hindi-cursive' : 'english-cursive'}`}>
                <span className="logo-type-text">{displayText || '\u00A0'}</span>
            </span>

            {/* Row 2: Fixed Subtitle */}
            <span className="logo-row-bottom">{config.bottom}</span>
        </div>
    );
};

export default Logo;
