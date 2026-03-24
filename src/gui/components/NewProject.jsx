import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Select from 'react-select';
import { COUNTRIES, CURRENCIES } from './utils/countriesdata';

const countryOptions = COUNTRIES.map(c => ({ value: c, label: c }));
const currencyOptions = CURRENCIES.map(c => ({ value: c, label: c }));
const unitOptions = [
    { value: 'Metric (SI)', label: 'Metric (SI)' },
    { value: 'Imperial (US)', label: 'Imperial (US)' }
];

const customSelectStyles = {
    control: (provided, state) => ({
        ...provided,
        fontSize: '0.9rem',
        backgroundColor: '#36393f',
        borderColor: state.isFocused ? '#9ACD32' : '#202225',
        color: '#fff',
        minHeight: '36px',
        height: '36px',
        boxShadow: state.isFocused ? '0 0 0 1px #9ACD32' : 'none',
        '&:hover': {
            borderColor: state.isFocused ? '#9ACD32' : '#4f545c'
        }
    }),
    valueContainer: (provided) => ({
        ...provided,
        padding: '0 10px',
        height: '36px'
    }),
    input: (provided) => ({
        ...provided,
        color: '#fff',
        margin: '0px',
        padding: '0px'
    }),
    singleValue: (provided) => ({
        ...provided,
        color: '#b9bbbe'
    }),
    placeholder: (provided) => ({
        ...provided,
        color: '#72767d'
    }),
    menu: (provided) => ({
        ...provided,
        backgroundColor: '#2f3136',
        border: '1px solid #202225',
        zIndex: 9999
    }),
    option: (provided, state) => ({
        ...provided,
        fontSize: '0.9rem',
        backgroundColor: state.isFocused ? '#4f545c' : 'transparent',
        color: '#fff',
        cursor: 'pointer',
        padding: '6px 12px'
    }),
    indicatorSeparator: () => ({
        display: 'none'
    }),
    dropdownIndicator: (provided) => ({
        ...provided,
        color: '#b9bbbe',
        padding: '6px',
        '&:hover': {
            color: '#fff'
        }
    }),
    indicatorsContainer: (provided) => ({
        ...provided,
        height: '36px'
    })
};

