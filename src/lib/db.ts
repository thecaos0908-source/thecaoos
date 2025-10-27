import { addDoc, collection, deleteDoc, doc, getDocs, Timestamp } from 'firebase/firestore';
import { db } from './firebase';
import type { TicketRegistration } from './storage';

// Habilita o DB por padrão; pode ser desativado com VITE_USE_DB="false"
const enabled = (import.meta as any).env?.VITE_USE_DB !== 'false';

const col = () => collection(db, 'tickets');

export const ticketsDb = {
  isEnabled: () => enabled,

  save: async (data: Omit<TicketRegistration, 'createdAt'>) => {
    const payload = {
      ...data,
      createdAt: Timestamp.now(),
    };
    const ref = await addDoc(col(), payload);
    return { ...data, createdAt: new Date().toISOString(), id: data.id } as TicketRegistration;
  },

  list: async (): Promise<TicketRegistration[]> => {
    const snap = await getDocs(col());
    return snap.docs.map(d => {
      const data = d.data() as any;
      return {
        id: data.id,
        name: data.name,
        email: data.email,
        paid: data.paid,
        token: data.token,
        paymentId: data.paymentId,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
      } as TicketRegistration;
    });
  },

  remove: async (id: string) => {
    const snap = await getDocs(col());
    const match = snap.docs.find(d => (d.data() as any).id === id);
    if (!match) return false;
    await deleteDoc(doc(db, 'tickets', match.id));
    return true;
  },
};


