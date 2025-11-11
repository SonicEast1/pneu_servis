import ImageUpload from '@/components/ImageUpload';

export default function UploadPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Správa obrázků
          </h1>
          <p className="text-gray-600">
            Nahrajte obrázky pro použití na webu
          </p>
        </div>
        <ImageUpload />
      </div>
    </div>
  );
}

