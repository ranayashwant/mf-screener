const DEFAULT_BACKEND_URL = 'http://localhost:3000';

export function getApiUrl(path = '/') {
  const configuredBaseUrl = import.meta.env.VITE_API_URL?.trim();

  if (configuredBaseUrl) {
    return `${configuredBaseUrl.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`;
  }

  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    return `${window.location.origin}${path.startsWith('/') ? path : `/${path}`}`;
  }

  return `${DEFAULT_BACKEND_URL}${path.startsWith('/') ? path : `/${path}`}`;
}
