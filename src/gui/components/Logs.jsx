import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';

const Logs = ({ checkpoints, logs = [], onClearLogs }) => {
    const checkpointCount = checkpoints?.length || 0;

    const handleClear = () => {
        if (onClearLogs) onClearLogs();
    };

    return (
        <div style={{ 
            padding: '20px', 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
            backgroundColor: 'var(--app-bg-main)',
            color: 'var(--app-text-primary)',
            fontFamily: '"Segoe UI", system-ui, sans-serif'
        }}>
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '15px' 
            }}>
                <h5 style={{ margin: 0, fontWeight: 500 }}>Engine Logs</h5>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ display: 'flex', gap: '10px', fontSize: '13px', color: 'var(--app-text-secondary)' }}>
                        <span>Chunks: <span style={{ color: 'var(--app-text-primary)' }}>15</span></span>
                        <span style={{ color: 'var(--app-border-mid)' }}>|</span>
                        <span>Checkpoints: <span style={{ color: 'var(--app-text-primary)' }}>{checkpointCount}</span></span>
                        <span style={{ color: 'var(--app-border-mid)' }}>|</span>
                        <span>Pending: <span style={{ color: 'var(--app-text-primary)' }}>0</span></span>
                    </div>
                    
                    <Button 
                        variant="outline-secondary" 
                        size="sm" 
                        onClick={handleClear}
                        style={{ 
                            fontSize: '12px', 
                            padding: '2px 10px',
                            borderColor: 'var(--app-border-mid)',
                            color: 'var(--app-text-secondary)',
                            backgroundColor: 'var(--app-bg-card)'
                        }}
                    >
                        Clear
                    </Button>
                </div>
            </div>

            <div style={{ 
                flexGrow: 1, 
                backgroundColor: 'var(--app-bg-alt)', 
                borderRadius: '6px',
                border: '1px solid var(--app-border-light)',
                padding: '15px',
                overflowY: 'auto',
                fontFamily: 'monospace',
                fontSize: '13px',
                lineHeight: '1.6',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'
            }}>
                {logs.length === 0 ? (
                    <div style={{ color: 'var(--app-text-muted)', textAlign: 'center', marginTop: '20px' }}>
                        No logs to display
                    </div>
                ) : (
                    logs.map((log, index) => (
                        <div key={index} style={{ marginBottom: '4px', wordBreak: 'break-all' }}>
                            <span style={{ color: 'var(--app-text-muted)', marginRight: '8px' }}>
                                {log.substring(0, 10)}
                            </span>
                            <span style={{ color: 'var(--app-text-secondary)' }}>
                                {log.substring(10)}
                            </span>
                        </div>
                    ))
                ).reverse()}
            </div>
        </div>
    );
};

export default Logs;
