import { create } from 'zustand';
import { Pet, Order } from '../types/pet';
import { petApi } from '../services/api';

const ITEMS_PER_PAGE = 8;

interface PetStore {
  pets: Pet[];
  loading: boolean;
  hasMore: boolean;
  error: string | null;
  activeTab: 'available' | 'pending' | 'sold';
  page: number;
  allPets: Pet[];
  
  // Acciones
  setActiveTab: (tab: 'available' | 'pending' | 'sold') => void;
  loadPets: (status: 'available' | 'pending' | 'sold') => Promise<void>;
  loadMorePets: () => void;
  createPet: (pet: Pet) => Promise<void>;
  updatePet: (pet: Pet) => Promise<void>;
  createOrder: (pet: Pet, quantity: number) => Promise<void>;
  reset: () => void;
}

export const usePetStore = create<PetStore>((set, get) => ({
  pets: [],
  allPets: [],
  loading: false,
  hasMore: true,
  error: null,
  activeTab: 'available',
  page: 1,

  setActiveTab: (tab) => {
    set({ 
      activeTab: tab, 
      pets: [], 
      allPets: [],
      hasMore: true,
      page: 1,
      error: null 
    });
    get().loadPets(tab);
  },

  loadPets: async (status) => {
    try {
      set({ loading: true, error: null });
      
      const fetchedPets = await petApi.getPetsByStatus(status);
      
      // Filtramos duplicados usando un Map
      const uniquePetsMap = new Map<number, Pet>();
      fetchedPets.forEach(pet => {
        if (pet.id) {
          uniquePetsMap.set(pet.id, pet);
        }
      });
      
      // Convertimos a array y ordenamos por ID de forma descendente
      const uniquePets = Array.from(uniquePetsMap.values())
        .sort((a, b) => (b.id || 0) - (a.id || 0));
      
      const paginatedPets = uniquePets.slice(0, ITEMS_PER_PAGE);
      
      set({
        allPets: uniquePets,
        pets: paginatedPets,
        loading: false,
        hasMore: uniquePets.length > ITEMS_PER_PAGE,
        page: 1
      });
    } catch (error) {
      set({ 
        error: 'Error al cargar las mascotas',
        loading: false,
      });
    }
  },

  loadMorePets: () => {
    const { page, allPets, pets } = get();
    const nextPage = page + 1;
    const start = page * ITEMS_PER_PAGE;
    const end = nextPage * ITEMS_PER_PAGE;
    const newPets = allPets.slice(start, end);
    
    if (newPets.length > 0) {
      set({
        pets: [...pets, ...newPets],
        page: nextPage,
        hasMore: end < allPets.length
      });
    } else {
      set({ hasMore: false });
    }
  },

  createPet: async (pet) => {
    try {
      set({ loading: true, error: null });
      const createdPet = await petApi.createPet(pet);
      
      // Actualizamos el estado local inmediatamente
      set(state => {
        const newPets = [createdPet, ...state.pets].slice(0, ITEMS_PER_PAGE);
        const newAllPets = [createdPet, ...state.allPets];
        return {
          pets: newPets,
          allPets: newAllPets,
          loading: false,
        };
      });
    } catch (error) {
      set({ 
        error: 'Error al crear la mascota',
        loading: false,
      });
    }
  },

  updatePet: async (pet) => {
    try {
      set({ loading: true, error: null });
      await petApi.updatePet(pet);
      
      // Actualizamos el estado local inmediatamente
      set(state => {
        const updatedPets = state.pets.map(p => p.id === pet.id ? pet : p);
        const updatedAllPets = state.allPets.map(p => p.id === pet.id ? pet : p);
        return {
          pets: updatedPets,
          allPets: updatedAllPets,
          loading: false,
        };
      });
    } catch (error) {
      set({ 
        error: 'Error al actualizar la mascota',
        loading: false,
      });
    }
  },

  createOrder: async (pet: Pet, quantity: number) => {
    try {
      set({ loading: true, error: null });
      
      // Crear la orden
      const order: Order = {
        id: Date.now(),
        petId: pet.id!,
        quantity,
        shipDate: new Date().toISOString(),
        status: 'placed',
        complete: true
      };
      
      await petApi.createOrder(order);

      // Actualizar el estado de la mascota a vendido
      const updatedPet: Pet = {
        ...pet,
        status: 'sold'
      };
      
      await petApi.updatePet(updatedPet);
      
      // Actualizar el estado local
      set(state => {
        const updatedPets = state.pets.map(p => p.id === pet.id ? updatedPet : p);
        const updatedAllPets = state.allPets.map(p => p.id === pet.id ? updatedPet : p);
        return {
          pets: updatedPets,
          allPets: updatedAllPets,
          loading: false,
        };
      });
    } catch (error) {
      set({ 
        error: 'Error al crear la orden',
        loading: false,
      });
    }
  },

  reset: () => {
    set({
      pets: [],
      allPets: [],
      loading: false,
      hasMore: true,
      error: null,
      activeTab: 'available',
      page: 1
    });
  },
})); 