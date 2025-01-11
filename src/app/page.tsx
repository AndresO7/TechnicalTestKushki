'use client';

import { useState, useEffect } from 'react';
import { Pet } from '../types/pet';
import { PetCard } from '../components/PetCard';
import { PetForm } from '../components/PetForm';
import { Toast } from '../components/Toast';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import dynamic from 'next/dynamic';
import { usePetStore } from '../store/usePetStore';
import { useInView } from 'react-intersection-observer';

// Cargamos el modal de forma dinámica
const OrderModal = dynamic(() => import('../components/OrderModal').then(mod => ({ default: mod.OrderModal })), {
  loading: () => <div className="fixed inset-0 bg-secondary-900/20 backdrop-blur-sm flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
  </div>,
  ssr: false
});

export default function Home() {
  const [showForm, setShowForm] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | undefined>();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const {
    pets,
    loading,
    error,
    hasMore,
    activeTab,
    setActiveTab,
    loadPets,
    loadMorePets,
    createPet,
    updatePet,
    createOrder
  } = usePetStore();

  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.1,
    delay: 100
  });

  useEffect(() => {
    loadPets(activeTab);
  }, []);

  useEffect(() => {
    if (error) {
      showToast(error, 'error');
    }
  }, [error]);

  useEffect(() => {
    if (inView && hasMore && !loading) {
      loadMorePets();
    }
  }, [inView, hasMore, loading]);

  const handleCreatePet = async (petData: Pet) => {
    await createPet(petData);
    setShowForm(false);
    showToast('Mascota creada exitosamente', 'success');
  };

  const handleUpdatePet = async (petData: Pet) => {
    await updatePet(petData);
    setEditingPet(undefined);
    showToast('Mascota actualizada exitosamente', 'success');
  };

  const handleBuyPet = async (pet: Pet, quantity: number) => {
    await createOrder(pet, quantity);
    showToast('¡Orden realizada exitosamente!', 'success');
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
  };

  const renderPetGrid = (pets: Pet[]) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {pets.map((pet, index) => (
        <PetCard
          key={`${pet.id}-${index}`}
          pet={pet}
          onEdit={() => setEditingPet(pet)}
          onBuy={(quantity) => handleBuyPet(pet, quantity)}
        />
      ))}
      {hasMore && (
        <div ref={loadMoreRef} className="col-span-full flex justify-center py-8">
          {loading && (
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          )}
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    if (loading && pets.length === 0) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      );
    }

    if (pets.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-secondary-400 text-lg">
            No hay mascotas {activeTab === 'available' ? 'disponibles' : activeTab === 'pending' ? 'pendientes' : 'vendidas'} en este momento
          </p>
        </div>
      );
    }

    return renderPetGrid(pets);
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <div className="mb-6 sm:mb-0">
            <h1 className="text-3xl font-medium text-secondary-800 mb-2">
              Catálogo de Mascotas
            </h1>
            <p className="text-secondary-600">
              Gestiona y visualiza todas las mascotas
            </p>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-primary-gradient hover:bg-primary-gradient-hover transition-all shadow-md hover:shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nueva Mascota
          </Button>
        </div>

        <Tabs 
          defaultValue="available" 
          className="mb-8" 
          onValueChange={(value) => setActiveTab(value as 'available' | 'pending' | 'sold')}
        >
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="available">Disponibles</TabsTrigger>
            <TabsTrigger value="pending">Pendientes</TabsTrigger>
            <TabsTrigger value="sold">Vendidas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="available" className="mt-6">
            {renderContent()}
          </TabsContent>
          
          <TabsContent value="pending" className="mt-6">
            {renderContent()}
          </TabsContent>
          
          <TabsContent value="sold" className="mt-6">
            {renderContent()}
          </TabsContent>
        </Tabs>

        {(showForm || editingPet) && (
          <div className="fixed inset-0 bg-secondary-900/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl w-full max-w-md shadow-xl">
              <PetForm
                pet={editingPet}
                onSubmit={editingPet ? handleUpdatePet : handleCreatePet}
                onCancel={() => {
                  setShowForm(false);
                  setEditingPet(undefined);
                }}
              />
            </div>
          </div>
        )}

        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </div>
  );
}
