import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { FaSave } from 'react-icons/fa';

const SaveCheckpointModal = ({ show, onHide, onSave }) => {
    const [label, setLabel] = useState('');
    const [notes, setNotes] = useState('');

    const handleSave = () => {
        if (!label.trim()) return;
        onSave({ label, notes, timestamp: new Date().toISOString() });
        setLabel('');
        setNotes('');
        onHide();
    };

    return (
        <Modal 
            show={show} 
            onHide={onHide} 
            centered 
            className="custom-save-modal"
            contentClassName="bg-dark text-light border-0"
            style={{ fontFamily: '"Segoe UI", system-ui, sans-serif' }}
        >
            <style>{`
                .custom-save-modal .modal-content {
                    background-color: #1e1e1e !important;
                    border-radius: 12px;
                    border: 1px solid #333 !important;
                }
                .custom-save-modal .form-control {
                    background-color: #2d2d2d;
                    border: 1px solid #444;
                    color: #eee;
                    font-size: 14px;
                }
                .custom-save-modal .form-control:focus {
                    background-color: #2d2d2d;
                    border-color: #9acd32;
                    box-shadow: 0 0 0 2px rgba(154, 205, 50, 0.25);
                    color: #fff;
                }
                .custom-save-modal .form-label {
                    color: #bbb;
                    font-size: 14px;
                    margin-bottom: 8px;
                }
                .btn-green-save {
                    background-color: #9acd32 !important;
                    border-color: #9acd32 !important;
                    color: #000 !important;
                    font-weight: 600;
                    padding: 8px 24px;
                }
                .btn-green-save:hover {
                    background-color: #a8d648 !important;
                }
                .btn-cancel-dark {
                    background-color: #333 !important;
                    border-color: #444 !important;
                    color: #ddd !important;
                }
                .btn-cancel-dark:hover {
                    background-color: #444 !important;
                }
            `}</style>

            <Modal.Header closeButton closeVariant="white" className="border-0 pb-0">
                <Modal.Title className="d-flex align-items-center gap-2" style={{ fontSize: '18px' }}>
                    <FaSave style={{ color: '#9179c6' }} /> Save Checkpoint
                </Modal.Title>
            </Modal.Header>

            <Modal.Body className="pt-3">
                <p style={{ color: '#aaa', fontSize: '14px', marginBottom: '20px' }}>
                    A checkpoint is a full snapshot of your current project data. 
                    You can restore it at any time from the Checkpoint Manager.
                </p>

                <Form>
                    <Form.Group className="mb-4 d-flex align-items-center">
                        <Form.Label className="me-3 mb-0" style={{ minWidth: '60px' }}>Label:</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder="e.g. before client review, v2 cost update" 
                            value={label}
                            onChange={(e) => setLabel(e.target.value)}
                            autoFocus
                        />
                    </Form.Group>

                    <Form.Group className="mb-4 d-flex">
                        <Form.Label className="me-3 mt-1" style={{ minWidth: '60px' }}>Notes:</Form.Label>
                        <Form.Control 
                            as="textarea" 
                            rows={3} 
                            placeholder="Optional notes about this snapshot..." 
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>

            <Modal.Footer className="border-0 pb-4 justify-content-center gap-3">
                <Button variant="secondary" className="btn-cancel-dark px-4" onClick={onHide}>
                    Cancel
                </Button>
                <Button className="btn-green-save" onClick={handleSave} disabled={!label.trim()}>
                    Save Checkpoint
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default SaveCheckpointModal;
