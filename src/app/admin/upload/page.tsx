import Link from 'next/link';
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
          <div className="flex justify-center gap-3 flex-wrap mt-4">
            <Link
              href="/admin/statistiky"
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
            >
              📊 Statistiky
            </Link>
            <Link
              href="/admin/rezervace"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              📅 Rezervace
            </Link>
          </div>
        </div>
        <ImageUpload />
      </div>
    </div>
  );
}

