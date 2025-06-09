// Backend data models
interface FormData {
  id: number;
  question: string;
  answer: string;
}

interface Query {
  id: number;
  title: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'OPEN' | 'RESOLVED';
  formDataId: number;
}

// Mock form data (patient responses)
export const mockFormData: FormData[] = [
  {
    id: 1,
    question: "Do you have a family history of cancer?",
    answer: "Yes, my mother had breast cancer at age 55."
  },
  {
    id: 2,
    question: "What medications are you currently taking?",
    answer: "Lisinopril 10mg daily, Metformin 500mg twice daily, Vitamin D3 1000 IU daily."
  },
  {
    id: 3,
    question: "Have you experienced any adverse reactions to medications?",
    answer: "I had a mild rash from penicillin when I was younger."
  },
  {
    id: 4,
    question: "Do you smoke or use tobacco products?",
    answer: "No, I quit smoking 5 years ago after smoking for 15 years."
  },
  {
    id: 5,
    question: "How many alcoholic drinks do you consume per week?",
    answer: "Usually 2-3 glasses of wine on weekends."
  },
  {
    id: 6,
    question: "Do you exercise regularly?",
    answer: "Yes, I go to the gym 3 times a week and walk daily."
  }
];

// Mock queries associated with form data
export const mockQueries: Query[] = [
  // Queries for form data 1 (family history)
  {
    id: 1,
    title: "Query | Do you have a family history of cancer?",
    description: "Please provide more specific details about the type of breast cancer and any genetic testing results.",
    createdAt: new Date('2024-01-15T10:30:00'),
    updatedAt: new Date('2024-01-16T14:22:00'),
    status: 'OPEN',
    formDataId: 1
  },
  {
    id: 2,
    title: "Query | Do you have a family history of cancer?",
    description: "Need clarification on the age of diagnosis and current screening recommendations.",
    createdAt: new Date('2024-01-14T09:15:00'),
    updatedAt: new Date('2024-01-15T11:45:00'),
    status: 'OPEN',
    formDataId: 1
  },
  // Query for form data 2 (medications) - RESOLVED
  {
    id: 3,
    title: "Query | What medications are you currently taking?",
    description: "Please confirm the exact dosages and timing of medication administration.",
    createdAt: new Date('2024-01-12T16:20:00'),
    updatedAt: new Date('2024-01-18T13:30:00'),
    status: 'RESOLVED',
    formDataId: 2
  },
  // Query for form data 3 (adverse reactions)
  {
    id: 4,
    title: "Query | Have you experienced any adverse reactions to medications?",
    description: "Require more details about the severity and duration of the allergic reaction.",
    createdAt: new Date('2024-01-10T11:00:00'),
    updatedAt: new Date('2024-01-11T09:30:00'),
    status: 'OPEN',
    formDataId: 3
  },
  // Queries for form data 5 (alcohol consumption)
  {
    id: 5,
    title: "Query | How many alcoholic drinks do you consume per week?",
    description: "Need clarification on specific types of alcoholic beverages and consumption patterns.",
    createdAt: new Date('2024-01-08T14:15:00'),
    updatedAt: new Date('2024-01-09T10:20:00'),
    status: 'OPEN',
    formDataId: 5
  },
  {
    id: 6,
    title: "Query | How many alcoholic drinks do you consume per week?",
    description: "Please provide information about any recent changes in drinking habits.",
    createdAt: new Date('2024-01-07T13:45:00'),
    updatedAt: new Date('2024-01-08T16:10:00'),
    status: 'OPEN',
    formDataId: 5
  },
  {
    id: 7,
    title: "Query | How many alcoholic drinks do you consume per week?",
    description: "Clarify if there are any associated health concerns or symptoms.",
    createdAt: new Date('2024-01-06T12:30:00'),
    updatedAt: new Date('2024-01-07T15:25:00'),
    status: 'RESOLVED',
    formDataId: 5
  }
];

export type { FormData, Query }; 