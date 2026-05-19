import { create } from 'zustand';

import { supabase } from '@/config/supabase';
import type { BirdSighting } from '@/types/sighting';
import { useAuthStore } from '@/store/auth';

type SightingsState = {
  sightings: BirdSighting[];
  loading: boolean;
  fetchSightings: () => Promise<void>;
  addSighting: (sighting: Omit<BirdSighting, 'id'>) => Promise<void>;
  removeSighting: (id: string) => Promise<void>;
};

export const useSightingsStore = create<SightingsState>((set) => ({
  sightings: [],
  loading: false,

  fetchSightings: async () => {
    const profileId = useAuthStore.getState().profileId;
    if (!profileId) return;

    set({ loading: true });
    const { data, error } = await supabase
      .from('sightings')
      .select('*')
      .eq('user_id', profileId)
      .order('date', { ascending: false });

    if (!error && data) {
      set({
        sightings: data.map((row) => ({
          id: row.id,
          species: row.species,
          location: row.location,
          lat: row.lat,
          lng: row.lng,
          date: row.date,
          count: row.count,
          notes: row.notes,
          image: row.image,
        })),
      });
    }
    set({ loading: false });
  },

  addSighting: async (sighting) => {
    const profileId = useAuthStore.getState().profileId;
    if (!profileId) return;

    const { data, error } = await supabase
      .from('sightings')
      .insert({
        user_id: profileId,
        species: sighting.species,
        location: sighting.location,
        lat: sighting.lat,
        lng: sighting.lng,
        date: sighting.date,
        count: sighting.count,
        notes: sighting.notes,
        image: sighting.image,
      })
      .select()
      .single();

    if (!error && data) {
      set((state) => ({
        sightings: [
          {
            id: data.id,
            species: data.species,
            location: data.location,
            lat: data.lat,
            lng: data.lng,
            date: data.date,
            count: data.count,
            notes: data.notes,
            image: data.image,
          },
          ...state.sightings,
        ],
      }));
    }
  },

  removeSighting: async (id) => {
    const { error } = await supabase.from('sightings').delete().eq('id', id);

    if (!error) {
      set((state) => ({
        sightings: state.sightings.filter((s) => s.id !== id),
      }));
    }
  },
}));
