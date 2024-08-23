'use client'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
// 
const HowToUseModal = ({ isOpen, onClose, vidUrl, title }) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[640px]">
                <DialogHeader>
                    <DialogTitle>طريقة {title}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="aspect-video">
                        <video autoPlay controls className="w-full h-full" >
                            <source src={vidUrl} />
                            Your browser does not support the video tag...
                        </video>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default HowToUseModal;
