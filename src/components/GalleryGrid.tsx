'use client';

import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';

export interface GalleryItem {
  id: string;
  url: string;
  title: string;
  category: string;
}

const ALL = 'Vše';

/** Mřížka fotek s filtrem kategorií; klik otevře fotku přes celou obrazovku. */
export default function GalleryGrid({ images }: { images: GalleryItem[] }) {
  const [filter, setFilter] = useState(ALL);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(images.map((image) => image.category).filter(Boolean)));
    return unique.length > 1 ? [ALL, ...unique] : [];
  }, [images]);

  const visible = filter === ALL ? images : images.filter((image) => image.category === filter);
  const current = openIndex === null ? null : visible[openIndex];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (current && !dialog.open) dialog.showModal();
    if (!current && dialog.open) dialog.close();
  }, [current]);

  const step = (delta: number) => {
    setOpenIndex((index) => (index === null ? null : (index + delta + visible.length) % visible.length));
  };

  return (
    <>
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6" role="group" aria-label="Filtrovat podle kategorie">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setFilter(category)}
              aria-pressed={filter === category}
              className={`nav-link-tech ${filter === category ? 'active' : ''}`}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      <ul className="gallery-grid">
        {visible.map((image, index) => (
          <li key={image.id}>
            <button
              type="button"
              className="gallery-item"
              onClick={() => setOpenIndex(index)}
              aria-label={image.title ? `Zvětšit: ${image.title}` : 'Zvětšit fotku'}
            >
              <Image
                src={image.url}
                alt={image.title || 'Fotka z pneuservisu'}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover"
              />
              {image.title && <span className="gallery-caption">{image.title}</span>}
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        className="gallery-lightbox"
        onClose={() => setOpenIndex(null)}
        onClick={(event) => {
          // Klik mimo fotku (na tmavé pozadí) zavře náhled
          if (event.target === event.currentTarget) setOpenIndex(null);
        }}
        onKeyDown={(event) => {
          if (event.key === 'ArrowRight') step(1);
          if (event.key === 'ArrowLeft') step(-1);
        }}
        aria-label={current?.title || 'Náhled fotky'}
      >
        {current && (
          <figure className="gallery-lightbox-figure">
            <Image
              src={current.url}
              alt={current.title || 'Fotka z pneuservisu'}
              width={1600}
              height={1200}
              sizes="100vw"
              className="gallery-lightbox-image"
            />
            {current.title && <figcaption>{current.title}</figcaption>}
          </figure>
        )}
        <button type="button" className="gallery-lightbox-close" onClick={() => setOpenIndex(null)} aria-label="Zavřít">
          ×
        </button>
        {visible.length > 1 && (
          <>
            <button type="button" className="gallery-lightbox-nav is-prev" onClick={() => step(-1)} aria-label="Předchozí fotka">
              ‹
            </button>
            <button type="button" className="gallery-lightbox-nav is-next" onClick={() => step(1)} aria-label="Další fotka">
              ›
            </button>
          </>
        )}
      </dialog>
    </>
  );
}
