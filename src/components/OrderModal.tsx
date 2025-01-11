import { Pet } from '../types/pet';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from 'react';
import { ShoppingCart } from 'lucide-react';

interface OrderModalProps {
  pet: Pet;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (quantity: number) => void;
}

export const OrderModal = ({ pet, isOpen, onClose, onConfirm }: OrderModalProps) => {
  const [quantity, setQuantity] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(quantity);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-secondary-800">
            <div className="bg-primary-gradient p-2 rounded-lg">
              <ShoppingCart className="h-5 w-5 text-white" />
            </div>
            Ordenar Mascota
          </DialogTitle>
          <DialogDescription className="text-secondary-600">
            Estás a punto de ordenar a {pet.name}. Por favor confirma los detalles de tu orden.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="quantity" className="text-secondary-700">
              Cantidad
            </Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="border-secondary-200 focus:border-primary-300 focus:ring-primary-200"
            />
          </div>

          <div className="bg-secondary-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-secondary-700 mb-2">Detalles de la Mascota</h4>
            <div className="space-y-1">
              <p className="text-sm text-secondary-600">
                <span className="font-medium">Nombre:</span> {pet.name}
              </p>
              {pet.category && (
                <p className="text-sm text-secondary-600">
                  <span className="font-medium">Categoría:</span> {pet.category.name}
                </p>
              )}
              <p className="text-sm text-secondary-600">
                <span className="font-medium">Estado:</span> Disponible
              </p>
            </div>
          </div>
        </form>

        <DialogFooter className="gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1 border-secondary-200 hover:bg-secondary-100"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            onClick={() => onConfirm(quantity)}
            className="flex-1 bg-primary-gradient hover:bg-primary-gradient-hover transition-all"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Confirmar Orden
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 