
export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  imageUrl?: string;
}

export interface Guide {
  id: string;
  title: string;
  description: string;
  icon: string;
  content: string;
  image?: string;
  likes: number;
}

export enum AppState {
  LOCKED = 'LOCKED',
  HOME = 'HOME',
  TOOLS = 'TOOLS',
  MOOD_ANALYZER = 'MOOD_ANALYZER',
  LIVE = 'LIVE',
  PROFILE = 'PROFILE',
  ANALYSIS_RESULT = 'ANALYSIS_RESULT',
  SETTINGS = 'SETTINGS',
  GUIDE_DETAIL = 'GUIDE_DETAIL'
}

export interface ToolCategory {
  name: string;
  icon: string;
  tools: string[];
}
