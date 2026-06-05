import React from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../features/auth/hooks/useAuth'
import '../style/landing.scss'

const Landing = () => {
    const { user, loading } = useAuth()
    const navigate = useNavigate()

    return (
        <div className="landing-page">
            {/* Navigation Header */}
            <header className="landing-nav">
                <div className="nav-container">
                    <div className="logo" onClick={() => navigate('/')}>
                        <svg className="logo-icon" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2L2 7l10 5 10-5-10-5z" />
                            <path d="M2 17l10 5 10-5" />
                            <path d="M2 12l10 5 10-5" />
                        </svg>
                        <span className="logo-text">Interview<span className="logo-highlight">Master</span></span>
                    </div>

                    <div className="nav-actions">
                        {user ? (
                            <Link to="/dashboard" className="btn-emerald">
                                Dashboard
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                    <polyline points="12 5 19 12 12 19" />
                                </svg>
                            </Link>
                        ) : (
                            <>
                                <Link to="/login" className="btn-login">Sign In</Link>
                                <Link to="/register" className="btn-emerald">Get Started</Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-glow hero-glow-1"></div>
                <div className="hero-glow hero-glow-2"></div>

                <div className="hero-content">
                    <span className="hero-badge">AI-Powered Interview Coach</span>
                    <h1 className="hero-title">
                        Conquer Your Next Tech Interview with <span className="highlight">AI Precision</span>
                    </h1>
                    <p className="hero-subtitle">
                        Paste any job description, upload your resume, and instantly receive customized study roadmaps, targeted mock interview questions, and ATS-optimized tailored resumes.
                    </p>

                    <div className="hero-ctas">
                        {user ? (
                            <Link to="/dashboard" className="btn-emerald btn-lg">
                                Access Dashboard
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                    <polyline points="12 5 19 12 12 19" />
                                </svg>
                            </Link>
                        ) : (
                            <>
                                <Link to="/register" className="btn-emerald btn-lg">
                                    Analyze Your Resume
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="5" y1="12" x2="19" y2="12" />
                                        <polyline points="12 5 19 12 12 19" />
                                    </svg>
                                </Link>
                                <Link to="/login" className="btn-outline btn-lg">Sign In</Link>
                            </>
                        )}
                    </div>

                    <div className="hero-metrics">
                        <div className="metric">
                            <span className="metric-num">95%</span>
                            <span className="metric-label">ATS Acceptance Rate</span>
                        </div>
                        <div className="metric-divider"></div>
                        <div className="metric">
                            <span className="metric-num">30s</span>
                            <span className="metric-label">Report Generation</span>
                        </div>
                        <div className="metric-divider"></div>
                        <div className="metric">
                            <span className="metric-num">500+</span>
                            <span className="metric-label">Success Stories</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="section-header">
                    <h2>Engineered for Job Hunters</h2>
                    <p>Stop guessing what interviewers will ask. Let generative models analyze the requirements.</p>
                </div>

                <div className="features-grid">
                    <div className="feature-card glass-panel">
                        <div className="feature-icon emerald">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                                <line x1="16" y1="13" x2="8" y2="13" />
                                <line x1="16" y1="17" x2="8" y2="17" />
                                <polyline points="10 9 9 9 8 9" />
                            </svg>
                        </div>
                        <h3>Deep Resume Parsing</h3>
                        <p>Our backend extracts text directly from your PDF documents, detecting key technologies, project details, and professional experience.</p>
                    </div>

                    <div className="feature-card glass-panel">
                        <div className="feature-icon amber">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                        </div>
                        <h3>Precise Skill Gap Maps</h3>
                        <p>Get a granular analysis of skills you lack for the position, categorized by low, medium, and high severity to focus your learning.</p>
                    </div>

                    <div className="feature-card glass-panel">
                        <div className="feature-icon mint">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                            </svg>
                        </div>
                        <h3>Structured Study Roadmap</h3>
                        <p>Receive a clear day-by-day prep plan listing key reading tasks, architectural practices, and review modules optimized for the timeline.</p>
                    </div>

                    <div className="feature-card glass-panel">
                        <div className="feature-icon gold">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                <line x1="16" y1="2" x2="16" y2="6" />
                                <line x1="8" y1="2" x2="8" y2="6" />
                                <line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                        </div>
                        <h3>ATS-Tailored PDF Resumes</h3>
                        <p>Dynamically generate a pristine, professionally structured PDF resume tailored specifically to match the job requirements.</p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="landing-footer">
                <p>&copy; {new Date().getFullYear()} InterviewMaster AI. All rights reserved.</p>
                <div className="footer-links">
                    <a href="#">Security</a>
                    <a href="#">Privacy Policy</a>
                    <a href="#">Contact Support</a>
                </div>
            </footer>
        </div>
    )
}

export default Landing
