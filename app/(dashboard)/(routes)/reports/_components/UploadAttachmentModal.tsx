'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/app/context/AuthContext';
import axios from 'axios';
import { toast } from 'sonner';

const UploadAttachmentModal = ({ isOpen, onClose, inspectionId, setAttachmentAdded }: any) => {
    const [file, setFile] = useState<File | null>(null);
    const { user } = useAuth();

    const handleFileChange = (event: any) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            toast.error('Please select a file to upload');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('inspectionId', inspectionId);

        try {
            await axios.post('/api/reports/attachment/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            toast.success('Attachment uploaded successfully');
            setAttachmentAdded((prev: boolean) => !prev);
            onClose();
        } catch (error) {
            console.error('Error uploading attachment:', error);
            toast.error('Failed to upload attachment');
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Upload Attachment</DialogTitle>
                </DialogHeader>
                <Input type="file" onChange={handleFileChange} />
                <DialogFooter>
                    <Button onClick={handleUpload}>Upload</Button>
                    <Button variant="ghost" onClick={onClose}>Cancel</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default UploadAttachmentModal;
