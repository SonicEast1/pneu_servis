'use client';

import { useState, useEffect } from 'react';

const categories = ['Všechny', 'Výměna pneumatik', 'Servis', 'Provoz', 'Pneumatiky'];

const galleryImages = [
  { id: 1, category: 'Výměna pneumatik', title: 'Profesionální výměna', description: 'Lorem ipsum dolor sit amet' },
  { id: 2, category: 'Servis', title: 'Vyvážení kol', description: 'Lorem ipsum dolor sit amet' },
  { id: 3, category: 'Provoz', title: 'Naše provozovna', description: 'Lorem ipsum dolor sit amet' },
  { id: 4, category: 'Pneumatiky', title: 'Skladové pneumatiky', description: 'Lorem ipsum dolor sit amet' },
  { id: 5, category: 'Výměna pneumatik', title: 'Montáž zimních pneu', description: 'Lorem ipsum dolor sit amet' },
  { id: 6, category: 'Servis', title: 'Kontrola tlaku', description: 'Lorem ipsum dolor sit amet' },
  { id: 7, category: 'Provoz', title: 'Čekárna', description: 'Lorem ipsum dolor sit amet' },
  { id: 8, category: 'Pneumatiky', title: 'Letní pneumatiky', description: 'Lorem ipsum dolor sit amet' },
  { id: 9, category: 'Výměna pneumatik', title: 'Rychlá obsluha', description: 'Lorem ipsum dolor sit amet' },
  { id: 10, category: 'Servis', title: 'Oprava defektu', description: 'Lorem ipsum dolor sit amet' },
  { id: 11, category: 'Provoz', title: 'Moderní vybavení', description: 'Lorem ipsum dolor sit amet' },
  { id: 12, category: 'Pneumatiky', title: 'Celoroční pneu', description: 'Lorem ipsum dolor sit amet' },
];

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState('Všechny');
  const [lightboxImage, setLightboxImage] = useState<number | null>(null);

  const filteredImages = selectedCategory === 'Všechny'
    ? galleryImages
    : galleryImages.filter(img => img.category === selectedCategory);

  const openLightbox = (id: number) => {
    setLightboxImage(id);
  };

  const closeLightbox = () => {
    setLightboxImage(null);
  };

  const nextImage = () => {
    if (lightboxImage === null) return;
    const currentIndex = filteredImages.findIndex(img => img.id === lightboxImage);
    const nextIndex = (currentIndex + 1) % filteredImages.length;
    setLightboxImage(filteredImages[nextIndex].id);
  };

  const prevImage = () => {
    if (lightboxImage === null) return;
    const currentIndex = filteredImages.findIndex(img => img.id === lightboxImage);
    const prevIndex = currentIndex === 0 ? filteredImages.length - 1 : currentIndex - 1;
    setLightboxImage(filteredImages[prevIndex].id);
  };

  const currentImage = galleryImages.find(img => img.id === lightboxImage);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (lightboxImage === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxImage]);

  return (
    <div className="min-h-screen bg-neutral-900 relative">
      {/* Background blur effect - celá stránka */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-orange-500 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-orange-600 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-yellow-500/60 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-600 rounded-full blur-3xl"></div>
        </div>
      </div>
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-b from-neutral-800 via-neutral-800/80 to-neutral-900">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-black mb-6">
            <span className="gradient-text">Fotogalerie</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Podívejte se na naši práci a vybavení našeho servisu.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-b from-neutral-900 via-neutral-900 to-neutral-900/95">
        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover-lift ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg shadow-orange-500/50 scale-105'
                  : 'bg-neutral-800 text-gray-300 hover:bg-neutral-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredImages.map((image, index) => (
            <div
              key={image.id}
              className={`group relative aspect-square rounded-xl overflow-hidden cursor-pointer hover-lift animate-fadeInUp stagger-${(index % 6) + 1}`}
              onClick={() => openLightbox(image.id)}
            >
              {/* Placeholder with gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-red-600/20 to-brown-600/20 flex items-center justify-center">
                <div className="text-center p-6">
                  <div className="text-6xl mb-4">📷</div>
                  <p className="text-white font-semibold text-sm">{image.title}</p>
                </div>
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <span className="inline-block px-3 py-1 bg-orange-500 text-white text-xs font-semibold rounded-full mb-2 w-fit">
                  {image.category}
                </span>
                <h3 className="text-white font-bold text-lg mb-1">{image.title}</h3>
                <p className="text-gray-300 text-sm">{image.description}</p>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-orange-500 transition-all duration-300 rounded-xl"></div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredImages.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📷</div>
            <p className="text-gray-400 text-lg">Žádné fotografie v této kategorii</p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxImage !== null && currentImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 animate-fadeIn"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white text-2xl transition-colors z-10"
          >
            ×
          </button>

          {/* Previous Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            className="absolute left-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white text-2xl transition-colors z-10"
          >
            ‹
          </button>

          {/* Next Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            className="absolute right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white text-2xl transition-colors z-10"
          >
            ›
          </button>

          {/* Image Container */}
          <div
            className="relative max-w-5xl w-full bg-neutral-800 rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image Placeholder */}
            <div className="aspect-video bg-gradient-to-br from-orange-500/30 via-red-600/30 to-brown-600/30 flex items-center justify-center">
              <div className="text-center p-8">
                <div className="text-9xl mb-6">📷</div>
                <h3 className="text-white text-3xl font-bold mb-2">{currentImage.title}</h3>
                <p className="text-gray-300 text-lg">{currentImage.description}</p>
              </div>
            </div>

            {/* Image Info */}
            <div className="p-6 bg-neutral-900">
              <div className="flex items-center justify-between">
                <div>
                  <span className="inline-block px-3 py-1 bg-orange-500 text-white text-sm font-semibold rounded-full mb-2">
                    {currentImage.category}
                  </span>
                  <h3 className="text-white text-xl font-bold">{currentImage.title}</h3>
                </div>
                <div className="text-gray-400 text-sm">
                  {filteredImages.findIndex(img => img.id === lightboxImage) + 1} / {filteredImages.length}
                </div>
              </div>
            </div>
          </div>

          {/* Keyboard hint */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-gray-400 text-sm">
            Použijte šipky pro navigaci • ESC pro zavření
          </div>
        </div>
      )}

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-orange-500 via-red-600 to-brown-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Přesvědčili jsme vás?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Navštivte nás nebo si rezervujte termín online!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/rezervace"
              className="px-8 py-4 bg-white text-orange-600 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              Rezervovat termín
            </a>
            <a
              href="tel:+420602299090"
              className="px-8 py-4 bg-neutral-900 text-white rounded-lg font-bold text-lg hover:bg-neutral-800 transition-all duration-300 shadow-xl"
            >
              +420 602 299 090
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

