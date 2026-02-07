'use client';

import { getAdminAuthHeaders } from './admin-auth';

const BASE = '';

async function authHeaders() {
  return getAdminAuthHeaders();
}

export async function apiGet<T>(path: string): Promise<T> {
  const headers = await authHeaders();
  const res = await fetch(`${BASE}${path}`, { headers, cache: 'no-store' });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error || res.statusText);
  }
  return res.json();
}

export async function apiMutate<T>(
  path: string,
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  body?: unknown,
  searchParams?: Record<string, string>
): Promise<T> {
  const headers = await authHeaders();
  const url = searchParams
    ? `${BASE}${path}?${new URLSearchParams(searchParams).toString()}`
    : `${BASE}${path}`;
  const res = await fetch(url, {
    method,
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: body != null ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error || res.statusText);
  }
  if (res.status === 204 || res.headers.get('content-length') === '0') return undefined as T;
  return res.json();
}

export async function apiUpload(file: File, folder: string): Promise<{ url: string }> {
  const headers = await authHeaders();
  const form = new FormData();
  form.append('file', file);
  form.append('folder', folder);
  const res = await fetch(`${BASE}/api/admin/upload`, {
    method: 'POST',
    headers,
    body: form,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error || res.statusText);
  }
  return res.json();
}
