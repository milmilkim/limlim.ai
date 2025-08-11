import Dexie from 'dexie';
import type { Table } from 'dexie';

export interface BaseDoc { id: string; createdAt: number; updatedAt: number; version: number }

// 글로벌 설정: 확장 가능
export interface GlobalSettings extends BaseDoc {
  model: string;           // default main model
  assistantModel?: string; // optional assistant model
  maxContext?: number;
  maxInput?: number;
  maxOutput?: number;
  contextTrim?: 'auto' | 'head' | 'tail';
  temperature?: number;
  topP?: number;
  freqPenalty?: number;
  presencePenalty?: number;
  openaiApiKey?: string;
  openaiBaseUrl?: string; // optional proxy/base URL
  geminiApiKey?: string;
}

export class AppDB extends Dexie {
  globals!: Table<GlobalSettings, string>;
  // TODO: personas, bots, promptPresets, loreSets, loreEntries, sessions ...

  constructor() {
    super('limlim-ai');
    this.version(1).stores({
      globals: 'id, updatedAt'
    });
  }
}

export const db = new AppDB(); 