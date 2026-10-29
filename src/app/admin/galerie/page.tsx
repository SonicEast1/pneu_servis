'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState, type DragEvent } from 'react';
import { api, Loading, PageHeader, Switch } from '@/components/admin/ui';
import { useToast } from '@/components/admin/AdminShell';

interface GalleryImage {
  id: string;
  url: string;
  title: string;
  category: string;
  visible: boolean;
}

interface Upload {
  key: string;
  name: string;
  state: 'working' | 'error';
  error?: string;
}

const MAX_EDGE = 2400;

/**
 * Zmenší fotku v prohlížeči na max. 2400 px a uloží jako JPEG.
 * Fotka z mobilu (5–10 MB) se tak nahraje během chvilky a web zůstane rychlý.
 */
async function shrink(file: File): Promise<Blob> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext('2d')?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.85));
    return blob ?? file;
  } catch {
    return file;
  }
}

function ImageCard({
  image,
  index,
  count,
  categories,
  onChange,
  onMove,
  onRemove,
}: {
  image: GalleryImage;
  index: number;
  count: number;
  categories: string[];
  onChange: (patch: Partial<GalleryImage>) => void;
  onMove: (delta: number) => void;
  onRemove: () => void;
}) {
  const [title, setTitle] = useState(image.title);
  const [category, setCategory] = useState(image.category);

  return (
    <li className="admin-card admin-photo" data-muted={!image.visible}>
      <div className="admin-photo-thumb">
        <Image src={image.url} alt={image.title || 'Fotka'} fill sizes="(max-width: 640px) 100vw, 300px" className="object-cover" />
        {!image.visible && <span className="admin-pill admin-photo-flag" data-tone="hidden">Skrytá</span>}
      </div>
      <label className="admin-field">
        <span>Popisek</span>
        <input
          className="form-input"
          value={title}
          maxLength={120}
          placeholder="např. Přezutí na Octavii"
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => title !== image.title && onChange({ title })}
        />
      </label>
      <label className="admin-field">
        <span>Kategorie</span>
        <input
          className="form-input"
          list="gallery-categories"
          value={category}
          maxLength={40}
          placeholder="např. Provozovna"
          onChange={(e) => setCategory(e.target.value)}
          onBlur={() => category !== image.category && onChange({ category })}
        />
      </label>
      <div className="admin-photo-foot">
        <Switch checked={image.visible} onChange={(visible) => onChange({ visible })} label="Na webu" />
        <div className="admin-list-actions">
          <button type="button" className="admin-icon-button" onClick={() => onMove(-1)} disabled={index === 0} aria-label="Posunout dopředu">←</button>
          <button type="button" className="admin-icon-button" onClick={() => onMove(1)} disabled={index === count - 1} aria-label="Posunout dozadu">→</button>
          <button type="button" className="admin-icon-button is-danger" onClick={onRemove} aria-label="Smazat fotku">×</button>
        </div>
      </div>
      {categories.length > 0 && index === 0 && (
        <datalist id="gallery-categories">
          {categories.map((item) => <option key={item} value={item} />)}
        </datalist>
      )}
    </li>
  );
}

