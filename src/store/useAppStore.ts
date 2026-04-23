import { create } from 'zustand';
import { initDB } from '../lib/db';

export interface Instrumento {
  TAG: string;
  DESCRIPCION: string;
  AREA: string;
  SISTEMA: string;
  TIPO_INSTRUMENTOS: string;
  SIGNAL_ASSOCIATION: string;
}

export interface Foto {
  id: string;
  TAG: string;
  blobData: string;
  nombre_archivo: string;
  observacion: string;
  timestamp: string;
  estado: string;
}

export interface Perfil {
  ID_PERFIL: string;
  NOMBRE_PERFIL: string;
  CLIENTE: string;
  PROYECTO: string;
  CONTRATO: string;
  REVISION: string;
  FECHA_REVISION: string;
  FECHA: string;
  FABRICANTE_MODELO: string;
  RANGO_OPERACION: string;
  CLASE_EXACTITUD: string;
  NORMA_PROCEDIMIENTO: string;
  TIPO_PRUEBA_PLANO: boolean;
  TIPO_PRUEBA_LOOP: boolean;
  TIPO_PRUEBA_FUNC_SIM: boolean;
  TIPO_PRUEBA_FUNC_LINEA: boolean;
  EQUIPO_PRUEBA_1: string;
  CERT_FECHA_1: string;
  EQUIPO_PRUEBA_2: string;
  CERT_FECHA_2: string;
  LOOP_C1: string;
  LOOP_C2: string;
  LOOP_C3: string;
  L1_C1: string;
  L1_C2: string;
  L1_C3: string;
  L2_C1: string;
  L2_C2: string;
  L2_C3: string;
  L3_C1: string;
  L3_C2: string;
  L3_C3: string;
  INSP_4_1: string;
  OBS_4_1: string;
  LABEL_4_1: string;
  INSP_4_2: string;
  OBS_4_2: string;
  LABEL_4_2: string;
  INSP_4_3: string;
  OBS_4_3: string;
  LABEL_4_3: string;
  INSP_4_4: string;
  OBS_4_4: string;
  LABEL_4_4: string;
  COMENTARIOS: string;
  ELABORO_NOMBRE: string;
  ELABORO_CARGO: string;
  ELABORO_FIRMA: string;
  REVISO_NOMBRE: string;
  REVISO_CARGO: string;
  REVISO_FIRMA: string;
  APROBO_NOMBRE: string;
  APROBO_CARGO: string;
  APROBO_FIRMA: string;
  timestamp?: string;
}

interface AppState {
  perfiles: Perfil[];
  fotos: Foto[];
  instrumentos: Instrumento[];
  logoBase64: string | null;
  loadData: () => Promise<void>;
  savePerfil: (perfil: Perfil) => Promise<void>;
  deletePerfil: (id: string) => Promise<void>;
  saveFoto: (fotoData: Foto) => Promise<void>;
  deleteFoto: (id: string) => Promise<void>;
  loadInstrumentosBulk: (dataArray: Instrumento[]) => Promise<void>;
  addInstrumento: (inst: Instrumento) => Promise<boolean>;
  saveLogo: (base64: string) => Promise<void>;
}

export const useAppStore = create<AppState>((set) => ({
  perfiles: [],
  fotos: [],
  instrumentos: [],
  logoBase64: null,

  loadData: async () => {
    const db = await initDB();
    const perfiles = await db.getAll('perfiles');
    const fotos = await db.getAll('fotos');
    const instrumentos = await db.getAll('instrumentos');
    const configLogo = await db.get('config', 'logo');
    set({ perfiles, fotos, instrumentos, logoBase64: configLogo?.value || null });
  },

  savePerfil: async (perfil) => {
    const db = await initDB();
    await db.put('perfiles', perfil);
    set((state) => ({ 
      perfiles: [...state.perfiles.filter(p => p.ID_PERFIL !== perfil.ID_PERFIL), perfil] 
    }));
  },

  deletePerfil: async (id) => {
    const db = await initDB();
    await db.delete('perfiles', id);
    set((state) => ({ perfiles: state.perfiles.filter(p => p.ID_PERFIL !== id) }));
  },

  saveFoto: async (fotoData) => {
    const db = await initDB();
    await db.put('fotos', fotoData);
    set((state) => ({ 
      fotos: [...state.fotos.filter(f => f.id !== fotoData.id), fotoData] 
    }));
  },

  deleteFoto: async (id) => {
    const db = await initDB();
    await db.delete('fotos', id);
    set((state) => ({ fotos: state.fotos.filter(p => p.id !== id) }));
  },

  loadInstrumentosBulk: async (dataArray) => {
    const db = await initDB();
    const tx = db.transaction('instrumentos', 'readwrite');
    await tx.store.clear();
    for (const item of dataArray) await tx.store.put(item);
    await tx.done;
    set({ instrumentos: dataArray });
  },

  addInstrumento: async (inst) => {
    const db = await initDB();
    const exists = await db.get('instrumentos', inst.TAG);
    if (exists) {
      return false;
    }
    await db.put('instrumentos', inst);
    set((state) => ({ instrumentos: [...state.instrumentos, inst] }));
    return true;
  },

  saveLogo: async (base64) => {
    const db = await initDB();
    await db.put('config', { id: 'logo', value: base64 });
    set({ logoBase64: base64 });
  }
}));