const NewProject = ({ show, handleClose, onProjectOpen }) => {
    const [projectName, setProjectName] = useState('');
    const [country, setCountry] = useState(null);
    const [currency, setCurrency] = useState(null);
    const [unitSystem, setUnitSystem] = useState({ value: 'Metric (SI)', label: 'Metric (SI)' });
    const [validated, setValidated] = useState(false);

    const closeModal = () => {
        setValidated(false);
        handleClose();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setValidated(true);

        if (!projectName || !country || !currency || !unitSystem) {
            return;
        }

        console.log({
            projectName,
            country: country.value,
            currency: currency.value,
            unitSystem: unitSystem.value
        });

        setProjectName('');
        setCountry(null);
        setCurrency(null);
        setUnitSystem({ value: 'Metric (SI)', label: 'Metric (SI)' });
        setValidated(false);

        handleClose();
        if (onProjectOpen) onProjectOpen();
    };

    return (
        <Modal show={show} onHide={closeModal} centered backdrop="static" keyboard={false}>
            {/* Wrapping Modal content to force dark styling */}
            <div style={{ backgroundColor: '#2f3136', color: '#fff', borderRadius: '6px', overflow: 'hidden' }}>
                <Modal.Header closeButton style={{ borderBottom: 'none', paddingBottom: '0' }} className="custom-dark-modal-header pt-3 px-4">
                    <Modal.Title style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
                        <span style={{ display: 'inline-block', width: '12px', height: '12px', backgroundColor: '#8ea9a2', borderRadius: '2px' }}></span>
                        New Project
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="pt-2 px-4 pb-4">
                    <Form onSubmit={handleSubmit} noValidate>
                        <Form.Group className="mb-2">
                            <Form.Label className="fw-bold mb-1" style={{ fontSize: '0.85rem', color: '#fff' }}>Project Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="e.g. Highway 5 Bridge Replacement"
                                value={projectName}
                                onChange={(e) => setProjectName(e.target.value)}
                                style={{ 
                                    fontSize: '0.9rem', 
                                    backgroundColor: '#36393f', 
                                    color: '#b9bbbe', 
                                    borderColor: (validated && !projectName) ? '#dc3545' : '#202225', 
                                    minHeight: '36px',
                                    height: '36px',
                                    boxShadow: 'none'
                                }}
                                autoComplete="off"
                                isInvalid={validated && !projectName}
                                className="custom-dark-input"
                            />
                            <style>{`
                                .custom-dark-input:focus {
                                    border-color: #9ACD32 !important;
                                    box-shadow: 0 0 0 1px #9ACD32 !important;
                                    color: #fff !important;
                                }
                                .custom-dark-modal-header .btn-close {
                                    filter: invert(1) grayscale(100%) brightness(200%);
                                }
                            `}</style>
                            <Form.Control.Feedback type="invalid" style={{ fontSize: '0.75rem' }}>
                                Please enter a Project Name.
                            </Form.Control.Feedback>
                            {(!validated || projectName) && (
                                <Form.Text style={{ fontSize: '0.75rem', color: '#b9bbbe', display: 'block', marginTop: '2px' }}>
                                    You can rename this later.
                                </Form.Text>
                            )}
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Label className="fw-bold mb-1" style={{ fontSize: '0.85rem', color: '#fff' }}>Country</Form.Label>
                            <Select
                                options={countryOptions}
                                value={country}
                                onChange={setCountry}
                                placeholder="— Select country —"
                                styles={customSelectStyles}
                                menuPlacement="auto"
                                isSearchable
                            />
                            {validated && !country ? (
                                <div className="text-danger mt-1" style={{ fontSize: '0.75rem' }}>
                                    Please select a Country.
                                </div>
                            ) : (
                                <Form.Text style={{ fontSize: '0.75rem', color: '#b9bbbe', display: 'block', marginTop: '2px' }}>
                                    Cannot be changed after project creation.
                                </Form.Text>
                            )}
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Label className="fw-bold mb-1" style={{ fontSize: '0.85rem', color: '#fff' }}>Currency</Form.Label>
                            <Select
                                options={currencyOptions}
                                value={currency}
                                onChange={setCurrency}
                                placeholder="— Select currency —"
                                styles={customSelectStyles}
                                menuPlacement="auto"
                                isSearchable
                            />
                            {validated && !currency ? (
                                <div className="text-danger mt-1" style={{ fontSize: '0.75rem' }}>
                                    Please select a Currency.
                                </div>
                            ) : (
                                <Form.Text style={{ fontSize: '0.75rem', color: '#b9bbbe', display: 'block', marginTop: '2px' }}>
                                    Cannot be changed after project creation.
                                </Form.Text>
                            )}
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold mb-1" style={{ fontSize: '0.85rem', color: '#fff' }}>Unit System</Form.Label>
                            <Select
                                options={unitOptions}
                                value={unitSystem}
                                onChange={setUnitSystem}
                                placeholder="— Select unit system —"
                                styles={customSelectStyles}
                                menuPlacement="auto"
                                isSearchable={false}
                            />
                            {validated && !unitSystem ? (
                                <div className="text-danger mt-1" style={{ fontSize: '0.75rem' }}>
                                    Please select a Unit System.
                                </div>
                            ) : (
                                <Form.Text style={{ fontSize: '0.75rem', color: '#b9bbbe', display: 'block', marginTop: '2px' }}>
                                    Cannot be changed after project creation.
                                </Form.Text>
                            )}
                        </Form.Group>

                        <div className="d-flex justify-content-end gap-3 mt-3">
                            <Button 
                                variant="primary" 
                                type="submit" 
                                style={{ 
                                    backgroundColor: '#9ACD32', 
                                    borderColor: '#9ACD32', 
                                    color: '#000', 
                                    fontWeight: 'bold', 
                                    padding: '0.35rem 1.5rem', 
                                    borderRadius: '4px',
                                    fontSize: '0.9rem'
                                }}
                            >
                                OK
                            </Button>
                            <Button 
                                variant="secondary" 
                                onClick={closeModal} 
                                style={{ 
                                    backgroundColor: '#4f545c', 
                                    borderColor: '#4f545c', 
                                    color: '#fff', 
                                    fontWeight: 'normal', 
                                    padding: '0.35rem 1.25rem', 
                                    borderRadius: '4px',
                                    fontSize: '0.9rem'
                                }}
                            >
                                Cancel
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </div>
        </Modal>
    );
};

export default NewProject;