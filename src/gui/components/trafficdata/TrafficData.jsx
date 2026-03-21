import React, { useState, useRef, useEffect, useCallback } from 'react';
import './TrafficData.css';

// ── Constants ────────────────────────────────────────────────────────────────

const CALCULATION_MODES = ['GLOBAL', 'LOCAL'];

const INITIAL_STATE = {
    calculation_mode: '',
    road_user_cost_per_day: '',
    remarks: '',
};

// ── Custom Dropdown ───────────────────────────────────────────────────────────

function Dropdown({ id, options, value, onChange, placeholder = '— Select —' }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        if (!open) return;
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [open]);

    const select = (opt) => { onChange(opt); setOpen(false); };

    return (
        <div className="td-dropdown" ref={ref}>
            <button
                type="button"
                id={id}
                className="td-input td-dropdown-trigger"
                onClick={() => setOpen((o) => !o)}
                aria-haspopup="listbox"
                aria-expanded={open}
            >
                <span className={value ? '' : 'td-dropdown-placeholder'}>
                    {value || placeholder}
                </span>
                <span className={`td-dropdown-arrow${open ? ' td-dropdown-arrow--open' : ''}`}>▾</span>
            </button>
            {open && (
                <ul className="td-dropdown-list" role="listbox">
                    <li className="td-dropdown-item td-dropdown-item--placeholder" onClick={() => select('')}>
                        {placeholder}
                    </li>
                    {options.map((opt) => (
                        <li
                            key={opt}
                            role="option"
                            aria-selected={value === opt}
                            className={`td-dropdown-item${value === opt ? ' td-dropdown-item--selected' : ''}`}
                            onClick={() => select(opt)}
                        >
                            {opt}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

// ── Road User Cost Field ───────────────────────────────────────────────────────

function RoadUserCostField({ value, onChange }) {
    return (
        <div className="td-field-group">
            <label className="td-label">Road User Cost per Day</label>
            <div className="td-input-with-unit">
                <input
                    type="number"
                    min={0}
                    step={0.01}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="td-cost-input-inner"
                    placeholder="0.00"
                />
                <span className="td-unit">/ day</span>
            </div>
        </div>
    );
}

// ── Rich Text Editor ──────────────────────────────────────────────────────────

function RichTextEditor({ value, onChange }) {
    const editorRef = useRef(null);

    const exec = (command, arg = null) => {
        editorRef.current?.focus();
        document.execCommand(command, false, arg);
    };

    const handleInput = () => {
        onChange(editorRef.current?.innerHTML ?? '');
    };

    const insertTable = () => {
        const rows = 3, cols = 3;
        let html = '<table border="1" style="border-collapse:collapse;width:100%">';
        for (let r = 0; r < rows; r++) {
            html += '<tr>';
            for (let c = 0; c < cols; c++) {
                html += r === 0
                    ? '<th style="padding:4px 8px;background:var(--app-bg-alt)">&nbsp;</th>'
                    : '<td style="padding:4px 8px">&nbsp;</td>';
            }
            html += '</tr>';
        }
        html += '</table><br>';
        document.execCommand('insertHTML', false, html);
    };

    const insertRow = () => {
        const sel = window.getSelection();
        if (!sel || sel.rangeCount === 0) return;
        const cell = sel.anchorNode?.parentElement?.closest('td, th');
        const row = cell?.closest('tr');
        if (!row) return;
        const colCount = row.cells.length;
        const newRow = document.createElement('tr');
        for (let i = 0; i < colCount; i++) {
            const td = document.createElement('td');
            td.style.padding = '4px 8px';
            td.innerHTML = '&nbsp;';
            newRow.appendChild(td);
        }
        row.parentElement.insertBefore(newRow, row.nextSibling);
        onChange(editorRef.current?.innerHTML ?? '');
    };

    const insertCol = () => {
        const sel = window.getSelection();
        if (!sel || sel.rangeCount === 0) return;
        const cell = sel.anchorNode?.parentElement?.closest('td, th');
        const row = cell?.closest('tr');
        const table = row?.closest('table');
        if (!table) return;
        const cellIndex = cell ? Array.from(row.cells).indexOf(cell) + 1 : -1;
        Array.from(table.rows).forEach((tr, rowIdx) => {
            const newCell = rowIdx === 0
                ? document.createElement('th')
                : document.createElement('td');
            newCell.style.padding = '4px 8px';
            if (rowIdx === 0) newCell.style.background = 'var(--app-bg-alt)';
            newCell.innerHTML = '&nbsp;';
            if (cellIndex >= 0 && cellIndex < tr.cells.length) {
                tr.insertBefore(newCell, tr.cells[cellIndex]);
            } else {
                tr.appendChild(newCell);
            }
        });
        onChange(editorRef.current?.innerHTML ?? '');
    };

    const TOOLBAR = [
        { label: 'B',       title: 'Bold',             action: () => exec('bold'),             style: { fontWeight: 'bold' } },
        { label: 'I',       title: 'Italic',           action: () => exec('italic'),           style: { fontStyle: 'italic' } },
        { label: 'U',       title: 'Underline',        action: () => exec('underline'),        style: { textDecoration: 'underline' } },
        { label: 'S',       title: 'Strikethrough',    action: () => exec('strikeThrough'),    style: { textDecoration: 'line-through' } },
        null,
        { label: 'Left',    title: 'Align Left',       action: () => exec('justifyLeft') },
        { label: 'Center',  title: 'Align Center',     action: () => exec('justifyCenter') },
        { label: 'Right',   title: 'Align Right',      action: () => exec('justifyRight') },
        { label: 'Justify', title: 'Justify',          action: () => exec('justifyFull') },
        null,
        { label: '• List',  title: 'Bullet List',      action: () => exec('insertUnorderedList') },
        { label: '1. List', title: 'Numbered List',    action: () => exec('insertOrderedList') },
        null,
        { label: '+ Table', title: 'Insert 3×3 Table', action: insertTable },
        { label: '+ Row',   title: 'Insert Row Below', action: insertRow },
        { label: '+ Col',   title: 'Insert Column Right', action: insertCol },
        { label: 'Clear',   title: 'Clear Formatting', action: () => exec('removeFormat') },
    ];

    return (
        <div className="td-field-group">
            <label className="td-label">Remarks / Notes</label>
            <div className="td-rte-wrapper">
                <div className="td-rte-toolbar">
                    {TOOLBAR.map((btn, i) =>
                        btn === null
                            ? <div key={`div-${i}`} className="td-rte-divider" />
                            : (
                                <button
                                    key={btn.label}
                                    type="button"
                                    title={btn.title}
                                    className="td-rte-btn"
                                    style={btn.style}
                                    onMouseDown={(e) => { e.preventDefault(); btn.action(); }}
                                >
                                    {btn.label}
                                </button>
                            )
                    )}
                </div>
                <div
                    ref={editorRef}
                    className="td-rte-body"
                    contentEditable
                    suppressContentEditableWarning
                    data-placeholder="Add notes or remarks here. These will appear in the generated report."
                    onInput={handleInput}
                />
            </div>
        </div>
    );
}

// ── Main Component ────────────────────────────────────────────────────────────

const TrafficData = ({ controller }) => {
    const [form, setForm] = useState(INITIAL_STATE);
    const [errors, setErrors] = useState(new Set());
    const [validationMsg, setValidationMsg] = useState('');

    const clearErrors = useCallback((key) => {
        setErrors((prev) => {
            if (!prev.has(key)) return prev;
            const next = new Set(prev); next.delete(key); return next;
        });
        setValidationMsg('');
    }, []);

    const handleModeChange = (val) => {
        setForm((prev) => ({ ...prev, calculation_mode: val }));
        clearErrors('calculation_mode');
    };

    const handleCostChange = (val) => {
        setForm((prev) => ({ ...prev, road_user_cost_per_day: val }));
    };

    const handleRemarksChange = (html) => {
        setForm((prev) => ({ ...prev, remarks: html }));
    };

    const handleClearAll = () => {
        setForm(INITIAL_STATE);
        setErrors(new Set());
        setValidationMsg('');
        controller?.engine?._log('Traffic: All fields cleared.');
    };

    // ── Validation ────────────────────────────────────────────────────────────

    const validate = () => {
        const newErrors = new Set();
        const missing = [];

        if (!form.calculation_mode) {
            newErrors.add('calculation_mode');
            missing.push('Calculation Mode');
        }

        setErrors(newErrors);
        if (newErrors.size > 0) {
            const msg = `Missing required traffic data: ${missing.join(', ')}`;
            setValidationMsg(msg);
            controller?.engine?._log(msg);
            return { valid: false, errors: missing };
        }
        setValidationMsg('');
        return { valid: true, errors: [] };
    };

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <div className="td-wrapper">
            <div className="td-section-header">Traffic Parameters</div>

            {/* Calculation Mode */}
            <div className="td-field-group">
                <label htmlFor="calc_mode" className="td-label">
                    Calculation Mode <span className="td-required-star">*</span>
                </label>
                <Dropdown
                    id="calc_mode"
                    options={CALCULATION_MODES}
                    value={form.calculation_mode}
                    onChange={handleModeChange}
                />
                {errors.has('calculation_mode') && (
                    <div style={{ fontSize: '0.78rem', color: '#e74c3c', marginTop: '4px' }}>
                        Calculation mode is required.
                    </div>
                )}
            </div>

            {/* Road User Cost per Day */}
            <RoadUserCostField value={form.road_user_cost_per_day} onChange={handleCostChange} />

            {/* Remarks / Notes */}
            <RichTextEditor value={form.remarks} onChange={handleRemarksChange} />

            {/* Buttons */}
            <div className="td-btn-row">
                <button className="td-btn td-btn--clear" onClick={handleClearAll}>
                    Clear All
                </button>
            </div>

            {validationMsg && (
                <div className="td-error-msg">⚠ {validationMsg}</div>
            )}
        </div>
    );
};

export default TrafficData;
export { INITIAL_STATE };
