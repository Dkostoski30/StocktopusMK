import React, { ReactNode } from "react";
import ReactDOM from "react-dom";
import "../../index.css";

interface ModalProps {
    isOpen: boolean;
    title: string;
    onClose: () => void;
    onSave: () => void;
    children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, title, onClose, onSave, children }) => {
    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-header">
                    <h2>{title}</h2>
                    <button onClick={onClose} className="close-button">&times;</button>
                </div>
                <div className="modal-body">{children}</div>
                <div className="modal-footer">
                    <button onClick={onClose} className="cancel-button">Cancel</button>
                    <button onClick={onSave} className="save-button">Save</button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default Modal;