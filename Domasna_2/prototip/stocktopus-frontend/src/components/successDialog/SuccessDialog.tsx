import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface SuccessDialogProps {
    open: boolean;
    message: string;
    onClose: () => void;
}

const SuccessDialog: React.FC<SuccessDialogProps> = ({ open, message, onClose }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <CheckCircleIcon style={{ color: 'green', marginRight: 8 }} />
                    Success
                </div>
            </DialogTitle>
            <DialogContent>
                <DialogContentText>{message}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary" autoFocus>
                    OK
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default SuccessDialog;
