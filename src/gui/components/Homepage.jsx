import React, { useState } from 'react';
import { BsStars, BsHouseDoorFill, BsFileEarmarkPlus, BsFolder2Open } from 'react-icons/bs';
import { AiOutlineRedo } from 'react-icons/ai';
import NewProject from './NewProject';

const Homepage = ({ onProjectOpen }) => {
    const [showModal, setShowModal] = useState(false);
    const [activeTab, setActiveTab] = useState('home');

    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const handleNewProject = () => {
        setActiveTab('new');
        handleOpenModal();
    };

    return (
        <div className="d-flex" style={{ height: '100vh', backgroundColor: 'var(--app-bg-main)', transition: 'background-color 0.3s ease', overflow: 'hidden' }}>
            
            {/* Left Sidebar */}
            <div className="d-flex flex-column align-items-center py-4" style={{ width: '80px', backgroundColor: 'var(--app-bg-card)', borderRight: '1px solid var(--app-border-light)', flexShrink: 0, zIndex: 10 }}>
                {/* Home Icon */}
                <div 
                    className="d-flex flex-column align-items-center mb-4" 
                    style={{ cursor: 'pointer', color: activeTab === 'home' ? '#9ACD32' : 'var(--app-text-muted)', transition: 'color 0.2s' }}
                    onClick={() => setActiveTab('home')}
                >
                    <BsHouseDoorFill size={22} className="mb-2" />
                    <span style={{ fontSize: '11px', fontWeight: activeTab === 'home' ? '600' : 'normal' }}>Home</span>
                </div>
                
                {/* New Project Icon */}
                <div 
                    className="d-flex flex-column align-items-center mb-4" 
                    style={{ cursor: 'pointer', color: activeTab === 'new' ? '#9ACD32' : 'var(--app-text-muted)', transition: 'color 0.2s' }}
                    onClick={handleNewProject}
                >
                    <BsFileEarmarkPlus size={22} className="mb-2" />
                    <span style={{ fontSize: '11px', fontWeight: activeTab === 'new' ? '600' : 'normal' }}>New</span>
                </div>

                {/* Open Project Icon */}
                <div 
                    className="d-flex flex-column align-items-center" 
                    style={{ cursor: 'pointer', color: activeTab === 'open' ? '#9ACD32' : 'var(--app-text-muted)', transition: 'color 0.2s' }}
                    onClick={() => {
                        setActiveTab('open');
                        onProjectOpen();
                    }}
                >
                    <BsFolder2Open size={22} className="mb-2" />
                    <span style={{ fontSize: '11px', fontWeight: activeTab === 'open' ? '600' : 'normal' }}>Open</span>
                </div>
            </div>

            {/* Main Area */}
            <div className="flex-grow-1 d-flex flex-column" style={{ overflow: 'hidden' }}>
                
                {/* Header */}
                <header className="d-flex justify-content-between align-items-center px-4 py-3" style={{ borderBottom: '1px solid var(--app-border-light)' }}>
                    <h5 className="m-0 text-white fw-light" style={{ color: 'var(--app-text-primary)' }}>
                        Good evening, <span style={{ color: '#9ACD32', fontWeight: 'bold' }}>Ritik!</span>
                    </h5>
                    <button 
                        className="btn btn-sm d-flex align-items-center gap-2" 
                        style={{ backgroundColor: 'transparent', color: 'var(--app-text-secondary)', border: '1px solid var(--app-border-light)' }}
                    >
                        <AiOutlineRedo size={14} /> Refresh
                    </button>
                </header>

                {/* Content */}
                <main className="flex-grow-1 px-4 py-4" style={{ overflowY: 'auto' }}>
                    
                    {/* Projects Header & Filters */}
                    <div className="d-flex justify-content-between align-items-center mb-4 text-nowrap">
                        <h6 className="m-0 fw-bold flex-grow-1 text-uppercase" style={{ fontSize: '0.8rem', color: 'var(--app-text-muted)', letterSpacing: '1.5px' }}>
                            RECENT PROJECTS
                        </h6>
                        
                        <div className="d-flex align-items-center gap-2">
                            <input 
                                type="text" 
                                placeholder="Search projects..." 
                                className="form-control form-control-sm me-2"
                                style={{
                                    backgroundColor: 'var(--app-input-bg, #2c2f33)', 
                                    border: '1px solid var(--app-input-border, #444)', 
                                    color: 'var(--app-text-primary)',
                                    width: '250px'
                                }}
                            />
                            <button className="btn btn-sm px-3 border-0" style={{ backgroundColor: '#9ACD32', color: '#000', fontWeight: 'bold' }}>Recent</button>
                            <button className="btn btn-sm px-3 border" style={{ backgroundColor: 'transparent', color: 'var(--app-text-secondary)', borderColor: 'var(--app-border-light)' }}>Name</button>
                            <button className="btn btn-sm px-3 border" style={{ backgroundColor: 'transparent', color: 'var(--app-text-secondary)', borderColor: 'var(--app-border-light)' }}>Pinned</button>
                        </div>
                    </div>

                    {/* Projects List (Empty State Placeholder) */}
                    <div className="d-flex flex-column align-items-center justify-content-center p-5" style={{ minHeight: '300px', backgroundColor: 'var(--app-bg-card)', borderRadius: '6px', border: '1px dashed var(--app-border-light)' }}>
                        <BsStars size={28} className="mb-3" style={{ color: 'var(--app-logo-accent, #9ACD32)' }} />
                        <h5 style={{ color: 'var(--app-text-primary)', fontWeight: 'normal' }}>No projects available</h5>
                        <div style={{ fontSize: '0.9rem', color: 'var(--app-text-secondary)' }}>
                            Click 'New' to create your first project.
                        </div>
                    </div>

                </main>
            </div>

            {/* New Project Modal */}
            <NewProject show={showModal} handleClose={handleCloseModal} onProjectOpen={onProjectOpen} />
        </div>
    );
};

export default Homepage;