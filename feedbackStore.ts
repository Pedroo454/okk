
import { FeedbackEntry } from './types';
// Importações oficiais do Firebase via CDN compatível com ES6
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  query, 
  orderBy 
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

/**
 * CONFIGURAÇÃO ATUALIZADA:
 * Agora o site está conectado ao projeto 'amero-18031'.
 * Lembre-se de ativar o Firestore no Console do Firebase e colocar as regras em "Modo de Teste".
 */
const firebaseConfig = {
  apiKey: "AIzaSyBxrqQN_V7pK5Se6UA_Puj0PRu_5gYswtc",
  authDomain: "amero-18031.firebaseapp.com",
  projectId: "amero-18031",
  storageBucket: "amero-18031.firebasestorage.app",
  messagingSenderId: "498834482489",
  appId: "1:498834482489:web:63a37c2c698f466ce974e8",
  measurementId: "G-C4GCFZG880"
};

// Inicialização segura
let db: any = null;
// Verifica se a chave foi alterada da padrão anterior
const IS_CONFIGURED = firebaseConfig.apiKey !== "SUA_API_KEY" && firebaseConfig.apiKey !== "";

try {
  if (IS_CONFIGURED) {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
  }
} catch (e) {
  console.error("Erro ao conectar com Firebase:", e);
}

export const feedbackStore = {
  isConfigured: () => IS_CONFIGURED,

  // Salva no Banco de Dados Cloud
  save: async (entry: Omit<FeedbackEntry, 'id' | 'timestamp'>): Promise<void> => {
    if (!db) {
      console.warn("Firebase não configurado. Salvando apenas NESTE aparelho.");
      const current = JSON.parse(localStorage.getItem('fallback_feedbacks') || '[]');
      current.unshift({ ...entry, id: Date.now().toString(), timestamp: new Date().toLocaleString() });
      localStorage.setItem('fallback_feedbacks', JSON.stringify(current));
      return;
    }

    try {
      await addDoc(collection(db, 'feedbacks'), {
        ...entry,
        timestamp: new Date().toLocaleString('pt-BR'),
        serverTimestamp: new Date()
      });
    } catch (error) {
      console.error("Erro ao salvar no Firestore:", error);
      throw error;
    }
  },

  // Busca de qualquer dispositivo
  getAll: async (): Promise<FeedbackEntry[]> => {
    if (!db) {
      return JSON.parse(localStorage.getItem('fallback_feedbacks') || '[]');
    }

    try {
      const q = query(collection(db, 'feedbacks'), orderBy('serverTimestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      const results: FeedbackEntry[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        results.push({
          id: doc.id,
          name: data.name,
          grade: data.grade,
          category: data.category,
          message: data.message,
          anonymous: data.anonymous,
          timestamp: data.timestamp
        });
      });
      
      return results;
    } catch (error) {
      console.error("Erro ao buscar do Firestore:", error);
      return [];
    }
  },

  // Remove do Cloud
  remove: async (id: string): Promise<void> => {
    if (!db) {
      const current = JSON.parse(localStorage.getItem('fallback_feedbacks') || '[]');
      const filtered = current.filter((f: any) => f.id !== id);
      localStorage.setItem('fallback_feedbacks', JSON.stringify(filtered));
      return;
    }
    try {
      await deleteDoc(doc(db, 'feedbacks', id));
    } catch (error) {
      console.error("Erro ao remover do Firestore:", error);
    }
  },

  // Exporta o relatório consolidado
  exportJSON: async () => {
    const data = await feedbackStore.getAll();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `relatorio_americo_nuvem.json`;
    link.click();
    URL.revokeObjectURL(url);
  }
};
