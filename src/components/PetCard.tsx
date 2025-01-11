import Image from 'next/image';
import { Pet } from '../types/pet';
import { useState } from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, ShoppingCart, CheckCircle2 } from "lucide-react";
import { OrderModal } from './OrderModal';

interface PetCardProps {
  pet: Pet;
  onEdit?: () => void;
  onBuy?: (quantity: number) => void;
}

const isValidUrl = (urlString: string): boolean => {
  try {
    new URL(urlString);
    return true;
  } catch (e) {
    return false;
  }
};

const getStatusColor = (status: string = 'available') => {
  switch (status) {
    case 'available':
      return 'bg-success-50 text-success-700 border-success-200';
    case 'pending':
      return 'bg-primary-50 text-primary-700 border-primary-200';
    case 'sold':
      return 'bg-brand-50 text-brand-700 border-brand-200';
    default:
      return 'bg-secondary-50 text-secondary-700 border-secondary-200';
  }
};

const getStatusText = (status: string = 'available') => {
  switch (status) {
    case 'available':
      return 'Disponible';
    case 'pending':
      return 'Pendiente';
    case 'sold':
      return 'Vendido';
    default:
      return status;
  }
};

const getButtonConfig = (status: string = 'available') => {
  switch (status) {
    case 'available':
      return {
        text: 'Ordenar',
        icon: <ShoppingCart className="w-4 h-4 mr-2" />,
        className: 'w-full bg-primary-gradient hover:bg-primary-gradient-hover hover:opacity-90 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] transform duration-200'
      };
    case 'pending':
      return {
        text: 'En Proceso',
        icon: <ShoppingCart className="w-4 h-4 mr-2" />,
        className: 'w-full bg-secondary-100 text-secondary-500 cursor-not-allowed'
      };
    case 'sold':
      return {
        text: 'Vendido',
        icon: <CheckCircle2 className="w-4 h-4 mr-2" />,
        className: 'w-full bg-brand-50 text-brand-600 border border-brand-200 cursor-not-allowed'
      };
    default:
      return {
        text: 'No Disponible',
        icon: <ShoppingCart className="w-4 h-4 mr-2" />,
        className: 'w-full bg-secondary-100 text-secondary-500 cursor-not-allowed'
      };
  }
};

export const PetCard = ({ pet, onEdit, onBuy }: PetCardProps) => {
  const [imageError, setImageError] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);

  const imageUrl = pet.photoUrls[0] && isValidUrl(pet.photoUrls[0]) && !imageError
    ? pet.photoUrls[0]
    : '/placeholder-pet.svg';

  const buttonConfig = getButtonConfig(pet.status);

  const handleOrder = (quantity: number) => {
    if (onBuy) {
      onBuy(quantity);
      setShowOrderModal(false);
    }
  };

  return (
    <>
      <Card className="overflow-hidden group hover:shadow-lg transition-shadow duration-300">
        <div className="relative">
          <div className="relative h-48 w-full overflow-hidden bg-secondary-100">
            <Image
              src={imageUrl}
              alt={`Foto de ${pet.name}${pet.category ? ` - ${pet.category.name}` : ''}`}
              fill
              className="object-cover transform group-hover:scale-105 transition-transform duration-300"
              onError={() => setImageError(true)}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              loading="lazy"
            />
          </div>
          {onEdit && pet.status === 'available' && (
            <Button
              onClick={onEdit}
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 bg-white/80 hover:bg-white shadow-sm backdrop-blur-sm"
            >
              <Edit className="w-4 h-4 text-secondary-600" />
            </Button>
          )}
        </div>
        <CardContent className="p-5">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-medium text-secondary-800">{pet.name}</h3>
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(pet.status)}`}>
              {getStatusText(pet.status)}
            </span>
          </div>
          
          {pet.category && (
            <p className="text-sm text-secondary-600">
              {pet.category.name}
            </p>
          )}
        </CardContent>
        
        <CardFooter className="px-5 pb-5 pt-0">
          <Button
            onClick={() => pet.status === 'available' ? setShowOrderModal(true) : undefined}
            disabled={pet.status !== 'available'}
            className={buttonConfig.className}
          >
            {buttonConfig.icon}
            {buttonConfig.text}
          </Button>
        </CardFooter>
      </Card>

      {showOrderModal && (
        <OrderModal
          pet={pet}
          isOpen={showOrderModal}
          onClose={() => setShowOrderModal(false)}
          onConfirm={handleOrder}
        />
      )}
    </>
  );
}; 