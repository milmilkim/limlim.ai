import { db } from '../db';
import type { GlobalSettings } from '../db';

const SINGLE_ID = 'global';

// Patch에는 API 키, 베이스 URL 등도 포함 가능
export type GlobalSettingsPatch = Partial<GlobalSettings> & { contextTrim?: 'auto' | 'head' | 'tail' };

export async function getGlobalSettings(): Promise<GlobalSettings | null> {
  return (await db.globals.get(SINGLE_ID)) ?? null;
}

export async function upsertGlobalSettings(patch: GlobalSettingsPatch): Promise<GlobalSettings> {
  const now = Date.now();
  const current = await db.globals.get(SINGLE_ID);
  const next: GlobalSettings = {
    id: SINGLE_ID,
    createdAt: current?.createdAt ?? now,
    updatedAt: now,
    version: (current?.version ?? 0) + 1,
    model: current?.model ?? 'gpt-4o',
    ...current,
    ...patch,
  };
  await db.globals.put(next);
  return next;
} 