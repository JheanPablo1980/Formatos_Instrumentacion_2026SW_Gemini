import React, { useState } from 'react';
import { Plus, Save } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { Button } from './ui/Button';
import { InputGroup } from './ui/InputGroup';

export const NuevoRegistro: React.FC = () => {
  const addInstrumento = useAppStore(state => state.addInstrumento);
  const [formData, setFormData] = useState({
    TAG: '',
    DESCRIPCION: '',
    AREA: '',
    SISTEMA: '',
    TIPO_INSTRUMENTOS: '',
    SIGNAL_ASSOCIATION: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.TAG.trim()) {
      alert("El TAG es obligatorio.");
      return;
    }
    const nuevoInst = { ...formData, TAG: formData.TAG.trim().toUpperCase() };
    const success = await addInstrumento(nuevoInst);
    
    if (success) {
      alert(`Instrumento ${nuevoInst.TAG} agregado con éxito.`);
      setFormData({ TAG: '', DESCRIPCION: '', AREA: '', SISTEMA: '', TIPO_INSTRUMENTOS: '', SIGNAL_ASSOCIATION: '' });
    } else {
      alert("El TAG ya existe en la base de datos.");
    }
  };

  return (
    <div className="p-4 space-y-6 max-w-lg mx-auto pb-24">
      <h2 className="text-2xl font-bold text-[#1F3864] flex items-center gap-2">
        <Plus size={24} /> Nuevo TAG
      </h2>
      <p className="text-sm text-gray-500 mb-2">Registra manualmente un instrumento que no se encuentre en la base de datos cargada.</p>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputGroup 
            label="TAG (Obligatorio)" 
            name="TAG" 
            value={formData.TAG} 
            onChange={handleChange} 
            required 
            placeholder="Ej: PT-101" 
          />
          <InputGroup 
            label="Descripción" 
            name="DESCRIPCION" 
            value={formData.DESCRIPCION} 
            onChange={handleChange} 
            placeholder="Ej: SENSOR DE PRESIÓN" 
          />
          <div className="grid grid-cols-2 gap-4">
            <InputGroup 
              label="Área" 
              name="AREA" 
              value={formData.AREA} 
              onChange={handleChange} 
              placeholder="Ej: CALDERA" 
            />
            <InputGroup 
              label="Sistema" 
              name="SISTEMA" 
              value={formData.SISTEMA} 
              onChange={handleChange} 
              placeholder="Ej: SMC" 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <InputGroup 
              label="Tipo de Instrumento" 
              name="TIPO_INSTRUMENTOS" 
              value={formData.TIPO_INSTRUMENTOS} 
              onChange={handleChange} 
              placeholder="Ej: TRANSMITTER" 
            />
            <InputGroup 
              label="Ref. Plano / P&ID" 
              name="SIGNAL_ASSOCIATION" 
              value={formData.SIGNAL_ASSOCIATION} 
              onChange={handleChange} 
              placeholder="Ej: JB-01" 
            />
          </div>
          <div className="pt-4">
            <Button type="submit" variant="primary" icon={Save}>Guardar Instrumento</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
