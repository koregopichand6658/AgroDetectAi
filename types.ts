export interface Diagnosis {
  plantName: string;
  isPlant: boolean;
  status: 'Healthy' | 'Diseased' | 'Unknown';
  diseaseName: string | null;
  confidence: number;
  severity: 'Low' | 'Medium' | 'High' | 'None';
  symptoms: string[];
  causes: string[];
  treatments: string[];
  preventiveMeasures: string[];
  description: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}
