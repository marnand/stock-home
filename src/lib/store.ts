import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Item {
  id: number;
  nome: string;
  marca: string;
  categoria: string;
  quantidadeAtual: number;
  quantidadeMinima: number;
  unidadeMedida: string;
  valorUnitario: number;
  dataUltimaCompra: string;
  dataValidade?: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  nome: string;
  email: string;
}

export interface InventoryStore {
  items: Item[];
  user: User | null;
  login: (email: string, nome: string) => void;
  logout: () => void;
  addItem: (item: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateItem: (id: number, item: Partial<Item>) => void;
  deleteItem: (id: number) => void;
  getTotalValue: () => number;
  getCriticalItems: () => Item[];
  getExpiringItems: () => Item[];
}

const MOCK_ITEMS: Item[] = [
  {
    id: 1,
    nome: "Sabão Líquido",
    marca: "Omo",
    categoria: "Limpeza",
    quantidadeAtual: 1,
    quantidadeMinima: 2,
    unidadeMedida: "L",
    valorUnitario: 35.90,
    dataUltimaCompra: "2023-12-15",
    dataValidade: "2025-06-01",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 2,
    nome: "Arroz Branco",
    marca: "Tio João",
    categoria: "Alimentos",
    quantidadeAtual: 4,
    quantidadeMinima: 2,
    unidadeMedida: "kg",
    valorUnitario: 22.50,
    dataUltimaCompra: "2024-01-10",
    dataValidade: "2024-12-30",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const useInventoryStore = create<InventoryStore>()(
  persist(
    (set, get) => ({
      items: MOCK_ITEMS,
      user: { id: '1', nome: 'Valentina', email: 'valentina@exemplo.com' }, // Mock user logado por padrão
      login: (email, nome) => set({ user: { id: Math.random().toString(), email, nome } }),
      logout: () => set({ user: null }),
      addItem: (newItem) => set((state) => ({
        items: [...state.items, {
          ...newItem,
          id: Math.max(0, ...state.items.map(i => i.id)) + 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }]
      })),
      updateItem: (id, updatedItem) => set((state) => ({
        items: state.items.map((item) => 
          item.id === id ? { ...item, ...updatedItem, updatedAt: new Date().toISOString() } : item
        )
      })),
      deleteItem: (id) => set((state) => ({
        items: state.items.filter((item) => item.id !== id)
      })),
      getTotalValue: () => {
        return get().items.reduce((acc, item) => acc + (item.quantidadeAtual * item.valorUnitario), 0);
      },
      getCriticalItems: () => {
        return get().items.filter(item => item.quantidadeAtual <= item.quantidadeMinima);
      },
      getExpiringItems: () => {
        const today = new Date();
        const nextMonth = new Date();
        nextMonth.setMonth(today.getMonth() + 1);
        return get().items.filter(item => {
          if (!item.dataValidade) return false;
          const validade = new Date(item.dataValidade);
          return validade <= nextMonth;
        });
      }
    }),
    {
      name: 'inventory-storage',
    }
  )
);
