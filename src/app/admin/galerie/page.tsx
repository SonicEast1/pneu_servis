'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState, type DragEvent } from 'react';
import { api, Loading, PageHeader, Switch } from '@/components/admin/ui';
import { useToast } from '@/components/admin/AdminShell';

interface GalleryImage {
  id: string;
  url: string;
  title: string;
  description: string;
  categories: string[];
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

/** Nabídka kategorií, dokud admin nevytvoří vlastní. */
const SUGGESTED_CATEGORIES = ['Provozovna', 'Přezutí', 'Vyvážení', 'Opravy', 'Pneumatiky', 'Disky'];

function ImageCard({
  image,
  index,
  count,
  categories,
  onSave,
  onToggleVisible,
  onMove,
  onRemove,
}: {
  image: GalleryImage;
  index: number;
  count: number;
  categories: string[];
  onSave: (patch: Pick<GalleryImage, 'title' | 'description' | 'categories'>) => Promise<boolean>;
  onToggleVisible: (visible: boolean) => void;
  onMove: (delta: number) => void;
  onRemove: () => void;
}) {
  const [title, setTitle] = useState(image.title);
  const [description, setDescription] = useState(image.description);
  const [picked, setPicked] = useState<string[]>(image.categories);
  const [newCategory, setNewCategory] = useState('');
  const [saving, setSaving] = useState(false);

  const dirty = title !== image.title
    || description !== image.description
    || picked.join('|') !== image.categories.join('|');

  // Nabídka = všechny použité kategorie + ty, které má fotka (i nově přidané)
  const options = Array.from(new Set([...categories, ...picked]));

  const toggle = (category: string) => {
    setPicked((list) => (list.includes(category) ? list.filter((item) => item !== category) : [...list, category]));
  };

  const addCategory = () => {
    const name = newCategory.trim().slice(0, 40);
    if (!name) return;
    if (!picked.includes(name)) setPicked((list) => [...list, name]);
    setNewCategory('');
  };

  const save = async () => {
    setSaving(true);
    await onSave({ title: title.trim(), description: description.trim(), categories: picked });
    setSaving(false);
  };

  return (
    <li className="admin-card admin-photo" data-muted={!image.visible}>
      <div className="admin-photo-thumb">
        <Image src={image.url} alt={image.title || 'Fotka'} fill sizes="(max-width: 640px) 100vw, 300px" className="object-cover" />
        {!image.visible && <span className="admin-pill admin-photo-flag" data-tone="hidden">Skrytá</span>}
      </div>

      <label className="admin-field">
        <span>Název</span>
        <input
          className="form-input"
          value={title}
          maxLength={80}
          placeholder="např. Přezutí na Octavii"
          onChange={(e) => setTitle(e.target.value)}
        />
      </label>

      <label className="admin-field">
        <span>Popis</span>
        <textarea
          className="form-input"
          rows={3}
          value={description}
          maxLength={600}
          placeholder="Co je na fotce, co se dělalo… (ukáže se po rozkliknutí)"
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>

      <div className="admin-field">
        <span>Kategorie</span>
        <div className="admin-chips" role="group" aria-label="Kategorie fotky">
          {options.map((category) => (
            <button
              key={category}
              type="button"
              className="admin-chip"
              aria-pressed={picked.includes(category)}
              onClick={() => toggle(category)}
            >
              {category}
            </button>
          ))}
        </div>
        <div className="admin-chip-add">
          <input
            className="form-input"
            value={newCategory}
            maxLength={40}
            placeholder="Nová kategorie"
            onChange={(e) => setNewCategory(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addCategory();
              }
            }}
            aria-label="Nová kategorie"
          />
          <button type="button" className="btn-tech-secondary btn-compact" onClick={addCategory} disabled={!newCategory.trim()}>
            Přidat
          </button>
        </div>
      </div>

      {dirty && (
        <div className="admin-photo-save">
          <button
            type="button"
            className="btn-tech-secondary btn-compact"
            onClick={() => {
              setTitle(image.title);
              setDescription(image.description);
              setPicked(image.categories);
            }}
            disabled={saving}
          >
            Zahodit
          </button>
          <button type="button" className="btn-tech-primary btn-compact" onClick={save} disabled={saving}>
            {saving ? 'Ukládám…' : 'Uložit fotku'}
          </button>
        </div>
      )}

      <div className="admin-photo-foot">
        <Switch checked={image.visible} onChange={onToggleVisible} label="Na webu" />
        <div className="admin-list-actions">
          <button type="button" className="admin-icon-button" onClick={() => onMove(-1)} disabled={index === 0} aria-label="Posunout dopředu">←</button>
          <button type="button" className="admin-icon-button" onClick={() => onMove(1)} disabled={index === count - 1} aria-label="Posunout dozadu">→</button>
          <button type="button" className="admin-icon-button is-danger" onClick={onRemove} aria-label="Smazat fotku">×</button>
        </div>
      </div>
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

  const used = (images ?? []).flatMap((image) => image.categories);
  const categories = Array.from(new Set(used.length > 0 ? used : SUGGESTED_CATEGORIES));

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

  const change = async (image: GalleryImage, patch: Partial<GalleryImage>): Promise<boolean> => {
    try {
      const data = await api<{ image: GalleryImage }>('/api/galerie', { method: 'PATCH', json: { id: image.id, ...patch } });
      setImages((list) => list?.map((item) => (item.id === image.id ? data.image : item)) ?? null);
      toast({ text: 'Fotka uložena.', tone: 'ok', link: { href: '/galerie', label: 'Zobrazit' } });
      return true;
    } catch (error) {
      toast({ text: (error as Error).message, tone: 'error' });
      return false;
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
              onSave={(patch) => change(image, patch)}
              onToggleVisible={(visible) => change(image, { visible })}
              onMove={(delta) => reorder(index, delta)}
              onRemove={() => remove(image)}
            />
          ))}
        </ul>
      )}
    </>
  );
}
