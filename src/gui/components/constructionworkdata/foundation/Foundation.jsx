import React, { useState, useCallback } from 'react';
import '../ConstructionWorkData.css';

// ── Helpers ───────────────────────────────────────────────────────────────────

let _uid = 0;
const uid = () => `row-${++_uid}`;

const emptyRow = () => ({
    id: uid(),
    workName: '',
    rate: '',
    qty: '',
    source: '',
});

const calcTotal = (row) => {
    const r = parseFloat(row.rate) || 0;
    const q = parseFloat(row.qty) || 0;
    return (r * q).toFixed(2);
};

// ── Default sections for Foundation ──────────────────────────────────────────

const DEFAULT_SECTIONS = [
    { id: 'excavation', name: 'Excavation', rows: [] },
    { id: 'pile',       name: 'Pile',       rows: [] },
    { id: 'pile-cap',   name: 'Pile Cap',   rows: [] },
];

// ── MaterialTable sub-component ───────────────────────────────────────────────

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
                            <tr>
                                <td colSpan={6} style={{ textAlign: 'center', color: 'var(--app-text-muted)', padding: '18px', fontStyle: 'italic', fontSize: '0.78rem' }}>
                                    No items yet. Click "Add Material" below.
                                </td>
                            </tr>
                        ) : (
                            section.rows.map((row) => (
                                <tr key={row.id}>
                                    <td>
                                        <input
                                            className="cwd-cell-input"
                                            type="text"
                                            value={row.workName}
                                            placeholder="Work name..."
                                            onChange={(e) => onRowChange(section.id, row.id, 'workName', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            className="cwd-cell-input"
                                            type="number"
                                            min={0}
                                            step={0.01}
                                            value={row.rate}
                                            placeholder="0.00"
                                            onChange={(e) => onRowChange(section.id, row.id, 'rate', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            className="cwd-cell-input"
                                            type="number"
                                            min={0}
                                            step={0.01}
                                            value={row.qty}
                                            placeholder="0"
                                            onChange={(e) => onRowChange(section.id, row.id, 'qty', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            className="cwd-cell-input"
                                            type="text"
                                            value={row.source}
                                            placeholder="Source..."
                                            onChange={(e) => onRowChange(section.id, row.id, 'source', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <span className="cwd-cell-total">{calcTotal(row)}</span>
                                    </td>
                                    <td>
                                        <button
                                            className="cwd-delete-btn"
                                            title="Delete row"
                                            onClick={() => onRowDelete(section.id, row.id)}
                                        >
                                            ✕
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <button
                className="cwd-add-material-btn"
                onClick={() => onAddRow(section.id)}
            >
                Add Material to {section.name}
            </button>
        </fieldset>
    );
}

// ── Foundation main component ─────────────────────────────────────────────────

const Foundation = ({ controller }) => {
    const [sections, setSections] = useState(DEFAULT_SECTIONS);

    const handleRowChange = useCallback((sectionId, rowId, field, value) => {
        setSections((prev) =>
            prev.map((sec) =>
                sec.id !== sectionId ? sec : {
                    ...sec,
                    rows: sec.rows.map((r) =>
                        r.id !== rowId ? r : { ...r, [field]: value }
                    ),
                }
            )
        );
    }, []);

    const handleRowDelete = useCallback((sectionId, rowId) => {
        setSections((prev) =>
            prev.map((sec) =>
                sec.id !== sectionId ? sec : {
                    ...sec,
                    rows: sec.rows.filter((r) => r.id !== rowId),
                }
            )
        );
    }, []);

    const handleAddRow = useCallback((sectionId) => {
        setSections((prev) =>
            prev.map((sec) =>
                sec.id !== sectionId ? sec : {
                    ...sec,
                    rows: [...sec.rows, emptyRow()],
                }
            )
        );
    }, []);

    const handleAddSection = () => {
        const name = `Section ${sections.length + 1}`;
        setSections((prev) => [
            ...prev,
            { id: uid(), name, rows: [] },
        ]);
    };

    return (
        <div>
            {sections.map((sec) => (
                <MaterialTable
                    key={sec.id}
                    section={sec}
                    onRowChange={handleRowChange}
                    onRowDelete={handleRowDelete}
                    onAddRow={handleAddRow}
                />
            ))}

            <button className="cwd-add-section-btn" onClick={handleAddSection}>
                + Add Component Section
            </button>
        </div>
    );
};

export default Foundation;
