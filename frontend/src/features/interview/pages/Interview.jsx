import React, { useState, useEffect } from 'react'
import '../../interview/style/interview.scss'
import { useInterview } from '../hooks/useInterview.js'
import { useParams, Link } from 'react-router'
import Header from '../../../components/Header'

const NAV_ITEMS = [
    { id: 'technical', label: 'Technical Questions', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>) },
    { id: 'behavioral', label: 'Behavioral Questions', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>) },
    { id: 'roadmap', label: 'Road Map', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11" /></svg>) },
]

// ── Sub-components ────────────────────────────────────────────────────────────
const QuestionCard = ({ item, index }) => {
    const [open, setOpen] = useState(false)
    return (
        <div className={`q-card glass-panel ${open ? 'q-card--open' : ''}`}>
            <div className='q-card__header' onClick={() => setOpen(o => !o)}>
                <span className='q-card__index'>Q{index + 1}</span>
                <p className='q-card__question'>{item.question}</p>
                <span className={`q-card__chevron ${open ? 'q-card__chevron--open' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                </span>
            </div>
            {open && (
                <div className='q-card__body'>
                    <div className='q-card__section'>
                        <span className='q-card__tag q-card__tag--intention'>Interviewer's Intention</span>
                        <p className="q-card__text">{item.intention}</p>
                    </div>
                    <div className='q-card__section'>
                        <span className='q-card__tag q-card__tag--answer'>Suggested Response Strategy</span>
                        <p className="q-card__text">{item.answer}</p>
                    </div>
                </div>
            )}
        </div>
    )
}

const RoadMapDay = ({ day }) => (
    <div className='roadmap-day glass-panel'>
        <div className='roadmap-day__header'>
            <span className='roadmap-day__badge'>Day {day.day}</span>
            <h3 className='roadmap-day__focus'>{day.focus}</h3>
        </div>
        <div className="roadmap-day-divider"></div>
        <ul className='roadmap-day__tasks'>
            {day.tasks.map((task, i) => (
                <li key={i}>
                    <span className='roadmap-day__bullet' />
                    <span className='roadmap-day__task-text'>{task}</span>
                </li>
            ))}
        </ul>
    </div>
)

// ── Main Component ────────────────────────────────────────────────────────────
const Interview = () => {
    const [activeNav, setActiveNav] = useState('technical')
    const { report, getReportById, loading, getResumePdf } = useInterview()
    const { interviewId } = useParams()

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        }
    }, [interviewId])

    if (loading || !report) {
        return (
            <div className="interview-layout-wrapper">
                <Header />
                <main className='loading-screen'>
                    <div className="spinner"></div>
                    <h1>Loading your customized blueprint...</h1>
                    <p>Fetching mock questions, study timelines, and ATS comparisons.</p>
                </main>
            </div>
        )
    }

    const scoreColor =
        report.matchScore >= 80 ? 'score--high' :
            report.matchScore >= 60 ? 'score--mid' : 'score--low'

    return (
        <div className="interview-layout-wrapper">
            <Header />

            <div className='interview-page'>
                {/* Info summary header banner */}
                <div className="report-summary-banner glass-panel">
                    <div className="banner-details">
                        <span className="banner-badge">Interview Blueprint</span>
                        <h1>{report.title || 'Untitled Target Role'}</h1>
                        <p>Generated on {new Date(report.createdAt).toLocaleDateString()} &bull; Aligned with your profile</p>
                    </div>

                    <Link to="/dashboard" className="btn-outline back-dashboard-btn">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
                        Back to Blueprints
                    </Link>
                </div>

                <div className='interview-layout'>

                    {/* ── Left Nav ── */}
                    <nav className='interview-nav glass-panel'>
                        <div className="nav-content">
                            <p className='interview-nav__label'>Blueprint Modules</p>
                            {NAV_ITEMS.map(item => (
                                <button
                                    key={item.id}
                                    className={`interview-nav__item ${activeNav === item.id ? 'interview-nav__item--active' : ''}`}
                                    onClick={() => setActiveNav(item.id)}
                                >
                                    <span className='interview-nav__icon'>{item.icon}</span>
                                    <span className='item-label-text'>{item.label}</span>
                                </button>
                            ))}
                        </div>
                        <div className="nav-footer-action">
                            <button
                                onClick={() => { getResumePdf(interviewId) }}
                                className='button primary-button download-resume-btn' >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                                Tailor Resume (PDF)
                            </button>
                        </div>
                    </nav>

                    {/* ── Center Content ── */}
                    <main className='interview-content'>
                        {activeNav === 'technical' && (
                            <section className="section-fade">
                                <div className='content-header'>
                                    <h2>Technical Mock Panel</h2>
                                    <span className='content-header__count'>{report.technicalQuestions?.length || 0} Questions</span>
                                </div>
                                <div className='q-list'>
                                    {report.technicalQuestions?.map((q, i) => (
                                        <QuestionCard key={i} item={q} index={i} />
                                    ))}
                                </div>
                            </section>
                        )}

                        {activeNav === 'behavioral' && (
                            <section className="section-fade">
                                <div className='content-header'>
                                    <h2>Behavioral &amp; Situational Mock Panel</h2>
                                    <span className='content-header__count'>{report.behavioralQuestions?.length || 0} Questions</span>
                                </div>
                                <div className='q-list'>
                                    {report.behavioralQuestions?.map((q, i) => (
                                        <QuestionCard key={i} item={q} index={i} />
                                    ))}
                                </div>
                            </section>
                        )}

                        {activeNav === 'roadmap' && (
                            <section className="section-fade">
                                <div className='content-header'>
                                    <h2>Preparation Roadmap</h2>
                                    <span className='content-header__count'>{report.preparationPlan?.length || 0} Days</span>
                                </div>
                                <div className='roadmap-list'>
                                    {report.preparationPlan?.map((day) => (
                                        <RoadMapDay key={day.day} day={day} />
                                    ))}
                                </div>
                            </section>
                        )}
                    </main>

                    {/* ── Right Sidebar ── */}
                    <aside className='interview-sidebar'>

                        {/* Match Score */}
                        <div className='match-score-card glass-panel'>
                            <p className='match-score__label'>Profile Alignment Score</p>
                            <div className={`match-score__ring ${scoreColor}`}>
                                <span className='match-score__value'>{report.matchScore}</span>
                                <span className='match-score__pct'>%</span>
                            </div>
                            <p className='match-score__sub'>
                                {report.matchScore >= 80 ? 'Outstanding alignment with target criteria' :
                                    report.matchScore >= 60 ? 'Strong baseline with clear gaps' :
                                        'Significant gaps relative to requirements'}
                            </p>
                        </div>

                        {/* Skill Gaps */}
                        {report.skillGaps && report.skillGaps.length > 0 && (
                            <div className='skill-gaps-card glass-panel'>
                                <p className='skill-gaps__label'>Identified Skill Gaps</p>
                                <div className='skill-gaps__list'>
                                    {report.skillGaps.map((gap, i) => (
                                        <div key={i} className={`skill-gap-item skill-gap-item--${gap.severity}`}>
                                            <span className="skill-gap-name">{gap.skill}</span>
                                            <span className={`severity-tag severity-tag--${gap.severity}`}>{gap.severity}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                    </aside>
                </div>
            </div>
        </div>
    )
}

export default Interview