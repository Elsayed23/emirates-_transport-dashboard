'use client'
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogOverlay, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

type RejectModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (reason: string) => void;
};

const RejectModal: React.FC<RejectModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [reason, setReason] = useState('');

    const handleSubmit = () => {
        onSubmit(reason);
        setReason('');
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Reject Request</DialogTitle>
                    <DialogDescription>Provide a reason for rejecting the request.</DialogDescription>
                </DialogHeader>
                <Textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Reason for rejection"
                    className="w-full mt-4"
                />
                <div className="flex justify-end mt-4">
                    <Button variant="secondary" onClick={onClose} className="mr-2">Cancel</Button>
                    <Button onClick={handleSubmit}>Submit</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default RejectModal;
