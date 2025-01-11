import { useState, useEffect } from 'react';
import { Pet, Category, Tag } from '../types/pet';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Save, Camera, PawPrint, Tag as TagIcon, Plus } from "lucide-react";

interface PetFormProps {
  pet?: Pet;
  onSubmit: (petData: Pet) => void;
  onCancel: () => void;
}

const CATEGORIES = [
  { id: 1, name: 'Perro' },
  { id: 2, name: 'Gato' },
  { id: 3, name: 'Ave' },
  { id: 4, name: 'Pez' },
  { id: 5, name: 'Reptil' },
  { id: 6, name: 'Otro' },
];

export const PetForm = ({ pet, onSubmit, onCancel }: PetFormProps) => {
  const [formData, setFormData] = useState<Pet>({
    id: pet?.id,
    category: pet?.category || { id: 1, name: 'Perro' },
    name: pet?.name || '',
    photoUrls: pet?.photoUrls || [''],
    tags: pet?.tags || [{ id: 1, name: '' }],
    status: pet?.status || 'available'
  });

  useEffect(() => {
    if (!pet?.id) {
      setFormData(prev => ({
        ...prev,
        id: Date.now()
      }));
    }
  }, [pet?.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validamos que todos los campos requeridos estén presentes
    if (!formData.name || !formData.photoUrls[0] || !formData.category || !formData.tags[0].name) {
      return;
    }
    onSubmit(formData);
  };

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategoryChange = (value: string) => {
    const category = CATEGORIES.find(cat => cat.name === value);
    if (category) {
      setFormData(prev => ({
        ...prev,
        category: category
      }));
    }
  };

  const handleTagChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.map((tag, i) => 
        i === index ? { ...tag, name: value } : tag
      )
    }));
  };

  const addTag = () => {
    setFormData(prev => ({
      ...prev,
      tags: [...prev.tags, { id: prev.tags.length + 1, name: '' }]
    }));
  };

  const removeTag = (index: number) => {
    if (formData.tags.length > 1) {
      setFormData(prev => ({
        ...prev,
        tags: prev.tags.filter((_, i) => i !== index)
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="p-6 border-b border-secondary-100">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-primary-gradient p-2 rounded-lg">
              <PawPrint className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-secondary-800">
                {pet ? 'Editar Mascota' : 'Nueva Mascota'}
              </h2>
              <p className="text-secondary-500 text-sm mt-1">
                {pet ? 'Actualiza los datos de la mascota' : 'Ingresa los datos de la nueva mascota'}
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onCancel}
            className="text-secondary-500 hover:text-secondary-600"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-secondary-700">Nombre *</Label>
          <Input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
            placeholder="Nombre de la mascota"
            className="border-secondary-200 focus:border-primary-300 focus:ring-primary-200"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category" className="text-secondary-700">Categoría *</Label>
          <Select
            value={formData.category.name}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger className="border-secondary-200 focus:border-primary-300 focus:ring-primary-200">
              <SelectValue placeholder="Selecciona una categoría" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map(category => (
                <SelectItem key={category.id} value={category.name}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="photoUrl" className="text-secondary-700">URL de la foto *</Label>
          <div className="relative">
            <Input
              type="url"
              id="photoUrl"
              value={formData.photoUrls[0]}
              onChange={(e) => setFormData(prev => ({ ...prev, photoUrls: [e.target.value] }))}
              required
              placeholder="https://ejemplo.com/foto.jpg"
              className="border-secondary-200 focus:border-primary-300 focus:ring-primary-200 pl-10"
            />
            <Camera className="absolute left-3 top-2.5 h-5 w-5 text-secondary-400" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label className="text-secondary-700">Etiquetas *</Label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={addTag}
              className="text-primary-600 hover:text-primary-700"
            >
              <Plus className="h-4 w-4 mr-1" />
              Agregar etiqueta
            </Button>
          </div>
          <div className="space-y-3">
            {formData.tags.map((tag, index) => (
              <div key={index} className="flex gap-2 items-center">
                <div className="relative flex-1">
                  <Input
                    value={tag.name}
                    onChange={(e) => handleTagChange(index, e.target.value)}
                    required
                    placeholder="Nombre de la etiqueta"
                    className="border-secondary-200 focus:border-primary-300 focus:ring-primary-200 pl-10"
                  />
                  <TagIcon className="absolute left-3 top-2.5 h-5 w-5 text-secondary-400" />
                </div>
                {formData.tags.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeTag(index)}
                    className="text-secondary-500 hover:text-secondary-600"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status" className="text-secondary-700">Estado *</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => handleChange('status', value)}
          >
            <SelectTrigger className="border-secondary-200 focus:border-primary-300 focus:ring-primary-200">
              <SelectValue placeholder="Selecciona un estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="available">Disponible</SelectItem>
              <SelectItem value="pending">Pendiente</SelectItem>
              <SelectItem value="sold">Vendido</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="p-6 bg-secondary-50 border-t border-secondary-100">
        <div className="flex gap-3">
          <Button
            type="submit"
            className="flex-1 bg-primary-gradient hover:bg-primary-gradient-hover transition-all"
          >
            <Save className="w-4 h-4 mr-2" />
            {pet ? 'Actualizar' : 'Crear'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1 border-secondary-200 hover:bg-secondary-100"
          >
            Cancelar
          </Button>
        </div>
      </div>
    </form>
  );
}; 