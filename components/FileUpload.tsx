
import React, { useRef } from 'react';
import { PlusIcon } from './Icons';

interface FileUploadProps {
  onFileUpload: (fileContent: string, fileName: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        onFileUpload(content, file.name);
      };
      reader.onerror = () => {
        console.error("Failed to read file");
        alert("Error reading file. Please try again.");
      };
      reader.readAsText(file);
    }
     // Reset file input to allow uploading the same file again
    if(event.target) {
        event.target.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".java"
      />
      <button
        onClick={handleClick}
        className="w-full flex flex-col items-center justify-center p-8 border-2 border-dashed border-brand-secondary rounded-xl text-brand-secondary hover:bg-blue-50 hover:border-brand-primary hover:text-brand-primary transition-all duration-300 ease-in-out cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
      >
        <PlusIcon className="h-12 w-12" />
        <span className="mt-4 text-lg font-semibold">Upload Student's .java File</span>
        <span className="mt-1 text-sm">Click here or drag and drop</span>
      </button>
    </div>
  );
};

export default FileUpload;
