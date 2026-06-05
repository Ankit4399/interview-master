import React, { useState } from 'react'
import "../auth.form.scss"
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'

const Login = () => {
    const navigate = useNavigate()
    const { loading, handleLogin } = useAuth()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        const success = await handleLogin({ email, password })
        if (success) {
            navigate('/dashboard')
        }
    }

    if (loading) {
        return (
            <main className='loading-screen'>
                <h1>Signing you in...</h1>
            </main>
        )
    }

    return (
        <main className="auth-page-wrapper">
            <div className="auth-glow auth-glow-1"></div>
            <div className="auth-glow auth-glow-2"></div>

            <div className="form-container">
                <header className="auth-header">
                    <Link to="/" className="auth-logo">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2L2 7l10 5 10-5-10-5z" />
                            <path d="M2 17l10 5 10-5" />
                            <path d="M2 12l10 5 10-5" />
                        </svg>
                        <span className="logo-text">Interview<span className="logo-highlight">Master</span></span>
                    </Link>
                    <h1>Welcome Back</h1>
                    <p>Enter your credentials to access your dashboard</p>
                </header>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            id="email"
                            placeholder="you@example.com"
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            id="password"
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <button type="submit" className="button primary-button auth-button">
                        Sign In
                    </button>
                </form>

                <p className="auth-footer-text">
                    Don't have an account?
                    <Link to="/register">Create one</Link>
                </p>
            </div>
        </main>
    )
}

export default Login
