export type BirdSighting = {
  id: string;
  species: string;
  date: string;
  location: string;
  lat?: number;
  lng?: number;
  count: number;
  notes?: string;
  image?: string;
};
