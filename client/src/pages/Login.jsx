import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, User, AlertCircle, Mail, Phone, UserPlus } from 'lucide-react';
import './Login.css';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        firstName: '',
        lastName: '',
        phone: ''
    });
    const [error, setError] = useState('');
    const { login, signup } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (isLogin) {
            const res = await login(formData.username, formData.password);
            if (res.success) {
                navigate(res.role === 'admin' ? '/admin' : '/');
            } else {
                setError(res.message);
            }
        } else {
            // Signup validation
            if (!validateEmail(formData.username)) {
                return setError('Please enter a valid email address');
            }
            if (formData.password.length < 6) {
                return setError('Password must be at least 6 characters');
            }

            const res = await signup({
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.username,
                password: formData.password,
                phone: formData.phone
            });

            if (res.success) {
                navigate('/');
            } else {
                setError(res.message);
            }
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <div className="login-header">
                    <div className="login-icon">
                        {isLogin ? <Lock size={32} /> : <UserPlus size={32} />}
                    </div>
                    <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
                    <p>{isLogin ? 'Welcome back! Please enter your details.' : 'Create an account to join us.'}</p>
                </div>

                {error && (
                    <div className="error-message">
                        <AlertCircle size={20} />
                        <span>{error}</span>
                    </div>
                )}

                {!isLogin && (
                    <div className="form-row">
                        <div className="input-group">
                            <label>First Name</label>
                            <div className="input-wrapper">
                                <User className="input-icon" size={20} />
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    placeholder="John"
                                    required
                                />
                            </div>
                        </div>
                        <div className="input-group">
                            <label>Last Name</label>
                            <div className="input-wrapper">
                                <User className="input-icon" size={20} />
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    placeholder="Doe"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                )}

                <div className="input-group">
                    <label>{isLogin ? 'Username / Email' : 'Email Address'}</label>
                    <div className="input-wrapper">
                        <Mail className="input-icon" size={20} />
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="email@example.com"
                            required
                        />
                    </div>
                </div>

                {!isLogin && (
                    <div className="input-group">
                        <label>Phone (Optional)</label>
                        <div className="input-wrapper">
                            <Phone className="input-icon" size={20} />
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+1 234 567 890"
                            />
                        </div>
                    </div>
                )}

                <div className="input-group">
                    <label>Password</label>
                    <div className="input-wrapper">
                        <Lock className="input-icon" size={20} />
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            required
                        />
                    </div>
                </div>

                <button type="submit" className="login-button">
                    {isLogin ? 'Sign In' : 'Create Account'}
                </button>

                <div className="login-footer">
                    <p>
                        {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                        <button type="button" onClick={() => setIsLogin(!isLogin)}>
                            {isLogin ? 'Sign Up' : 'Login'}
                        </button>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default Login;
