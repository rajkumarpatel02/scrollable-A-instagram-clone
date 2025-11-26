import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

const Header: React.FC = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!isAuthenticated) {
        return null;
    }

    return (
        <header className="header">
            <div className="header-container">
                <Link to="/" className="header-logo">
                    Scrollable
                </Link>

                <nav className="header-nav">
                    <Link to="/" className="nav-link">
                        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <span className="nav-text">Home</span>
                    </Link>

                    <Link to="/upload" className="nav-link">
                        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span className="nav-text">Upload</span>
                    </Link>

                    <div className="user-menu">
                        <div className="user-info">
                            {user?.profilePicture ? (
                                <img src={user.profilePicture} alt={user.username} className="user-avatar" />
                            ) : (
                                <div className="user-avatar-placeholder">
                                    {user?.username[0].toUpperCase()}
                                </div>
                            )}
                            <span className="username">{user?.username}</span>
                        </div>
                        <button onClick={handleLogout} className="logout-button">
                            Logout
                        </button>
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Header;
