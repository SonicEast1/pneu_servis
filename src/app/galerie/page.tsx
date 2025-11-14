'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

// ============================================
// ZDE MŮŽETE UPRAVIT NÁZVY, KATEGORIE A URL OBRÁZKŮ
// ============================================
// Pro každý obrázek můžete nastavit:
// - title: Název, který se zobrazí v galerii
// - description: Popis obrázku
// - category: Kategorie obrázku
// - imageUrl: URL obrázku (pokud chcete použít jiný obrázek než ze složky gallery)
// Pokud není nastaveno, použije se výchozí hodnota
const imageMetadata: Record<string, { title?: string; description?: string; category?: string; imageUrl?: string }> = {
  // ============================================
  // PROZATÍMNÍ ALT OBRÁZKY - můžete přepsat imageUrl na skutečný obrázek
  // ============================================
  'foto1.jpg': { 
    title: 'Profesionální výměna', 
    description: 'Naše profesionální výměna pneumatik s moderním vybavením', 
    category: 'Výměna pneumatik',
    imageUrl: '/gallery/sonic.jpg' // PROZATÍMNÍ - přepište na '/gallery/foto1.jpg' když přidáte obrázek
  },
  'foto2.jpg': { 
    title: 'Vyvážení kol', 
    description: 'Precizní vyvážení kol pro klidnou jízdu bez vibrací', 
    category: 'Servis',
    imageUrl: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=600&fit=crop' // PROZATÍMNÍ - přepište na '/gallery/foto2.jpg' když přidáte obrázek
  },
  'foto3.jpg': { 
    title: 'Naše provozovna', 
    description: 'Moderní provozovna s profesionálním vybavením', 
    category: 'Provoz',
    imageUrl: 'https://images.unsplash.com/photo-1486754735734-325b5831c3ad?w=800&h=600&fit=crop' // PROZATÍMNÍ - přepište na '/gallery/foto3.jpg' když přidáte obrázek
  },
  'foto4.jpg': { 
    title: 'Skladové pneumatiky', 
    description: 'Široký sortiment pneumatik všech značek a rozměrů', 
    category: 'Pneumatiky',
    imageUrl: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=800&h=600&fit=crop' // PROZATÍMNÍ - přepište na '/gallery/foto4.jpg' když přidáte obrázek
  },
  'foto5.jpg': { 
    title: 'Montáž zimních pneu', 
    description: 'Rychlá a profesionální montáž zimních pneumatik', 
    category: 'Výměna pneumatik',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop' // PROZATÍMNÍ - přepište na '/gallery/foto5.jpg' když přidáte obrázek
  },
  'foto6.jpg': { 
    title: 'Kontrola tlaku', 
    description: 'Kontrola a dohuštění pneumatik pro optimální výkon', 
    category: 'Servis',
    imageUrl: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=600&fit=crop' // PROZATÍMNÍ - přepište na '/gallery/foto6.jpg' když přidáte obrázek
  },
  'foto7.jpg': { 
    title: 'Čekárna', 
    description: 'Pohodlná čekárna pro naše zákazníky', 
    category: 'Provoz',
    imageUrl: 'https://images.unsplash.com/photo-1486754735734-325b5831c3ad?w=800&h=600&fit=crop' // PROZATÍMNÍ - přepište na '/gallery/foto7.jpg' když přidáte obrázek
  },
  'foto8.jpg': { 
    title: 'Letní pneumatiky', 
    description: 'Kvalitní letní pneumatiky všech rozměrů', 
    category: 'Pneumatiky',
    imageUrl: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=800&h=600&fit=crop' // PROZATÍMNÍ - přepište na '/gallery/foto8.jpg' když přidáte obrázek
  },
  'foto9.jpg': { 
    title: 'Rychlá obsluha', 
    description: 'Rychlá a efektivní obsluha našich zákazníků', 
    category: 'Výměna pneumatik',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop' // PROZATÍMNÍ - přepište na '/gallery/foto9.jpg' když přidáte obrázek
  },
  'foto10.jpg': { 
    title: 'Oprava defektu', 
    description: 'Odborná oprava defektů a poškozených pneumatik', 
    category: 'Servis',
    imageUrl: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=600&fit=crop' // PROZATÍMNÍ - přepište na '/gallery/foto10.jpg' když přidáte obrázek
  },
  'foto11.jpg': { 
    title: 'Moderní vybavení', 
    description: 'Nejmodernější vybavení pro péči o vaše pneumatiky', 
    category: 'Provoz',
    imageUrl: 'https://images.unsplash.com/photo-1486754735734-325b5831c3ad?w=800&h=600&fit=crop' // PROZATÍMNÍ - přepište na '/gallery/foto11.jpg' když přidáte obrázek
  },
  'foto12.jpg': { 
    title: 'Celoroční pneu', 
    description: 'Celoroční pneumatiky pro každé počasí', 
    category: 'Pneumatiky',
    imageUrl: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=800&h=600&fit=crop' // PROZATÍMNÍ - přepište na '/gallery/foto12.jpg' když přidáte obrázek
  },
  // ============================================
  // Přidejte zde další obrázky podle potřeby
  // 'nazev_souboru.jpg': { 
  //   title: 'Název', 
  //   description: 'Popis', 
  //   category: 'Kategorie',
  //   imageUrl: 'https://placeholder-url.com' // nebo '/gallery/nazev_souboru.jpg'
  // },
  // ============================================
};

