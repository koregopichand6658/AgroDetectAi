import React, { useCallback, useState, useRef } from 'react';
import { Upload, Camera, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelected: (base64: string) => void;
  isAnalyzing: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected, isAnalyzing }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
        onImageSelected(result);
      };
      reader.readAsDataURL(file);
    }
  }, [onImageSelected]);

  const onDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const clearImage = () => {
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    // Optional: notify parent to clear
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {preview ? (
        <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-white">
          <img src={preview} alt="Plant preview" className="w-full h-64 md:h-96 object-cover" />
          {!isAnalyzing && (
             <button 
             onClick={clearImage}
             className="absolute top-4 right-4 bg-white/90 p-2 rounded-full text-slate-700 hover:text-red-600 hover:bg-white transition-all shadow-sm"
           >
             <X size={24} />
           </button>
          )}
         
          {isAnalyzing && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm">
              <div className="text-white flex flex-col items-center animate-pulse">
                <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="font-medium text-lg">Analyzing Plant Health...</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div
          onDragEnter={onDrag}
          onDragLeave={onDrag}
          onDragOver={onDrag}
          onDrop={onDrop}
          className={`
            relative group cursor-pointer
            border-2 border-dashed rounded-3xl p-10
            flex flex-col items-center justify-center text-center
            transition-all duration-300 ease-in-out
            ${dragActive ? 'border-green-500 bg-green-50' : 'border-slate-300 hover:border-green-400 hover:bg-slate-50'}
          `}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Upload size={32} />
          </div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">Upload Plant Image</h3>
          <p className="text-slate-500 max-w-sm mb-6">
            Drag and drop your image here, or click to browse files.
            <br/><span className="text-xs text-slate-400">Supported formats: JPG, PNG</span>
          </p>
          
          <div className="flex gap-4">
             <button className="px-6 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg shadow-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2 pointer-events-none">
                <ImageIcon size={18} />
                Select File
             </button>
             {/* Note: In a real app, you'd trigger a native camera capture if on mobile, or use getUserMedia. 
                 File input with capture='environment' works for mobile browsers. */}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleChange}
          />
        </div>
      )}
    </div>
  );
};
