import React, { useState, useRef, useEffect } from 'react';
import { X, Check, Move, Maximize2 } from 'lucide-react';

const PhotoEditorModal = ({ imageFile, onSave, onCancel }) => {
    const [imgUrl, setImgUrl] = useState(null);
    const [box, setBox] = useState({ x: 50, y: 50, width: 150, height: 60 });
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
    const containerRef = useRef(null);
    const imageRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    useEffect(() => {
        if (imageFile) {
            const url = URL.createObjectURL(imageFile);
            setImgUrl(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [imageFile]);

    const handleImageLoad = (e) => {
        const { naturalWidth, naturalHeight } = e.target;
        setImageSize({ width: naturalWidth, height: naturalHeight });
    };

    const handleMouseDown = (e, type) => {
        e.preventDefault();
        if (type === 'drag') setIsDragging(true);
        if (type === 'resize') setIsResizing(true);
        
        const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
        
        setDragStart({ x: clientX, y: clientY, boxStart: { ...box } });
    };

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isDragging && !isResizing) return;

            const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
            const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;

            const deltaX = clientX - dragStart.x;
            const deltaY = clientY - dragStart.y;

            if (isDragging) {
                setBox(prev => ({
                    ...prev,
                    x: Math.max(0, dragStart.boxStart.x + deltaX),
                    y: Math.max(0, dragStart.boxStart.y + deltaY)
                }));
            } else if (isResizing) {
                setBox(prev => ({
                    ...prev,
                    width: Math.max(20, dragStart.boxStart.width + deltaX),
                    height: Math.max(10, dragStart.boxStart.height + deltaY)
                }));
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            setIsResizing(false);
        };

        if (isDragging || isResizing) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            window.addEventListener('touchmove', handleMouseMove);
            window.addEventListener('touchend', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchmove', handleMouseMove);
            window.removeEventListener('touchend', handleMouseUp);
        };
    }, [isDragging, isResizing, dragStart]);

    const handleSave = () => {
        const img = imageRef.current;
        if (!img) return;

        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        // Precise scale calculation
        const rect = img.getBoundingClientRect();
        const scaleX = img.naturalWidth / rect.width;
        const scaleY = img.naturalHeight / rect.height;

        console.log('--- Drawing Box on Canvas ---');
        console.log('Natural Size:', img.naturalWidth, 'x', img.naturalHeight);
        console.log('UI Render Size:', rect.width, 'x', rect.height);
        console.log('Scale:', scaleX, 'x', scaleY);
        console.log('UI Box Pos:', box.x, ',', box.y);
        console.log('Canvas Draw Pos:', box.x * scaleX, ',', box.y * scaleY);

        // Draw the black box with exact proportions
        ctx.fillStyle = 'black';
        ctx.fillRect(
            box.x * scaleX,
            box.y * scaleY,
            box.width * scaleX,
            box.height * scaleY
        );

        canvas.toBlob((blob) => {
            if (!blob) {
                console.error('Blob generation failed');
                alert('Error al generar la imagen editada');
                return;
            }
            console.log('Edited Blob size:', blob.size);
            const editedFile = new File([blob], imageFile?.name || 'edited-photo.jpg', { type: 'image/jpeg' });
            onSave(editedFile);
        }, 'image/jpeg', 0.95);
    };

    if (!imgUrl) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 sm:p-8">
            <div className="bg-white rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-full">
                <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
                    <h3 className="text-lg font-bold text-gray-800">Ocultar Patente</h3>
                    <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div 
                    ref={containerRef}
                    className="flex-1 overflow-auto bg-gray-200 relative p-4 flex items-center justify-center"
                    style={{ minHeight: '300px' }}
                >
                    <div className="relative inline-block shadow-lg">
                        <img 
                            ref={imageRef}
                            src={imgUrl} 
                            alt="Editar" 
                            className="max-w-full max-h-[60vh] block select-none"
                            onLoad={handleImageLoad}
                            draggable={false}
                            style={{ width: 'auto', height: 'auto' }}
                        />
                        
                        {/* The Draggable Black Box */}
                        <div 
                            style={{
                                position: 'absolute',
                                left: `${box.x}px`,
                                top: `${box.y}px`,
                                width: `${box.width}px`,
                                height: `${box.height}px`,
                                backgroundColor: 'black',
                                cursor: isDragging ? 'grabbing' : 'grab',
                                border: '2px solid #3b82f6',
                                touchAction: 'none'
                            }}
                            onMouseDown={(e) => handleMouseDown(e, 'drag')}
                            onTouchStart={(e) => handleMouseDown(e, 'drag')}
                        >
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <Move className="text-white/50 h-4 w-4" />
                            </div>
                            
                            {/* Resize Handle */}
                            <div 
                                className="absolute -right-2 -bottom-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center cursor-nwse-resize shadow-md z-10"
                                onMouseDown={(e) => {
                                    e.stopPropagation();
                                    handleMouseDown(e, 'resize');
                                }}
                                onTouchStart={(e) => {
                                    e.stopPropagation();
                                    handleMouseDown(e, 'resize');
                                }}
                            >
                                <Maximize2 className="text-white h-3 w-3" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-4 border-t flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50">
                    <p className="text-sm text-gray-500 italic text-center sm:text-left">
                        Arrastra y redimensiona el recuadro negro sobre la patente.
                    </p>
                    <div className="flex gap-3 w-full sm:w-auto">
                        <button 
                            onClick={onCancel}
                            className="flex-1 sm:flex-none px-6 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100 transition-all font-medium"
                        >
                            Cancelar
                        </button>
                        <button 
                            onClick={handleSave}
                            className="flex-1 sm:flex-none px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all shadow-md font-medium flex items-center justify-center"
                        >
                            <Check className="h-4 w-4 mr-2" />
                            Aplicar y Guardar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PhotoEditorModal;
