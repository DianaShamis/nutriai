export type ProfileStep1 = {
  age: string;
  height: string;
  weight: string;
};

export type ProfileStep2 = {
  goal: string;
  activity: string;
  allergies: string;
};

const STEP1_KEY = "nutriai_profile_step1";
const STEP2_KEY = "nutriai_profile_step2";

export function getStep1Data(): ProfileStep1 {
  const raw = localStorage.getItem(STEP1_KEY);
  if (!raw) return { age: "", height: "", weight: "" };
  return JSON.parse(raw) as ProfileStep1;
}

export function saveStep1Data(data: ProfileStep1) {
  localStorage.setItem(STEP1_KEY, JSON.stringify(data));
}

export function getStep2Data(): ProfileStep2 {
  const raw = localStorage.getItem(STEP2_KEY);
  if (!raw) return { goal: "", activity: "", allergies: "" };
  return JSON.parse(raw) as ProfileStep2;
}

export function saveStep2Data(data: ProfileStep2) {
  localStorage.setItem(STEP2_KEY, JSON.stringify(data));
}

export function isStep1Completed() {
  const data = getStep1Data();
  const age = Number(data.age);
  const height = Number(data.height);
  const weight = Number(data.weight);
  return (
    Number.isFinite(age) &&
    Number.isFinite(height) &&
    Number.isFinite(weight) &&
    age > 0 &&
    height > 0 &&
    weight > 0
  );
}

export function isStep2Completed() {
  const data = getStep2Data();
  return Boolean(data.goal && data.activity);
}

export function getProfileStartRoute() {
  if (!isStep1Completed()) return "/profile/step1";
  if (!isStep2Completed()) return "/profile/step2";
  return "/my-plan";
}
