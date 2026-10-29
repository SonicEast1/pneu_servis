'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';

export default function AdminLogin({ configured }: { configured: boolean }) {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setPending(true);
    setError('');
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        setError(typeof body.error === 'string' ? body.error : 'Přihlášení se nepovedlo.');
        return;
      }
      router.refresh();
    } catch {
      setError('Přihlášení se nepovedlo. Zkontrolujte připojení.');
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="admin-login">
      <form onSubmit={submit} className="admin-card admin-login-card">
        <p className="section-tag">Správa webu</p>
        <h1 className="font-display text-3xl font-bold text-theme mb-1">Přihlášení</h1>
        <p className="text-theme-secondary text-sm mb-6">
          Tady upravíte otevírací dobu, služby, ceník, galerii, recenze a rezervace.
        </p>

        {!configured && (
          <p className="admin-note mb-5" role="alert">
            Na serveru zatím není nastavené heslo (proměnná <code>ADMIN_PASSWORD</code>). Bez něj se nikdo nepřihlásí.
          </p>
        )}

        <label className="admin-field">
          <span>Jméno</span>
          <input
            className="form-input"
            name="username"
            autoComplete="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />
        </label>
        <label className="admin-field">
          <span>Heslo</span>
          <input
            className="form-input"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>
        {error && <p className="text-sm text-accent mb-3" role="alert">{error}</p>}
        <button type="submit" className="btn-tech-primary w-full" disabled={pending || !configured}>
          {pending ? 'Ověřuji…' : 'Přihlásit'}
        </button>
      </form>
    </div>
  );
}
