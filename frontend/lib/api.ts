const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export interface DocumentDto {
  _id: string;
  firstName: string;
  lastName: string;
  cin?: string;
  department: string;
  documentType: string;
  documentStatus: 'valid' | 'incomplete' | 'pending';
  signatureDetected: boolean;
  humanVerificationRequired: boolean;
  scanDate: string;
  metadata?: Record<string, any>;
  storagePath: string;
  fileName: string;
}

export async function uploadDocument(data: FormData): Promise<DocumentDto> {
  const res = await fetch(`${API_URL}/documents/upload`, {
    method: 'POST',
    body: data,
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || 'Upload failed');
  }

  return res.json();
}

export interface SearchParams {
  firstName?: string;
  lastName?: string;
  cin?: string;
  department?: string;
  documentType?: string;
}

export async function searchDocuments(params: SearchParams): Promise<DocumentDto[]> {
  const url = new URL(`${API_URL}/documents/search`);
  Object.entries(params).forEach(([key, value]) => {
    if (value) url.searchParams.append(key, value);
  });

  const res = await fetch(url.toString(), { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Search failed');
  }
  return res.json();
}
