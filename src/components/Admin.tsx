import React, { useState, useRef } from 'react';
import { Database, Image as ImageIcon, FileSpreadsheet } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { Button } from './ui/Button';
import * as XLSX from 'xlsx';

export const Admin: React.FC = () => {
  const { instrumentos, loadInstrumentosBulk, logoBase64, saveLogo } = useAppStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsProcessing(true);
    
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const workbook = XLSX.read(bstr, { type: 'binary' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const rawJson = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        const formattedData: any = rawJson.map((row: any) => {
          const findKey = (keys: string[]) => {
            const rowKeys = Object.keys(row);
            for (const k of keys) {
              const found = rowKeys.find(rk => rk.trim().toUpperCase() === k.toUpperCase());
              if (found) return row[found];
            }
            return '';
          };
          return {
            TAG: findKey(['TAG', 'TAG NO']), 
            DESCRIPCION: findKey(['DESCRIPTION', 'DESCRIPCION']),
            AREA: findKey(['AREA', 'ÁREA']), 
            SISTEMA: findKey(['SISTEMA', 'SYSTEM']),
            TIPO_INSTRUMENTOS: findKey(['TIPO INSTRUMENTOS', 'TIPO']),
            SIGNAL_ASSOCIATION: findKey(['SIGNAL ASSOCIATION', 'REF PLANO', 'PLANO', 'ASOCIACION'])
          };
        }).filter(item => item.TAG && item.TAG.toString().trim() !== '');

        await loadInstrumentosBulk(formattedData);
        alert(`✅ Importación exitosa: ${formattedData.length} instrumentos.`);
      } catch (error) { 
        alert("Error leyendo el archivo."); 
      } finally { 
        setIsProcessing(false); 
        if(fileInputRef.current) fileInputRef.current.value = ''; 
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        saveLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    } catch (error) { 
      alert("Error al guardar el logo."); 
    }
  };

  return (
    <div className="p-4 space-y-6 max-w-lg mx-auto pb-24">
      <h2 className="text-2xl font-bold text-[#1F3864] flex items-center gap-2">
        <Database size={24} /> Base de Datos & Configuración
      </h2>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center space-y-4">
        <h3 className="font-bold text-[#1F3864] text-lg border-b pb-2">Logo del Formato</h3>
        {logoBase64 && (
          <div className="bg-gray-50 border p-2 rounded-lg inline-block w-full max-w-[200px] h-[80px] flex items-center justify-center">
            <img src={logoBase64} alt="Logo" className="max-w-full max-h-full object-contain" />
          </div>
        )}
        <p className="text-sm text-gray-500">Este logo aparecerá en el encabezado de los reportes PDF y Excel.</p>
        <input type="file" accept="image/*" className="hidden" ref={logoInputRef} onChange={handleLogoUpload} />
        <Button onClick={() => logoInputRef.current?.click()} icon={ImageIcon} variant="secondary">
          {logoBase64 ? 'Cambiar Logo' : 'Subir Logo'}
        </Button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center space-y-4">
        <h3 className="font-bold text-[#1F3864] text-lg border-b pb-2">Listado Maestro de TAGs</h3>
        <p className="text-sm text-gray-500">Sube el archivo Excel o CSV con el listado de TAGs de instrumentación.</p>
        <input type="file" accept=".xlsx, .xls, .csv" className="hidden" ref={fileInputRef} onChange={processFile} />
        <Button onClick={() => fileInputRef.current?.click()} icon={FileSpreadsheet} disabled={isProcessing}>
          {isProcessing ? 'Procesando...' : 'Cargar Base de Datos'}
        </Button>
      </div>

      <div className="bg-[#1F3864] text-white p-6 rounded-xl shadow-lg flex items-center justify-between">
        <div>
          <p className="text-xs text-blue-200 font-semibold tracking-wider uppercase">Total Instrumentos Cargados</p>
          <p className="text-4xl font-bold">{instrumentos.length}</p>
        </div>
        <Database className="text-blue-800 opacity-50" size={48} />
      </div>
    </div>
  );
};
