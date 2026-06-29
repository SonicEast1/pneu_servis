'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import TechBackground from '@/components/TechBackground';
import { CONTACT_INFO } from '@/constants/contact';
import MascotCTA from '@/components/MascotCTA';

const imageMetadata: Record<string, { title?: string; description?: string; category?: string; imageUrl?: string }> = {
  'foto1.jpg': { title: 'Profesionální výměna', description: 'Naše profesionální výměna pneumatik s moderním vybavením', category: 'Výměna pneumatik', imageUrl: '/gallery/sonic.jpg' },
  'foto2.jpg': { title: 'Vyvážení kol', description: 'Precizní vyvážení kol pro klidnou jízdu bez vibrací', category: 'Servis', imageUrl: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=600&fit=crop' },
  'foto3.jpg': { title: 'Naše provozovna', description: 'Moderní provozovna s profesionálním vybavením', category: 'Provoz', imageUrl: 'https://images.unsplash.com/photo-1486754735734-325b5831c3ad?w=800&h=600&fit=crop' },
  'foto4.jpg': { title: 'Skladové pneumatiky', description: 'Široký sortiment pneumatik všech značek a rozměrů', category: 'Pneumatiky', imageUrl: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=800&h=600&fit=crop' },
  'foto5.jpg': { title: 'Montáž zimních pneu', description: 'Rychlá a profesionální montáž zimních pneumatik', category: 'Výměna pneumatik', imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop' },
  'foto6.jpg': { title: 'Kontrola tlaku', description: 'Kontrola a dohuštění pneumatik pro optimální výkon', category: 'Servis', imageUrl: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=600&fit=crop' },
  'foto7.jpg': { title: 'Čekárna', description: 'Pohodlná čekárna pro naše zákazníky', category: 'Provoz', imageUrl: 'https://images.unsplash.com/photo-1486754735734-325b5831c3ad?w=800&h=600&fit=crop' },
  'foto8.jpg': { title: 'Letní pneumatiky', description: 'Kvalitní letní pneumatiky všech rozměrů', category: 'Pneumatiky', imageUrl: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=800&h=600&fit=crop' },
  'foto9.jpg': { title: 'Rychlá obsluha', description: 'Rychlá a efektivní obsluha zákazníků', category: 'Výměna pneumatik', imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop' },
  'foto10.jpg': { title: 'Oprava defektu', description: 'Odborná oprava defektů a poškozených pneumatik', category: 'Servis', imageUrl: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=600&fit=crop' },
  'foto11.jpg': { title: 'Moderní vybavení', description: 'Nejmodernější vybavení pro péči o vaše pneumatiky', category: 'Provoz', imageUrl: 'https://images.unsplash.com/photo-1486754735734-325b5831c3ad?w=800&h=600&fit=crop' },
  'foto12.jpg': { title: 'Celoroční pneu', description: 'Celoroční pneumatiky pro každé počasí', category: 'Pneumatiky', imageUrl: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=800&h=600&fit=crop' },
};

const categories = ['Všechny', 'Výměna pneumatik', 'Servis', 'Provoz', 'Pneumatiky'];

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

  useEffect(() => {
    const images: GalleryImage[] = Object.keys(imageMetadata)
      .filter(f => imageMetadata[f].imageUrl)
      .map(f => ({
        fileName: f,
        url: imageMetadata[f].imageUrl!,
        title: imageMetadata[f].title || f,
        description: imageMetadata[f].description || '',
        category: imageMetadata[f].category || 'Všechny',
      }));
    setGalleryImages(images);
    setLoading(false);
  }, []);

  const filteredImages = selectedCategory === 'Všechny'
    ? galleryImages
    : galleryImages.filter(img => img.category === selectedCategory);

  const currentImage = galleryImages.find(img => img.fileName === lightboxImage);

  const nextImage = () => {
    if (!lightboxImage || filteredImages.length === 0) return;
    const i = filteredImages.findIndex(img => img.fileName === lightboxImage);
    setLightboxImage(filteredImages[(i + 1) % filteredImages.length].fileName);
  };

  const prevImage = () => {
    if (!lightboxImage || filteredImages.length === 0) return;
    const i = filteredImages.findIndex(img => img.fileName === lightboxImage);
    setLightboxImage(filteredImages[i === 0 ? filteredImages.length - 1 : i - 1].fileName);
  };

  useEffect(() => {
    if (!lightboxImage) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxImage(null);
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightboxImage, filteredImages]);

  return (
    <TechBackground>
      {/* Hero */}
      <section className="relative border-b border-theme py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <Image src="/pictures_web/hero_tire.png" alt="" fill className="object-cover" sizes="100vw" priority />
          <div className="absolute inset-0" style={{ background: 'var(--hero-overlay)' }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="section-tag justify-center mb-4 animate-fadeInUp">Fotogalerie</p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-theme mb-5 animate-fadeInUp stagger-1">
            Naše <span className="gradient-tech">práce</span>
          </h1>
          <p className="text-theme-secondary text-lg max-w-2xl mx-auto animate-fadeInUp stagger-2">
            Podívejte se na ukázky naší práce a vybavení provozovny.
          </p>
        </div>
      </section>

      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 font-display font-semibold text-sm border-2 rounded transition-all ${
                  selectedCategory === cat
                    ? 'bg-accent border-accent text-white'
                    : 'border-[var(--border-strong)] text-theme hover:border-accent hover:text-accent'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Loading */}
          {loading && (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-[var(--accent)] mx-auto mb-4" />
              <p className="text-theme-muted">Načítání galerie...</p>
            </div>
          )}

          {/* Gallery Grid */}
          {!loading && filteredImages.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredImages.map((image, index) => (
                <div
                  key={image.fileName}
                  className={`group relative aspect-square overflow-hidden cursor-pointer border border-theme rounded hover:border-[var(--accent)] transition-all duration-300 animate-fadeInUp stagger-${(index % 4) + 1}`}
                  onClick={() => setLightboxImage(image.fileName)}
                >
                  <Image
                    src={image.url}
                    alt={image.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <span className="inline-block px-2 py-0.5 bg-accent text-white text-xs font-display font-bold rounded mb-1.5 w-fit">
                      {image.category}
                    </span>
                    <h3 className="text-white font-display font-bold text-sm">{image.title}</h3>
                    {image.description && <p className="text-gray-300 text-xs mt-0.5">{image.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty */}
          {!loading && filteredImages.length === 0 && (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">📷</div>
              <p className="text-theme-secondary text-lg font-display font-semibold">Žádné fotografie v této kategorii</p>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxImage && currentImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <button onClick={() => setLightboxImage(null)} className="absolute top-4 right-4 w-11 h-11 bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-2xl transition-colors z-10 rounded">×</button>
          <button onClick={(e) => { e.stopPropagation(); prevImage(); }} className="absolute left-4 w-11 h-11 bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-2xl transition-colors z-10 rounded">‹</button>
          <button onClick={(e) => { e.stopPropagation(); nextImage(); }} className="absolute right-4 w-11 h-11 bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-2xl transition-colors z-10 rounded">›</button>
          <div className="relative max-w-5xl w-full bg-[#1a1812] rounded overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="relative aspect-video bg-[#100e08]">
              <Image
                src={currentImage.url}
                alt={currentImage.title}
                fill
                className="object-contain"
                sizes="(max-width: 1280px) 100vw, 1280px"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="inline-block px-2 py-0.5 bg-accent text-white text-xs font-display font-bold rounded mb-2">
                    {currentImage.category}
                  </span>
                  <h3 className="text-white font-display font-bold text-lg">{currentImage.title}</h3>
                  {currentImage.description && <p className="text-gray-400 text-sm mt-1">{currentImage.description}</p>}
                </div>
                <span className="text-gray-400 text-sm flex-shrink-0">
                  {filteredImages.findIndex(img => img.fileName === lightboxImage) + 1} / {filteredImages.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CTA */}
      <MascotCTA
        title="Přesvědčili jsme vás?"
        subtitle="Navštivte nás nebo si rezervujte termín online!"
        actions={[
          { label: 'Rezervovat termín', href: '/rezervace', variant: 'primary' },
          { label: CONTACT_INFO.phone.display, href: '', isPhone: true, variant: 'secondary' },
        ]}
      />
    </TechBackground>
  );
}
