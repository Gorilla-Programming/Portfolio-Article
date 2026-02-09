import React from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Github, Linkedin, Mail, Twitter, ChevronRight } from 'lucide-react';
import Logo from './Logo';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-top">
                <div className="footer-container">
                    <div className="footer-grid">
                        {/* Branding Section */}
                        <div className="footer-brand">
                            <Link to="/" className="logo">
                                <Logo size={28} />
                            </Link>
                            <p className="footer-description">
                                Professional Java Developer & Maximo Specialist dedicated to building
                                robust enterprise solutions and sharing technological insights.
                            </p>
                            <div className="footer-socials">
                                <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                                    <Github size={20} />
                                </a>
                                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                                    <Linkedin size={20} />
                                </a>
                                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                                    <Twitter size={20} />
                                </a>
                                <a href="mailto:info@ankitchaudhary.com" aria-label="Email">
                                    <Mail size={20} />
                                </a>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="footer-links">
                            <h3>Quick Links</h3>
                            <ul>
                                <li><Link to="/"><ChevronRight size={14} /> Home</Link></li>
                                <li><Link to="/articles"><ChevronRight size={14} /> Articles</Link></li>
                                <li><Link to="/post"><ChevronRight size={14} /> Submit Article</Link></li>
                                <li><Link to="/admin"><ChevronRight size={14} /> Admin Dashboard</Link></li>
                            </ul>
                        </div>

                        {/* Contact Info */}
                        <div className="footer-contact">
                            <h3>Get In Touch</h3>
                            <p>Have a question or want to work together?</p>
                            <a href="mailto:info@ankitchaudhary.com" className="footer-email-btn">
                                Send a Message
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="footer-container">
                    <div className="footer-bottom-flex">
                        <p>© {new Date().getFullYear()} Ankit Chaudhary. All rights reserved.</p>
                        <div className="footer-meta">
                            <span>Built with React & Express</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
