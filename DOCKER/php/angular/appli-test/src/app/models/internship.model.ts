export interface Internship {
  id: string;
  studentId: string;
  companyName: string;
  startDate: Date;
  endDate: Date;
  description: string;
  status: 'SEARCHING' | 'PENDING' | 'APPROVED' | 'ONGOING' | 'COMPLETED';
  teacherId?: string;
  supervisor?: {
    name: string;
    email: string;
    phone: string;
    position: string;
  };
  location: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  documents: {
    agreement?: string;
    description?: string;
    followUpSheet?: string;
    evaluation?: string;
    report?: string;
  };
  skills: string[];
  salary?: number;
  weeklyHours: number;
  evaluations?: {
    midterm?: {
      date: Date;
      score: number;
      comments: string;
    };
    final?: {
      date: Date;
      score: number;
      comments: string;
    };
  };
}