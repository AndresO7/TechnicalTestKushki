import axios from 'axios';
import { Pet, Order, ApiResponse } from '../types/pet';

const BASE_URL = 'https://petstore.swagger.io/v2';

export const petApi = {
  // Obtener todas las mascotas por estado
  getPetsByStatus: async (status: 'available' | 'pending' | 'sold'): Promise<Pet[]> => {
    const response = await axios.get<Pet[]>(`${BASE_URL}/pet/findByStatus?status=${status}`);
    return response.data;
  },

  // Crear una nueva mascota
  createPet: async (petData: Pet): Promise<Pet> => {
    const response = await axios.post<Pet>(`${BASE_URL}/pet`, petData);
    return response.data;
  },

  // Actualizar una mascota existente
  updatePet: async (petData: Pet): Promise<Pet> => {
    const response = await axios.put<Pet>(`${BASE_URL}/pet`, petData);
    return response.data;
  },

  // Obtener una mascota por ID
  getPetById: async (petId: number): Promise<Pet> => {
    const response = await axios.get<Pet>(`${BASE_URL}/pet/${petId}`);
    return response.data;
  },

  // Crear una nueva orden
  createOrder: async (orderData: Order): Promise<Order> => {
    const response = await axios.post<Order>(`${BASE_URL}/store/order`, orderData);
    return response.data;
  }
}; 