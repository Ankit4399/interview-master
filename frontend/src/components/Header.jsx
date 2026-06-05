import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../features/auth/hooks/useAuth'

const Header = () => {
    const { user, handleLogout } = useAuth()
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const navigate = useNavigate()
    const dropdownRef = useRef(null)

    // Close dropdown on clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const onLogoutClick = async () => {
        await handleLogout()
        navigate('/')
    }

    const firstLetter = user?.username ? user.username.charAt(0).toUpperCase() : 'U'

    return (
        <header className="app-header">
            <div className="header-container">
                <div className="logo" onClick={() => navigate('/dashboard')}>
                    <svg className="logo-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2L2 7l10 5 10-5-10-5z" />
                        <path d="M2 17l10 5 10-5" />
                        <path d="M2 12l10 5 10-5" />
                    </svg>
                    <span className="logo-text">Interview<span className="logo-highlight">Master</span></span>
                </div>

                <nav className="header-nav-links">
                    <Link to="/dashboard" className="nav-link">Dashboard</Link>
                </nav>

                <div className="header-profile-section" ref={dropdownRef}>
                    <div className="profile-trigger" onClick={() => setDropdownOpen(!dropdownOpen)}>
                        <span className="profile-name">{user?.username || 'User'}</span>
                        <div className="profile-avatar">
                            {firstLetter}
                        </div>
                        <svg className={`chevron-icon ${dropdownOpen ? 'rotated' : ''}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="6 9 12 15 18 9" />
                        </svg>
                    </div>

                    {dropdownOpen && (
                        <div className="profile-dropdown glass-panel">
                            <div className="dropdown-user-details">
                                <p className="details-username">{user?.username}</p>
                                <p className="details-email">{user?.email}</p>
                            </div>
                            <div className="dropdown-divider"></div>
                            <button onClick={onLogoutClick} className="dropdown-logout-btn">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                    <polyline points="16 17 21 12 16 7" />
                                    <line x1="21" y1="12" x2="9" y2="12" />
                                </svg>
                                Log Out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}

export default Header
