import { apiGet, apiPut } from "./client";

export type WeightEntry = {
  date: string;
  weight: number;
};

export type WeightTrackingData = {
  goal: number | null;
  entries: WeightEntry[];
};

const STORAGE_KEY = "nutriai_weight_tracking";
const API_BASE_PATH = "/weights";

function loadLocal(): WeightTrackingData {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return { goal: null, entries: [] };
  return JSON.parse(raw) as WeightTrackingData;
}

function saveLocal(data: WeightTrackingData): WeightTrackingData {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  return data;
}

function normalize(data: WeightTrackingData): WeightTrackingData {
  const entries = [...data.entries]
    .filter((entry) => entry.date && Number.isFinite(entry.weight))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  return { goal: data.goal, entries };
}

export async function getWeightTrackingData(): Promise<WeightTrackingData> {
  try {
    const data = await apiGet<WeightTrackingData>(API_BASE_PATH);
    return saveLocal(normalize(data));
  } catch {
    return normalize(loadLocal());
  }
}

export async function setWeightGoal(goal: number): Promise<WeightTrackingData> {
  try {
    const data = await apiPut<WeightTrackingData>(`${API_BASE_PATH}/goal`, { goal });
    return saveLocal(normalize(data));
  } catch {
    const local = loadLocal();
    return saveLocal(normalize({ ...local, goal }));
  }
}

export async function addWeightEntry(entry: WeightEntry): Promise<WeightTrackingData> {
  try {
    const data = await apiPut<WeightTrackingData>(`${API_BASE_PATH}/entries`, entry);
    return saveLocal(normalize(data));
  } catch {
    const local = loadLocal();
    const filtered = local.entries.filter((item) => item.date !== entry.date);
    return saveLocal(normalize({ ...local, entries: [...filtered, entry] }));
  }
}
