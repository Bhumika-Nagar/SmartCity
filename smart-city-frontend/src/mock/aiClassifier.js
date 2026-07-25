// Lightweight stand-in for the real Python (FastAPI/Flask) AI classification
// service described in the project spec. It maps free-text descriptions to a
// department + priority so the frontend has something realistic to show
// before the real ML/NLP service is wired up. Swap this out for a call to
// the AI service's HTTP endpoint once it exists.

const RULES = [
  { dept: 'Electricity', priority: 'High', words: ['electric', 'wire', 'transformer', 'shock', 'power outage', 'streetlight', 'short circuit'] },
  { dept: 'Water', priority: 'High', words: ['water leak', 'pipe burst', 'no water', 'sewage', 'drainage', 'contaminated'] },
  { dept: 'Sanitation', priority: 'Medium', words: ['garbage', 'trash', 'waste', 'dump', 'litter', 'smell'] },
  { dept: 'Roads', priority: 'Medium', words: ['pothole', 'road', 'traffic signal', 'street light', 'footpath', 'construction debris'] },
  { dept: 'Public Safety', priority: 'High', words: ['fire', 'accident', 'crime', 'assault', 'unsafe', 'collapsed'] },
  { dept: 'Parks & Environment', priority: 'Low', words: ['park', 'tree', 'garden', 'playground', 'pollution'] },
];

export function classifyComplaint(description = '') {
  const text = description.toLowerCase();
  for (const rule of RULES) {
    if (rule.words.some((w) => text.includes(w))) {
      return { department: rule.dept, priority: rule.priority };
    }
  }
  return { department: 'Sanitation', priority: 'Low' };
}
