export interface Activity {
  id: string;
  month: number;
  type: string;
  eventName: string;
  audience: string;
  link: string;
  date: string;
  time: string;
  postName: string;
  postOccurrence: string;
  postAction: string;
  satisfaction: string;
  status: 'Planejado' | 'Em Execução' | 'Concluído' | 'Cancelado';
}

export interface Crisis {
  id: string;
  date: string;
  riskLevel: string;
  origin: string;
  sector: string;
  responsible: string;
  correctiveAction: string;
  risks: string;
  learning: string;
  improvement: string;
}

export interface Notification {
  id: string;
  text: string;
  timestamp: string;
}

export interface MonthlyReport {
  explanation: string;
  highlights: string;
  suggestions: string;
}

export interface Holiday {
  id: string;
  month: number;
  day: string;
  name: string;
}

export interface User {
  email: string;
  name: string;
}