export default function AdminGalleryPage() {
  const toast = useToast();
  const [images, setImages] = useState<GalleryImage[] | null>(null);
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(() => {
    api<{ images: GalleryImage[] }>('/api/galerie?all=1')
      .then((data) => setImages(data.images))
      .catch((error: Error) => toast({ text: error.message, tone: 'error' }));
  }, [toast]);

  useEffect(load, [load]);

  const categories = Array.from(new Set((images ?? []).map((image) => image.category).filter(Boolean)));

  const uploadFiles = async (files: File[]) => {
    const pictures = files.filter((file) => file.type.startsWith('image/'));
    if (pictures.length === 0) {
      toast({ text: 'Vyberte prosím fotky (JPG, PNG nebo WebP).', tone: 'error' });
      return;
    }

    let added = 0;
    for (const file of pictures) {
      const key = `${file.name}-${file.lastModified}-${Math.random()}`;
      setUploads((list) => [...list, { key, name: file.name, state: 'working' }]);
      try {
        const body = new FormData();
        body.append('file', await shrink(file), file.name.replace(/\.\w+$/, '.jpg'));
        const response = await fetch('/api/galerie', { method: 'POST', body });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.error || 'Nahrání se nepovedlo.');
        setImages((list) => [data.image, ...(list ?? [])]);
        setUploads((list) => list.filter((item) => item.key !== key));
        added += 1;
      } catch (error) {
        setUploads((list) => list.map((item) => (
          item.key === key ? { ...item, state: 'error', error: (error as Error).message } : item
        )));
      }
    }
    if (added > 0) {
      toast({
        text: added === 1 ? 'Fotka nahrána a je na webu.' : `Nahráno ${added} fotek, jsou na webu.`,
        tone: 'ok',
        link: { href: '/galerie', label: 'Zobrazit' },
      });
    }
  };

  const onDrop = (event: DragEvent) => {
    event.preventDefault();
    setDragging(false);
    uploadFiles(Array.from(event.dataTransfer.files));
  };

  const change = async (image: GalleryImage, patch: Partial<GalleryImage>) => {
    setImages((list) => list?.map((item) => (item.id === image.id ? { ...item, ...patch } : item)) ?? null);
    try {
      await api('/api/galerie', { method: 'PATCH', json: { id: image.id, ...patch } });
      toast({ text: 'Uloženo.', tone: 'ok' });
    } catch (error) {
      toast({ text: (error as Error).message, tone: 'error' });
      load();
    }
  };

  const reorder = async (index: number, delta: number) => {
    if (!images) return;
    const next = [...images];
    const [item] = next.splice(index, 1);
    next.splice(index + delta, 0, item);
    setImages(next);
    try {
      await api('/api/galerie', { method: 'PATCH', json: { order: next.map((image) => image.id) } });
    } catch (error) {
      toast({ text: (error as Error).message, tone: 'error' });
      load();
    }
  };

  const remove = async (image: GalleryImage) => {
    if (!window.confirm('Opravdu smazat tuhle fotku? Tohle nejde vrátit.')) return;
    try {
      await api(`/api/galerie?id=${encodeURIComponent(image.id)}`, { method: 'DELETE' });
      setImages((list) => list?.filter((item) => item.id !== image.id) ?? null);
      toast({ text: 'Fotka smazána.', tone: 'ok' });
    } catch (error) {
      toast({ text: (error as Error).message, tone: 'error' });
    }
  };

  if (!images) return <Loading />;

  return (
    <>
      <PageHeader
        title="Galerie"
        description="Fotky na stránce Galerie. Nové fotky se přidají na začátek a hned se ukážou na webu."
      />

      <button
        type="button"
        className="admin-dropzone mb-6"
        data-dragging={dragging}
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        <span className="font-display font-bold text-theme">Přetáhněte sem fotky</span>
        <span className="text-theme-secondary text-sm">nebo klikněte a vyberte je z počítače či telefonu</span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        hidden
        onChange={(event) => {
          uploadFiles(Array.from(event.target.files ?? []));
          event.target.value = '';
        }}
      />

      {uploads.length > 0 && (
        <ul className="admin-uploads mb-6">
          {uploads.map((upload) => (
            <li key={upload.key} data-state={upload.state}>
              <span className="truncate">{upload.name}</span>
              {upload.state === 'working' ? (
                <span className="text-theme-muted">Nahrávám…</span>
              ) : (
                <span className="text-accent">
                  {upload.error}{' '}
                  <button type="button" className="admin-link-button" onClick={() => setUploads((list) => list.filter((item) => item.key !== upload.key))}>
                    Zavřít
                  </button>
                </span>
              )}
            </li>
          ))}
        </ul>
      )}

      {images.length === 0 ? (
        <p className="admin-card text-theme-secondary text-sm">
          Zatím tu nejsou žádné fotky. Dokud nějakou nenahrajete, ukazuje stránka Galerie „Připravujeme“.
        </p>
      ) : (
        <ul className="admin-photos">
          {images.map((image, index) => (
            <ImageCard
              key={image.id}
              image={image}
              index={index}
              count={images.length}
              categories={categories}
              onChange={(patch) => change(image, patch)}
              onMove={(delta) => reorder(index, delta)}
              onRemove={() => remove(image)}
            />
          ))}
        </ul>
      )}
    </>
  );
}
