import React, { useState, useCallback } from 'react';
import './FinancialData.css';

// ── Constants ────────────────────────────────────────────────────────────────

const BASE_DOCS_URL = 'https://yourdocs.com/financial/';

const FINANCIAL_FIELDS = [
    {
        key: 'discount_rate',
        label: 'Discount Rate',
        hint: 'The rate used to convert future cash flows into present value. It reflects the time value of money and investment risk.',
        type: 'float',
        min: 0.0,
        max: 100.0,
        step: 0.01,
        unit: '(%)',
        required: true,
        docSlug: 'discount-rate',
    },
    {
        key: 'inflation_rate',
        label: 'Inflation Rate',
        hint: 'Expected annual increase in general price levels over time.',
        type: 'float',
        min: 0.0,
        max: 100.0,
        step: 0.01,
        unit: '(%)',
        required: true,
        docSlug: 'inflation-rate',
    },
    {
        key: 'interest_rate',
        label: 'Interest Rate',
        hint: 'The borrowing or lending rate applied to capital financing.',
        type: 'float',
        min: 0.0,
        max: 100.0,
        step: 0.01,
        unit: '(%)',
        required: true,
        docSlug: 'interest-rate',
    },
    {
        key: 'investment_ratio',
        label: 'Investment Ratio',
        hint: 'Proportion of total cost financed through investment (0–1). Example: 0.5 means 50%.',
        type: 'float',
        min: 0.0,
        max: 1.0,
        step: 0.0001,
        unit: null,
        required: true,
        docSlug: 'investment-ratio',
    },
    {
        key: 'design_life',
        label: 'Design Life',
        hint: 'Expected operational lifetime of the system in years.',
        type: 'int',
        min: 0,
        max: 999,
        step: 1,
        unit: '(years)',
        required: true,
        docSlug: 'design-life',
    },
    {
        key: 'duration_of_construction',
        label: 'Duration of Construction',
        hint: 'Time required to complete construction before operation begins.',
        type: 'float',
        min: 0.0,
        max: 999.0,
        step: 0.01,
        unit: '(years)',
        required: false,
        docSlug: 'duration-of-construction',
    },
    {
        key: 'analysis_period',
        label: 'Analysis Period',
        hint: 'Total time horizon used for financial evaluation.',
        type: 'int',
        min: 0,
        max: 999,
        step: 1,
        unit: '(years)',
        required: true,
        docSlug: 'analysis-period',
    },
];

const SUGGESTED_VALUES = {
    discount_rate: 6.70,
    inflation_rate: 5.15,
    interest_rate: 7.75,
    investment_ratio: 0.5,
    design_life: 50,
    duration_of_construction: 0.0,
    analysis_period: 50,
};

const INITIAL_STATE = Object.fromEntries(
    FINANCIAL_FIELDS.map((f) => [f.key, ''])
);

const REQUIRED_KEYS = new Set(
    FINANCIAL_FIELDS.filter((f) => f.required).map((f) => f.key)
);

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionHeader({ title }) {
    return <div className="fd-section-header">{title}</div>;
}

function FieldHint({ text, docSlug }) {
    return (
        <div className="fd-hint">
            {text}
            {docSlug && (
                <a
                    href={`${BASE_DOCS_URL}${docSlug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="fd-docs-link"
                    title="View documentation"
                >
                    ⓘ
                </a>
            )}
        </div>
    );
}

function NumberField({ field, value, onChange, hasError }) {
    const { key, label, hint, docSlug, required, min, max, step, unit } = field;
    return (
        <div className="fd-field-group">
            <label htmlFor={key} className="fd-label">
                {label}{required && <span className="fd-required-star"> *</span>}
            </label>
            <FieldHint text={hint} docSlug={docSlug} />
            <div className={`fd-input-row${hasError ? ' fd-input-row--error' : ''}`}>
                <input
                    id={key}
                    type="number"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={(e) => onChange(key, e.target.value)}
                    className="fd-input-inner"
                />
                {unit && <span className="fd-unit">{unit}</span>}
            </div>
        </div>
    );
}

// ── Main Component ────────────────────────────────────────────────────────────

const FinancialData = ({ controller }) => {
    const [form, setForm] = useState(INITIAL_STATE);
    const [errors, setErrors] = useState(new Set());
    const [validationMsg, setValidationMsg] = useState('');

    // ── Handlers ─────────────────────────────────────────────────────────────

    const handleChange = useCallback((key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }));
        setErrors((prev) => {
            if (!prev.has(key)) return prev;
            const next = new Set(prev);
            next.delete(key);
            return next;
        });
        setValidationMsg('');
    }, []);

    const handleLoadSuggested = () => {
        setForm((prev) => ({
            ...prev, ...Object.fromEntries(
                Object.entries(SUGGESTED_VALUES).map(([k, v]) => [k, String(v)])
            )
        }));
        setErrors(new Set());
        setValidationMsg('');
        controller?.engine?._log('Financial: Suggested values applied.');
    };

    const handleClearAll = () => {
        setForm(INITIAL_STATE);
        setErrors(new Set());
        setValidationMsg('');
        controller?.engine?._log('Financial: All fields cleared.');
    };

    // ── Validation ────────────────────────────────────────────────────────────

    const validate = () => {
        const newErrors = new Set();
        const missing = [];

        REQUIRED_KEYS.forEach((key) => {
            const val = form[key];
            const isEmpty = val === '' || val === null || val === undefined;
            const isZero = !isEmpty && Number(val) <= 0;
            if (isEmpty || isZero) {
                newErrors.add(key);
                const field = FINANCIAL_FIELDS.find((f) => f.key === key);
                missing.push(field?.label ?? key);
            }
        });

        setErrors(newErrors);
        if (newErrors.size > 0) {
            const msg = `Missing required financial data: ${missing.join(', ')}`;
            setValidationMsg(msg);
            controller?.engine?._log(msg);
            return { valid: false, errors: missing };
        }

        setValidationMsg('');
        return { valid: true, errors: [] };
    };

    const hasError = (key) => errors.has(key);

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <div className="fd-wrapper">
            <SectionHeader title="Financial Parameters" />

            {FINANCIAL_FIELDS.map((field) => (
                <NumberField
                    key={field.key}
                    field={field}
                    value={form[field.key]}
                    onChange={handleChange}
                    hasError={hasError(field.key)}
                />
            ))}

            {/* ── Buttons ─────────────────────────────────────────────────── */}
            <div className="fd-btn-row">
                <button
                    className="fd-btn fd-btn--suggested"
                    onClick={handleLoadSuggested}
                >
                    Load Suggested Values
                </button>
                <button
                    className="fd-btn fd-btn--clear"
                    onClick={handleClearAll}
                >
                    Clear All
                </button>
            </div>

            {/* Validation message */}
            {validationMsg && (
                <div className="fd-error-msg">
                    ⚠ {validationMsg}
                </div>
            )}
        </div>
    );
};

export { FinancialData as default };
export { REQUIRED_KEYS, INITIAL_STATE, SUGGESTED_VALUES };
