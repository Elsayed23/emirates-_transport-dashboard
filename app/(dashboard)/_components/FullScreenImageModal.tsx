import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

type FullScreenImageModalProps = {
    isOpen: boolean;
    onClose: () => void;
    imageUrl: string;
};

const FullScreenImageModal: React.FC<FullScreenImageModalProps> = ({ isOpen, onClose, imageUrl }) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>

            <DialogContent className='w-fit h-fit'>
                <DialogHeader>
                    <DialogTitle>
                        Image
                    </DialogTitle>
                </DialogHeader>
                <div className="min-h-[450px] max-h-[500px] min-w-full">
                    <img src={imageUrl} alt="Inspection" className='w-full h-full object-contain' />
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default FullScreenImageModal;
