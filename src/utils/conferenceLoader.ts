import { Conference } from '@/types/conference';

// Dynamically import all YAML files from the conferences directory
const conferenceModules = import.meta.glob('@/data/conferences/*.yml', { eager: true });

// Extract and combine all conference data into a single array
const allConferencesData: Conference[] = [];

for (const path in conferenceModules) {
  const module = conferenceModules[path] as { default: Conference[] };
  if (module.default && Array.isArray(module.default)) {
    allConferencesData.push(...module.default);
  }
}

export default allConferencesData;
