import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Mail, Twitter, ChevronRight, Sparkles, ArrowUpRight, Copy, Check, Terminal, Shield } from 'lucide-react';
import Logo from './Logo';
import './Footer.css';

const Footer = () => {
    const [copied, setCopied] = useState(false);

    const handleCopyEmail = () => {
        navigator.clipboard.writeText("the.chaudhary.connect@gmail.com");
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    return (
        <footer className="cyber-footer">
            <div className="cyber-footer-container">
                
                {/* Brand Big Headline Strip */}
                <div className="footer-big-brand-strip">
                    <span className="brand-grand-text">CHAUDHARY &amp; SONS</span>
                </div>

                <div className="footer-columns-matrix">
                    
                    {/* Brand Info */}
                    <div className="footer-brand-info">
                        <Link to="/" className="footer-logo-link">
                            <Logo size={32} />
                        </Link>
                        <p className="footer-brand-desc">
                            Enterprise Asset Management (EAM) Architecture, Mission-Critical Java Systems, 
                            and Cloud-Ready Integration Engineering.
                        </p>
                        <div className="footer-social-cluster">
                            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="GitHub">
                                <Github size={18} />
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="LinkedIn">
                                <Linkedin size={18} />
                            </a>
                            <a href="mailto:the.chaudhary.connect@gmail.com" className="social-icon-btn" aria-label="Email">
                                <Mail size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="footer-nav-col">
                        <h4 className="footer-nav-title">Navigation</h4>
                        <ul className="footer-links">
                            <li><Link to="/">Home Architecture</Link></li>
                            <li><a href="#projects">Enterprise Projects &amp; Tools</a></li>
                            <li><a href="#experience">Career Roadmap</a></li>
                            <li><a href="#skills">Technical Arsenal</a></li>
                            <li><a href="#contact">Direct Consultation</a></li>
                        </ul>
                    </div>

                    {/* Platforms */}
                    <div className="footer-nav-col">
                        <h4 className="footer-nav-title">Chaudhary Ecosystem</h4>
                        <ul className="footer-links">
                            <li><Link to="/chaudhary-and-sons">Chaudhary &amp; Sons</Link></li>
                            <li><Link to="/docs">ChaudharyDocs</Link></li>
                            <li><Link to="/courses">ChaudharyConnect</Link></li>
                            <li><Link to="/articles">ChaudharyArticles</Link></li>
                            <li><Link to="/anant-chaudhary">Anant Chaudhary Portfolio</Link></li>
                        </ul>
                    </div>

                    {/* Quick Contact Box */}
                    <div className="footer-nav-col contact-col">
                        <h4 className="footer-nav-title">Direct Inquiries</h4>
                        <p className="footer-contact-note">Available for high-impact enterprise consultations &amp; MAS migration advisory.</p>
                        <button onClick={handleCopyEmail} className="footer-copy-pill">
                            {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                            <span>{copied ? 'Copied to Clipboard!' : 'the.chaudhary.connect@gmail.com'}</span>
                        </button>
                    </div>

                </div>

                {/* Bottom Copyright & Security Strip */}
                <div className="footer-copyright-strip">
                    <p>© {new Date().getFullYear()} Ankit Chaudhary (Chaudhary &amp; Sons). All rights reserved.</p>
                    <div className="footer-status-pill">
                        <span className="live-status-dot"></span>
                        <span>Enterprise Systems Operational</span>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
