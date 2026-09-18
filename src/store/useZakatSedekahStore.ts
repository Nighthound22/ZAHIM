import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SedekahItem {
  id: string;
  amount: number;
  category: 'subuh' | 'jumat' | 'harian' | 'infaq';
  note?: string;
  createdAt: string; // ISO string
  date: string; // YYYY-MM-DD
}

export interface ZakatState {
  // Sedekah Tracker
  sedekahLogs: SedekahItem[];
  addSedekah: (amount: number, category?: 'subuh' | 'jumat' | 'harian' | 'infaq', note?: string) => void;
  getMonthlyTotalSedekah: (year?: number, month?: number) => number;
  getSedekahStreak: () => number;
  isTodaySedekahRecorded: () => boolean;

  // Zakat Calculator state
  goldPricePerGram: number; // e.g. 1.400.000
  setGoldPrice: (price: number) => void;

  // Zakat Profesi inputs
  monthlySalary: number;
  monthlySideIncome: number;
  monthlyEssentialNeeds: number;
  setZakatProfesiInputs: (salary: number, sideIncome: number, essentialNeeds: number) => void;

  // Zakat Maal inputs
  savingsBalance: number;
  goldInvestedGrams: number;
  propertyInvestments: number;
  setZakatMaalInputs: (savings: number, goldGrams: number, property: number) => void;

  // Helpers
  calculateZakatProfesi: () => {
    grossIncome: number;
    netIncome: number;
    monthlyNisab: number;
    isWajib: boolean;
    zakatAmount: number;
  };

  calculateZakatMaal: () => {
    totalWealth: number;
    annualNisab: number;
    isWajib: boolean;
    zakatAmount: number;
  };

  loadStoredData: () => Promise<void>;
}

const STORAGE_KEY = '@zahim_zakat_sedekah_v1';

const getTodayDateStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
};

export const useZakatSedekahStore = create<ZakatState>((set, get) => ({
  sedekahLogs: [
    {
      id: 'demo-1',
      amount: 25000,
      category: 'subuh',
      note: 'Sedekah Subuh Berkah',
      createdAt: new Date().toISOString(),
      date: getTodayDateStr()
    }
  ],
  goldPricePerGram: 1400000, // Rp 1.400.000 / gram acuan BAZNAS

  monthlySalary: 12500000,
  monthlySideIncome: 2000000,
  monthlyEssentialNeeds: 4500000,

  savingsBalance: 145000000,
  goldInvestedGrams: 25,
  propertyInvestments: 0,

  loadStoredData: async () => {
    try {
      const json = await AsyncStorage.getItem(STORAGE_KEY);
      if (json) {
        const parsed = JSON.parse(json);
        set({
          sedekahLogs: parsed.sedekahLogs || get().sedekahLogs,
          goldPricePerGram: parsed.goldPricePerGram || 1400000,
          monthlySalary: parsed.monthlySalary ?? 12500000,
          monthlySideIncome: parsed.monthlySideIncome ?? 2000000,
          monthlyEssentialNeeds: parsed.monthlyEssentialNeeds ?? 4500000,
          savingsBalance: parsed.savingsBalance ?? 145000000,
          goldInvestedGrams: parsed.goldInvestedGrams ?? 25,
          propertyInvestments: parsed.propertyInvestments ?? 0,
        });
      }
    } catch {
      // Fallback
    }
  },

  addSedekah: (amount, category = 'subuh', note) => {
    const today = getTodayDateStr();
    const newItem: SedekahItem = {
      id: 'sedekah-' + Date.now(),
      amount,
      category,
      note: note || (category === 'subuh' ? 'Sedekah Subuh' : 'Sedekah Kebaikan'),
      createdAt: new Date().toISOString(),
      date: today
    };

    const updated = [newItem, ...get().sedekahLogs];
    set({ sedekahLogs: updated });

    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({
      ...get(),
      sedekahLogs: updated
    })).catch(() => {});
  },

  getMonthlyTotalSedekah: (year, month) => {
    const now = new Date();
    const targetYear = year ?? now.getFullYear();
    const targetMonth = month ?? now.getMonth() + 1;
    const prefix = `${targetYear}-${targetMonth.toString().padStart(2, '0')}`;

    return get().sedekahLogs
      .filter((item) => item.date.startsWith(prefix))
      .reduce((sum, curr) => sum + curr.amount, 0);
  },

  getSedekahStreak: () => {
    const logs = get().sedekahLogs;
    if (logs.length === 0) return 0;

    const uniqueDates = Array.from(new Set(logs.map((l) => l.date))).sort().reverse();
    const today = getTodayDateStr();
    
    // Check if recorded today or yesterday
    let streak = 0;
    const checkDate = new Date();
    
    // If not logged today, start check from yesterday
    if (!uniqueDates.includes(today)) {
      checkDate.setDate(checkDate.getDate() - 1);
    }

    for (let i = 0; i < 365; i++) {
      const dateStr = `${checkDate.getFullYear()}-${(checkDate.getMonth() + 1).toString().padStart(2, '0')}-${checkDate.getDate().toString().padStart(2, '0')}`;
      if (uniqueDates.includes(dateStr)) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  },

  isTodaySedekahRecorded: () => {
    const today = getTodayDateStr();
    return get().sedekahLogs.some((l) => l.date === today);
  },

  setGoldPrice: (price) => {
    set({ goldPricePerGram: price });
  },

  setZakatProfesiInputs: (salary, sideIncome, essentialNeeds) => {
    set({
      monthlySalary: salary,
      monthlySideIncome: sideIncome,
      monthlyEssentialNeeds: essentialNeeds
    });
  },

  setZakatMaalInputs: (savings, goldGrams, property) => {
    set({
      savingsBalance: savings,
      goldInvestedGrams: goldGrams,
      propertyInvestments: property
    });
  },

  calculateZakatProfesi: () => {
    const { monthlySalary, monthlySideIncome, monthlyEssentialNeeds, goldPricePerGram } = get();
    const grossIncome = monthlySalary + monthlySideIncome;
    const netIncome = Math.max(0, grossIncome - monthlyEssentialNeeds);
    
    // Nisab zakat profesi = 85 gram emas per tahun / 12 bulan
    const annualNisab = 85 * goldPricePerGram;
    const monthlyNisab = Math.round(annualNisab / 12);
    
    const isWajib = grossIncome >= monthlyNisab;
    const zakatAmount = isWajib ? Math.round(grossIncome * 0.025) : 0;

    return {
      grossIncome,
      netIncome,
      monthlyNisab,
      isWajib,
      zakatAmount
    };
  },

  calculateZakatMaal: () => {
    const { savingsBalance, goldInvestedGrams, propertyInvestments, goldPricePerGram } = get();
    const goldValue = goldInvestedGrams * goldPricePerGram;
    const totalWealth = savingsBalance + goldValue + propertyInvestments;
    
    // Nisab zakat maal = 85 gram emas
    const annualNisab = 85 * goldPricePerGram;
    const isWajib = totalWealth >= annualNisab;
    const zakatAmount = isWajib ? Math.round(totalWealth * 0.025) : 0;

    return {
      totalWealth,
      annualNisab,
      isWajib,
      zakatAmount
    };
  }
}));
