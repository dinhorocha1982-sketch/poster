
export enum PosterStyle {
  MODERN = 'modern',
  BOLD = 'bold',
  ELEGANT = 'elegant',
  VIBRANT = 'vibrant',
  RETRO = 'retro',
  CYBER = 'cyber'
}

export interface PosterData {
  title: string;
  subtitle: string;
  description: string;
  callToAction: string;
  contact: string;
  link: string;
  image: string | null;
  accentColor: string;
}

export interface AIContentResponse {
  title: string;
  subtitle: string;
  description: string;
  callToAction: string;
}
