import * as React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

type FullScreenImageModalProps = {
    isOpen: boolean;
    onClose: () => void;
    imageUrl: string;
};

const FullScreenImageModal: React.FC<FullScreenImageModalProps> = ({ isOpen, onClose, imageUrl }) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className='w-fit h-fit'>
                <div className="max-h-[450px] max-w-[520px]">
                    <img src={imageUrl} alt="Inspection" className='w-full h-full object-contain' />
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default FullScreenImageModal;
