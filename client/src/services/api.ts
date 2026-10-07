import type { MeetingDetails, MeetingSummaryData } from '../types';

const API_BASE = '/api';

export async function createMeetingApi(title: string, hostName: string, password?: string): Promise<{ success: boolean; meeting: MeetingDetails }> {
  const res = await fetch(`${API_BASE}/meetings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, hostName, password })
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to create meeting');
  }
  return data;
}

export async function getMeetingByCodeApi(code: string): Promise<MeetingDetails> {
  const cleanCode = code.trim().toUpperCase();
  const res = await fetch(`${API_BASE}/meetings/${cleanCode}`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Meeting not found');
  }
  return data.meeting;
}

export async function getRecentMeetingsApi(): Promise<any[]> {
  const res = await fetch(`${API_BASE}/meetings`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to load recent meetings');
  }
  return data.meetings || [];
}

export async function getMeetingSummaryApi(code: string): Promise<MeetingSummaryData> {
  const res = await fetch(`${API_BASE}/meetings/${code}/summary`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to load meeting summary');
  }
  return data.summary;
}
