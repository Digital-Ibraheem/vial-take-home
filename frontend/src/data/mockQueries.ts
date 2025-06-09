interface QueryDetail {
  id: number;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'OPEN' | 'RESOLVED';
}

export const mockQueries: Record<number, QueryDetail[]> = {
  1: [
    {
      id: 1,
      description: "Please provide more specific details about the type of breast cancer and any genetic testing results.",
      createdAt: new Date('2024-01-15T10:30:00'),
      updatedAt: new Date('2024-01-16T14:22:00'),
      status: 'OPEN'
    },
    {
      id: 2,
      description: "Need clarification on the age of diagnosis and current screening recommendations.",
      createdAt: new Date('2024-01-14T09:15:00'),
      updatedAt: new Date('2024-01-15T11:45:00'),
      status: 'OPEN'
    }
  ],
  2: [
    {
      id: 3,
      description: "Please confirm the exact dosages and timing of medication administration.",
      createdAt: new Date('2024-01-12T16:20:00'),
      updatedAt: new Date('2024-01-18T13:30:00'),
      status: 'RESOLVED'
    }
  ],
  3: [
    {
      id: 4,
      description: "Require more details about the severity and duration of the allergic reaction.",
      createdAt: new Date('2024-01-10T11:00:00'),
      updatedAt: new Date('2024-01-11T09:30:00'),
      status: 'OPEN'
    }
  ],
  5: [
    {
      id: 5,
      description: "Need clarification on specific types of alcoholic beverages and consumption patterns.",
      createdAt: new Date('2024-01-08T14:15:00'),
      updatedAt: new Date('2024-01-09T10:20:00'),
      status: 'OPEN'
    },
    {
      id: 6,
      description: "Please provide information about any recent changes in drinking habits.",
      createdAt: new Date('2024-01-07T13:45:00'),
      updatedAt: new Date('2024-01-08T16:10:00'),
      status: 'OPEN'
    },
    {
      id: 7,
      description: "Clarify if there are any associated health concerns or symptoms.",
      createdAt: new Date('2024-01-06T12:30:00'),
      updatedAt: new Date('2024-01-07T15:25:00'),
      status: 'OPEN'
    }
  ]
};

export type { QueryDetail }; 