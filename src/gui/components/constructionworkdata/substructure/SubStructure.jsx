import React, { useState, useCallback } from 'react';
import '../ConstructionWorkData.css';

let _uid = 0;
const uid = () => `row-${++_uid}`;
const emptyRow = () => ({ id: uid(), workName: '', rate: '', qty: '', source: '' });
const calcTotal = (row) => ((parseFloat(row.rate) || 0) * (parseFloat(row.qty) || 0)).toFixed(2);

const DEFAULT_SECTIONS = [
    { id: 'abutment',  name: 'Abutment',  rows: [] },
    { id: 'pier',      name: 'Pier',      rows: [] },
    { id: 'pier-cap',  name: 'Pier Cap',  rows: [] },
    { id: 'pedestal',  name: 'Pedestal',  rows: [] },
    { id: 'bearing',   name: 'Bearing',   rows: [] },
];

function MaterialTable({ section, onRowChange, onRowDelete, onAddRow }) {
    return (
        <fieldset className="cwd-section">
            <legend className="cwd-section-legend">{section.name}</legend>
            <div className="cwd-table-wrapper">
                <table className="cwd-table">
                    <thead>
                        <tr>
                            <th style={{ width: '35%' }}>Work Name</th>
                            <th style={{ width: '13%' }}>Rate</th>
                            <th style={{ width: '10%' }}>Qty</th>
                            <th style={{ width: '20%' }}>Source</th>
                            <th style={{ width: '13%' }}>Total</th>
                            <th style={{ width: '9%'  }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {section.rows.length === 0 ? (
                            <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--app-text-muted)', padding: '18px', fontStyle: 'italic', fontSize: '0.78rem' }}>No items yet. Click "Add Material" below.</td></tr>
                        ) : section.rows.map((row) => (
                            <tr key={row.id}>
                                <td><input className="cwd-cell-input" type="text" value={row.workName} placeholder="Work name..." onChange={(e) => onRowChange(section.id, row.id, 'workName', e.target.value)} /></td>
                                <td><input className="cwd-cell-input" type="number" min={0} step={0.01} value={row.rate} placeholder="0.00" onChange={(e) => onRowChange(section.id, row.id, 'rate', e.target.value)} /></td>
                                <td><input className="cwd-cell-input" type="number" min={0} step={0.01} value={row.qty} placeholder="0" onChange={(e) => onRowChange(section.id, row.id, 'qty', e.target.value)} /></td>
                                <td><input className="cwd-cell-input" type="text" value={row.source} placeholder="Source..." onChange={(e) => onRowChange(section.id, row.id, 'source', e.target.value)} /></td>
                                <td><span className="cwd-cell-total">{calcTotal(row)}</span></td>
                                <td><button className="cwd-delete-btn" title="Delete row" onClick={() => onRowDelete(section.id, row.id)}>✕</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button className="cwd-add-material-btn" onClick={() => onAddRow(section.id)}>Add Material to {section.name}</button>
        </fieldset>
    );
}

const SubStructure = ({ controller }) => {
    const [sections, setSections] = useState(DEFAULT_SECTIONS);
    const handleRowChange = useCallback((sId, rId, field, val) => setSections((prev) => prev.map((s) => s.id !== sId ? s : { ...s, rows: s.rows.map((r) => r.id !== rId ? r : { ...r, [field]: val }) })), []);
    const handleRowDelete = useCallback((sId, rId) => setSections((prev) => prev.map((s) => s.id !== sId ? s : { ...s, rows: s.rows.filter((r) => r.id !== rId) })), []);
    const handleAddRow = useCallback((sId) => setSections((prev) => prev.map((s) => s.id !== sId ? s : { ...s, rows: [...s.rows, emptyRow()] })), []);
    const handleAddSection = () => setSections((prev) => [...prev, { id: uid(), name: `Section ${prev.length + 1}`, rows: [] }]);

    return (
        <div>
            {sections.map((sec) => <MaterialTable key={sec.id} section={sec} onRowChange={handleRowChange} onRowDelete={handleRowDelete} onAddRow={handleAddRow} />)}
            <button className="cwd-add-section-btn" onClick={handleAddSection}>+ Add Component Section</button>
        </div>
    );
};

export default SubStructure;