const categories = ['Všechny', 'Výměna pneumatik', 'Servis', 'Provoz', 'Pneumatiky'];
// ============================================

interface GalleryImage {
  fileName: string;
  url: string;
  title: string;
  description: string;
  category: string;
}

export default function GalleryPage() {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Všechny');
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Načíst obrázky ze složky
  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      // Zobrazit pouze obrázky, které mají nastaveno imageUrl v imageMetadata
      // Obrázky ze složky se automaticky nezobrazují, musí být explicitně nastaveny v kódu
      const images: GalleryImage[] = [];
      
      Object.keys(imageMetadata).forEach(fileName => {
        const metadata = imageMetadata[fileName];
        // Zobrazit pouze pokud má nastaveno imageUrl
        if (metadata.imageUrl) {
          const fileNameWithoutExt = fileName.replace(/\.[^/.]+$/, '');
          images.push({
            fileName: fileName,
            url: metadata.imageUrl, // Použije imageUrl z metadat
            title: metadata.title || fileNameWithoutExt,
            description: metadata.description || '',
            category: metadata.category || 'Všechny',
          });
        }
      });
      
      setGalleryImages(images);
    } catch (error) {
      console.error('Chyba při načítání obrázků:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredImages = selectedCategory === 'Všechny'
    ? galleryImages
    : galleryImages.filter(img => img.category === selectedCategory);

  const openLightbox = (fileName: string) => {
    setLightboxImage(fileName);
  };

  const closeLightbox = () => {
    setLightboxImage(null);
  };

  const nextImage = () => {
    if (lightboxImage === null || filteredImages.length === 0) return;
    const currentIndex = filteredImages.findIndex(img => img.fileName === lightboxImage);
    const nextIndex = (currentIndex + 1) % filteredImages.length;
    setLightboxImage(filteredImages[nextIndex].fileName);
  };

  const prevImage = () => {
    if (lightboxImage === null || filteredImages.length === 0) return;
    const currentIndex = filteredImages.findIndex(img => img.fileName === lightboxImage);
    const prevIndex = currentIndex === 0 ? filteredImages.length - 1 : currentIndex - 1;
    setLightboxImage(filteredImages[prevIndex].fileName);
  };

  const currentImage = galleryImages.find(img => img.fileName === lightboxImage);

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
  }, [lightboxImage, filteredImages]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative">
      {/* Background blur effect - celá stránka */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-orange-500 rounded-full blur-3xl animate-bg-float"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-orange-600 rounded-full blur-3xl animate-bg-float-delayed"></div>
          <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-yellow-500/60 rounded-full blur-3xl animate-bg-float"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-red-600/40 rounded-full blur-3xl animate-bg-float-delayed"></div>
        </div>
      </div>
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-b from-[#0a0a0a] via-[#1a1a1a] to-[#0f0f0f] relative overflow-hidden">
        {/* Obrázek s pneumatikou přes celou šířku - lze změnit v kódu */}
        {/* ============================================ */}
        {/* ZDE MŮŽETE ZMĚNIT OBRÁZEK: přepište '/pictures_web/upImg2.jpg' na váš obrázek */}
        {/* ============================================ */}
        <div className="absolute inset-0 w-full h-full opacity-20 md:opacity-30 pointer-events-none z-5">
          <Image
            src="/pictures_web/upImg2.jpg"
            alt="Pneumatika"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-black mb-6">
            <span className="gradient-text">Fotogalerie</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Podívejte se na práci a naše vybavení.
          </p>
        </div>
      </section>

      <div className="w-full py-16 bg-gradient-to-b from-[#0a0a0a] via-[#1a1a1a] to-[#0f0f0f] mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white border-2 border-orange-500'
                    : 'bg-transparent text-orange-500 border-2 border-orange-500 hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-600 hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-orange-500 mx-auto"></div>
              <p className="text-gray-400 mt-4">Načítání galerie...</p>
            </div>
          )}

          {/* Gallery Grid */}
          {!loading && (
            <div className="p-6 rounded-xl bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-orange-500/20 shadow-lg shadow-orange-500/10">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredImages.map((image, index) => (
                  <div
                    key={image.fileName}
                    className={`group relative aspect-square rounded-lg overflow-hidden cursor-pointer animate-fadeInUp stagger-${(index % 6) + 1}`}
                    onClick={() => openLightbox(image.fileName)}
                  >
                    {/* Obrázek */}
                    <Image
                      src={image.url}
                      alt={image.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      onError={(e) => {
                        // Pokud se obrázek nenačte, zobrazí se placeholder
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                    

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                      <span className="inline-block px-3 py-1 bg-orange-500 text-white text-xs font-semibold rounded-full mb-2 w-fit">
                        {image.category}
                      </span>
                      <h3 className="text-white font-bold text-lg mb-1">{image.title}</h3>
                      {image.description && (
                        <p className="text-gray-300 text-sm">{image.description}</p>
                      )}
                    </div>

                    {/* Hover Effect */}
                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-orange-500 transition-all duration-300 rounded-lg"></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredImages.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📷</div>
              <p className="text-gray-400 text-lg">Žádné fotografie v této kategorii</p>
              <p className="text-gray-500 text-sm mt-2">
                Přidejte obrázky do složky <code className="bg-[#1a1a1a] px-2 py-1 rounded">public/gallery/</code>
              </p>
            </div>
          )}
        </div>
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
            className="relative max-w-5xl w-full bg-[#1a1a1a] rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Obrázek */}
            <div className="relative aspect-video bg-[#0a0a0a]">
              <Image
                src={currentImage.url}
                alt={currentImage.title}
                fill
                className="object-contain"
                sizes="(max-width: 1280px) 100vw, 1280px"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>

            {/* Image Info */}
            <div className="p-6 bg-[#0a0a0a]">
              <div className="flex items-center justify-between">
                <div>
                  <span className="inline-block px-3 py-1 bg-orange-500 text-white text-sm font-semibold rounded-full mb-2">
                    {currentImage.category}
                  </span>
                  <h3 className="text-white text-xl font-bold">{currentImage.title}</h3>
                  {currentImage.description && (
                    <p className="text-gray-400 text-sm mt-1">{currentImage.description}</p>
                  )}
                </div>
                <div className="text-gray-400 text-sm">
                  {filteredImages.findIndex(img => img.fileName === lightboxImage) + 1} / {filteredImages.length}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <section className="section-padding mb-16 bg-gradient-to-r from-orange-500 via-red-600 via-yellow-500 to-orange-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Přesvědčili jsme vás?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Navštivte nás nebo si rezervujte termín online!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/rezervace"
              className="px-8 py-4 bg-white text-orange-600 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-xl"
            >
              Rezervovat termín
            </a>
            <a
              href="tel:+420602299090"
              className="px-8 py-4 bg-[#0a0a0a] text-white rounded-lg font-bold text-lg hover:bg-[#1a1a1a] transition-all duration-300 shadow-xl border-2 border-white/30 hover:border-white/50"
            >
              +420 602 299 090
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
