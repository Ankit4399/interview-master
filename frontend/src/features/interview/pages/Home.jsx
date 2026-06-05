import React, { useState, useRef } from 'react'
import "../../interview/style/home.scss"
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate } from 'react-router'
import Header from '../../../components/Header'

const Home = () => {
    const { loading, generateReport, reports } = useInterview()
    const [jobDescription, setJobDescription] = useState("")
    const [selfDescription, setSelfDescription] = useState("")
    const [selectedFileName, setSelectedFileName] = useState("")
    const resumeInputRef = useRef()
    const navigate = useNavigate()

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setSelectedFileName(file.name)
        } else {
            setSelectedFileName("")
        }
    }

    const handleGenerateReport = async () => {
        const resumeFile = resumeInputRef.current.files[0]
        if (!resumeFile && !selfDescription.trim()) {
            alert("Please upload a resume or provide a quick self-description.")
            return
        }
        if (!jobDescription.trim()) {
            alert("Please paste the target job description.")
            return
        }

        const data = await generateReport({ jobDescription, selfDescription, resumeFile })
        if (data && data._id) {
            navigate(`/interview/${data._id}`)
        } else {
            alert("Failed to generate interview strategy. Please check your network and try again.")
        }
    }

    if (loading) {
        return (
            <div className="dashboard-layout">
                <Header />
                <main className='loading-screen'>
                    <div className="spinner"></div>
                    <h1>Crafting your personalized interview strategy...</h1>
                    <p>AI is analyzing your profile against the job description (approx. 30s)</p>
                </main>
            </div>
        )
    }

    return (
        <div className="dashboard-layout">
            <Header />

            <div className='home-page'>
                {/* Page Header */}
                <header className='page-header'>
                    <h1>Forge Your Custom <span className='highlight'>Interview Strategy</span></h1>
                    <p>Paste any job description and align it against your resume to extract critical questions, prep plans, and tailored drafts.</p>
                </header>

                {/* Main Card Grid */}
                <div className='interview-card glass-panel'>
                    <div className='interview-card__body'>

                        {/* Left Panel - Job Description */}
                        <div className='panel panel--left'>
                            <div className='panel__header'>
                                <span className='panel__icon env-color'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
                                </span>
                                <h2>Target Job Description</h2>
                                <span className='badge badge--required'>Required</span>
                            </div>
                            <textarea
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                className='panel__textarea'
                                placeholder={`Paste the full job specification here...\ne.g. 'Senior React Developer: 4+ years of experience, expertise in Next.js, Redux, responsive styling, and web performance optimization...'`}
                                maxLength={5000}
                            />
                            <div className='char-counter'>{jobDescription.length} / 5000 chars</div>
                        </div>

                        {/* Vertical Divider */}
                        <div className='panel-divider' />

                        {/* Right Panel - Profile */}
                        <div className='panel panel--right'>
                            <div className='panel__header'>
                                <span className='panel__icon env-color'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                                </span>
                                <h2>Your Profile Details</h2>
                            </div>

                            {/* Upload Resume */}
                            <div className='upload-section'>
                                <label className='section-label'>
                                    Upload Resume
                                    <span className='badge badge--best'>Highly Recommended</span>
                                </label>
                                <label className={`dropzone ${selectedFileName ? 'dropzone--has-file' : ''}`} htmlFor='resume'>
                                    <span className='dropzone__icon'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" /></svg>
                                    </span>
                                    <p className='dropzone__title'>
                                        {selectedFileName ? 'Selected File:' : 'Click to upload or drag & drop'}
                                    </p>
                                    <p className='dropzone__subtitle'>
                                        {selectedFileName ? selectedFileName : 'PDF or DOCX (Max 5MB)'}
                                    </p>
                                    <input
                                        ref={resumeInputRef}
                                        hidden
                                        type='file'
                                        id='resume'
                                        name='resume'
                                        accept='.pdf,.docx'
                                        onChange={handleFileChange}
                                    />
                                </label>
                            </div>

                            {/* OR Divider */}
                            <div className='or-divider'><span>OR</span></div>

                            {/* Quick Self-Description */}
                            <div className='self-description'>
                                <label className='section-label' htmlFor='selfDescription'>Quick Self-Description</label>
                                <textarea
                                    value={selfDescription}
                                    onChange={(e) => setSelfDescription(e.target.value)}
                                    id='selfDescription'
                                    name='selfDescription'
                                    className='panel__textarea panel__textarea--short'
                                    placeholder="Type a summary of your professional background, core technical skills, and key projects if you don't have your resume file on hand..."
                                />
                            </div>

                            {/* Info Box */}
                            <div className='info-box'>
                                <span className='info-box__icon'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                                </span>
                                <p>Providing a **Resume** yields significantly more precise mock questions and matching statistics.</p>
                            </div>
                        </div>
                    </div>

                    {/* Card Footer */}
                    <div className='interview-card__footer'>
                        <span className='footer-info'>
                            <span className="dot animate-ping"></span>
                            AI analysis takes approximately 20-30 seconds
                        </span>
                        <button
                            onClick={handleGenerateReport}
                            className='btn-emerald generate-btn'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                            Build Interview Plan
                        </button>
                    </div>
                </div>

                {/* Recent Reports List */}
                {reports && reports.length > 0 && (
                    <section className='recent-reports'>
                        <h2>Your Active Interview Blueprints</h2>
                        <div className='reports-grid'>
                            {reports.map(report => {
                                const scoreColorClass =
                                    report.matchScore >= 80 ? 'score--high' :
                                        report.matchScore >= 60 ? 'score--mid' : 'score--low'

                                return (
                                    <div key={report._id} className='report-card glass-panel' onClick={() => navigate(`/interview/${report._id}`)}>
                                        <div className="card-header-block">
                                            <h3>{report.title || 'Target Position'}</h3>
                                            <span className={`match-badge ${scoreColorClass}`}>{report.matchScore}% Match</span>
                                        </div>
                                        <p className="card-jd-preview">
                                            {report.jobDescription ? report.jobDescription.substring(0, 120) + '...' : 'No job description provided.'}
                                        </p>
                                        <div className="card-footer-block">
                                            <span className='report-meta'>
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                                                {new Date(report.createdAt).toLocaleDateString()}
                                            </span>
                                            <span className="view-link">
                                                Review Strategy
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                                            </span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </section>
                )}

                {/* Page Footer */}
                <footer className='page-footer'>
                    <a href='#'>Security &amp; Encryption</a>
                    <span>&bull;</span>
                    <a href='#'>Privacy Guidelines</a>
                    <span>&bull;</span>
                    <a href='#'>Support Desk</a>
                </footer>
            </div>
        </div>
    )
}

export default Home