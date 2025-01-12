import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

interface SuccessDialogProps {
    open: boolean;
    message: string;
    onClose: () => void;
    type: 'success' | 'error';
}

const SuccessOrErrorDialog: React.FC<SuccessDialogProps> = ({ open, message, onClose, type }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {type === 'success' && <CheckCircleIcon style={{ color: 'green', marginRight: 8 }} />}
                    {type === 'error' && <ErrorIcon style={{ color: 'red', marginRight: 8 }} />}
                    {type === 'success' ? 'Success' : 'Error'}
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

export default SuccessOrErrorDialog;