const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export async function fetchDashboard() {
  const res = await fetch(`${API_URL}/dashboard`);
  if (!res.ok) throw new Error('Failed to fetch dashboard');
  return res.json();
}

export async function fetchRequests(search = '', risk = '') {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (risk) params.append('risk', risk);
  
  const res = await fetch(`${API_URL}/requests?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch requests');
  return res.json();
}

export async function fetchRequestDetail(id) {
  const res = await fetch(`${API_URL}/requests/${id}`);
  if (!res.ok) throw new Error('Failed to fetch request detail');
  return res.json();
}

export async function fetchReports() {
  const res = await fetch(`${API_URL}/reports`);
  if (!res.ok) throw new Error('Failed to fetch reports');
  return res.json();
}

export async function loadDemoData() {
  const res = await fetch(`${API_URL}/demo`);
  if (!res.ok) throw new Error('Failed to load demo data');
  return res.json();
}

export async function uploadData(file) {
  const formData = new FormData();
  formData.append('file', file);
  
  const res = await fetch(`${API_URL}/upload`, {
    method: 'POST',
    body: formData,
  });
  
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.detail || 'Failed to upload data');
  }
  
  return res.json();
}
