'use client';

import { useState, useRef, ChangeEvent } from 'react';

interface UploadedImage {
  url: string;
  fileName: string;
}

export default function ImageUpload() {
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [error, setError] = useState<string>('');
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Náhled obrázku
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!fileInputRef.current?.files?.[0]) {
      setError('Vyberte prosím soubor');
      return;
    }

    const file = fileInputRef.current.files[0];
    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    setError('');

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setUploadedImages([...uploadedImages, { url: data.url, fileName: data.fileName }]);
        setPreviewUrl('');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        alert('Obrázek byl úspěšně nahrán!');
      } else {
        setError(data.error || 'Nastala chyba při nahrávání');
      }
    } catch (error) {
      setError('Nastala chyba při nahrávání souboru');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(window.location.origin + url);
    alert('URL obrázku byla zkopírována do schránky!');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Nahrát obrázek</h2>
        
        {/* Upload sekce */}
        <div className="mb-8">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer inline-flex flex-col items-center"
            >
              <svg
                className="w-16 h-16 text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <span className="text-lg text-gray-600 mb-2">
                Klikněte pro výběr souboru
              </span>
              <span className="text-sm text-gray-500">
                PNG, JPG, GIF, WEBP (max. 5MB)
              </span>
            </label>
          </div>

          {/* Náhled */}
          {previewUrl && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Náhled:</h3>
              <img
                src={previewUrl}
                alt="Náhled"
                className="max-w-full h-auto rounded-lg shadow-md max-h-96 mx-auto"
              />
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={uploading || !previewUrl}
            className={`mt-6 w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors ${
              uploading || !previewUrl
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {uploading ? 'Nahrávám...' : 'Nahrát obrázek'}
          </button>
        </div>

        {/* Seznam nahraných obrázků */}
        {uploadedImages.length > 0 && (
          <div className="mt-8">
            <h3 className="text-2xl font-bold mb-4 text-gray-800">
              Nahrané obrázky ({uploadedImages.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {uploadedImages.map((image, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 bg-gray-50 hover:shadow-md transition-shadow"
                >
                  <img
                    src={image.url}
                    alt={image.fileName}
                    className="w-full h-48 object-cover rounded-lg mb-3"
                  />
                  <p className="text-sm text-gray-600 mb-2 truncate">
                    {image.fileName}
                  </p>
                  <button
                    onClick={() => copyToClipboard(image.url)}
                    className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Kopírovat URL
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

