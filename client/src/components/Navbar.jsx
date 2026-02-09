import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, Rocket, LogIn, LogOut, User, Sun, Moon } from 'lucide-react';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import './Navbar.css';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { isAuthenticated, user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();

    return (
        <nav className="navbar glass">
            <div className="container nav-container">
                <NavLink to="/" className="logo">
                    <Logo size={32} />
                </NavLink>

                <ul className={`nav-links ${isOpen ? 'active' : ''}`}>
                    <li>
                        <NavLink to="/" end onClick={() => setIsOpen(false)}>Home</NavLink>
                    </li>
                    <li>
                        <NavLink to="/articles" onClick={() => setIsOpen(false)}>Articles</NavLink>
                    </li>
                    <li>
                        <NavLink to="/post" onClick={() => setIsOpen(false)}>Post Article</NavLink>
                    </li>

                    {isAuthenticated && user?.role === 'admin' && (
                        <li className="admin-link">
                            <NavLink to="/admin" onClick={() => setIsOpen(false)}>Manage</NavLink>
                        </li>
                    )}

                    <li className="nav-controls">
                        <button onClick={toggleTheme} className="theme-toggle-btn" title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                    </li>

                    <li className="auth-link">
                        {isAuthenticated ? (
                            <div className="user-nav-actions">
                                <span className="user-greeting">
                                    <User size={18} /> {user.firstName}
                                </span>
                                <button onClick={logout} className="logout-btn" title="Logout">
                                    <LogOut size={20} />
                                </button>
                            </div>
                        ) : (
                            <NavLink to="/login" onClick={() => setIsOpen(false)} className="login-nav-btn">
                                <LogIn size={18} /> Login
                            </NavLink>
                        )}
                    </li>
                </ul>

                <div className="mobile-actions">
                    <button onClick={toggleTheme} className="theme-toggle-btn mobile-theme-btn">
                        {theme === 'dark' ? <Sun size={22} /> : <Moon size={22} />}
                    </button>
                    <button className="mobile-menu-btn" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
