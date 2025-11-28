export enum PropertyType {
  RENT = 'RENT',
  SALE = 'SALE'
}

export interface Property {
  id: string;
  title: string;
  price: string;
  location: string;
  type: PropertyType;
  image: string;
  beds: number;
  baths: number;
  sqft: number;
  has4kTour: boolean;
  description?: string;
  amenities?: string[];
}

export enum ChatModelMode {
  FAST = 'FAST',
  STANDARD = 'STANDARD',
  THINKING = 'THINKING'
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
}