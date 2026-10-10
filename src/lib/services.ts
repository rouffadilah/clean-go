export type CleaningService = {
  id: string;
  name: string;
  description: string;
  duration: string;
  startingPrice: number;
  icon: string;
  popular?: boolean;
};

export const cleaningServices: CleaningService[] = [
  {
    id: "home-cleaning",
    name: "Home Cleaning",
    description: "Bersih menyeluruh untuk rumah, apartemen, dan hunian keluarga.",
    duration: "2–4 jam",
    startingPrice: 120000,
    icon: "home",
    popular: true,
  },
  {
    id: "deep-cleaning",
    name: "Deep Cleaning",
    description: "Pembersihan lebih detail untuk area yang membutuhkan perhatian ekstra.",
    duration: "4–6 jam",
    startingPrice: 250000,
    icon: "sparkles",
    popular: true,
  },
  {
    id: "office-cleaning",
    name: "Office Cleaning",
    description: "Lingkungan kerja yang rapi dan nyaman untuk tim Anda.",
    duration: "3–5 jam",
    startingPrice: 200000,
    icon: "building",
  },
  {
    id: "sofa-mattress",
    name: "Sofa & Mattress",
    description: "Perawatan sofa dan kasur agar terasa lebih segar.",
    duration: "1–3 jam",
    startingPrice: 150000,
    icon: "armchair",
  },
  {
    id: "move-in-out",
    name: "Move In / Move Out",
    description: "Bersihkan hunian sebelum ditempati atau setelah pindah.",
    duration: "4–6 jam",
    startingPrice: 300000,
    icon: "boxes",
  },
  {
    id: "kitchen-cleaning",
    name: "Kitchen Cleaning",
    description: "Fokus pada meja, area masak, dan permukaan dapur.",
    duration: "2–3 jam",
    startingPrice: 175000,
    icon: "chef-hat",
  },
];

export function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}
