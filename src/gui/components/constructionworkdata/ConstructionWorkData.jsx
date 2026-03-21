import React, { useState, useEffect } from 'react';
import './ConstructionWorkData.css';
import Foundation from './foundation/Foundation';
import SubStructure from './substructure/SubStructure';
import SuperStructure from './superstructure/SuperStructure';
import Miscellaneous from './miscellaneous/Miscellaneous';

const TABS = [
    { key: 'Foundation',    label: 'Foundation',     component: Foundation },
    { key: 'SubStructure',  label: 'Sub Structure',  component: SubStructure },
    { key: 'SuperStructure',label: 'Super Structure', component: SuperStructure },
    { key: 'Miscellaneous', label: 'Miscellaneous',  component: Miscellaneous },
];

const ConstructionWorkData = ({ controller, projectName = 'Active Analysis', initialTab = 'Foundation' }) => {
    const [activeTab, setActiveTab] = useState(initialTab);

    useEffect(() => {
        setActiveTab(initialTab);
    }, [initialTab]);

    const ActiveComponent = TABS.find((t) => t.key === activeTab)?.component ?? Foundation;

    const handleUploadExcel = () => {
        controller?.engine?._log('Construction: Upload Excel clicked.');
    };

    const handleTrash = () => {
        controller?.engine?._log('Construction: Trash clicked.');
    };

    return (
        <div className="cwd-page">
            {/* Header */}
            <div className="cwd-header">
                <div>
                    <div className="cwd-header-title">Structure Management</div>
                    <div className="cwd-header-sub">
                        Project: <span>{projectName}</span>
                    </div>
                </div>
                <div className="cwd-header-actions">
                    <button className="cwd-action-btn" onClick={handleUploadExcel}>
                        Upload Excel
                    </button>
                    <button className="cwd-action-btn" onClick={handleTrash}>
                        Trash
                    </button>
                </div>
            </div>

            {/* Tab bar */}
            <div className="cwd-tabs">
                {TABS.map((tab) => (
                    <button
                        key={tab.key}
                        className={`cwd-tab${activeTab === tab.key ? ' cwd-tab--active' : ''}`}
                        onClick={() => setActiveTab(tab.key)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Active tab content */}
            <div className="cwd-content">
                <ActiveComponent controller={controller} />
            </div>
        </div>
    );
};

export default ConstructionWorkData;
