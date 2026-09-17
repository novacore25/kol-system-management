export interface AdminApplicationItem {
  id: string;
  creatorName: string;
  creatorAvatar: string;
  whatsappNumber: string;
  tiktokHandle: string;
  followersCount: string;
  tier: "TIER_1" | "TIER_2" | "TIER_3" | "TIER_4" | "TIER_5";
  niche: string;
  completionRate: string;
  campaignId: string;
  campaignTitle: string;
  brandName: string;
  appliedDate: string;
  status: "PENDING_REVIEW" | "APPROVED" | "REJECTED" | "DISPATCHED";
  rejectionReason?: string;
  // Shipping info
  shippingAddress: {
    recipientName: string;
    phone: string;
    province: string;
    city: string;
    district: string;
    postalCode: string;
    street: string;
  };
  // Logistics
  courierName?: string;
  trackingNumber?: string;
  dispatchedAt?: string;
}

export const initialApplications: AdminApplicationItem[] = [
  {
    id: "APP-101",
    creatorName: "Hibban Nazala",
    creatorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
    whatsappNumber: "089624272784",
    tiktokHandle: "@banibanzl",
    followersCount: "12.4K",
    tier: "TIER_2",
    niche: "Beauty & Skincare",
    completionRate: "98.5%",
    campaignId: "1",
    campaignTitle: "[MAKE OVER] Velvet Mattifying Cushion Special 9.9",
    brandName: "Make Over",
    appliedDate: "17 Sep 2026 09:30",
    status: "PENDING_REVIEW",
    shippingAddress: {
      recipientName: "Hibban Nazala",
      phone: "089624272784",
      province: "DKI JAKARTA",
      city: "KOTA JAKARTA PUSAT",
      district: "KEMAYORAN",
      postalCode: "10650",
      street: "Jl. Taruna Jaya No.42, RT.011, RW.002, Serdang",
    },
  },
  {
    id: "APP-102",
    creatorName: "Siti Rahmawati",
    creatorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop",
    whatsappNumber: "081234567890",
    tiktokHandle: "@siti_glowup",
    followersCount: "45.2K",
    tier: "TIER_2",
    niche: "Beauty & Teen",
    completionRate: "100%",
    campaignId: "2",
    campaignTitle: "[EMINA] Glossy Tinted Glow Balm x Daily Fresh",
    brandName: "Emina",
    appliedDate: "17 Sep 2026 10:15",
    status: "APPROVED",
    shippingAddress: {
      recipientName: "Siti Rahmawati",
      phone: "081234567890",
      province: "JAWA BARAT",
      city: "KOTA BANDUNG",
      district: "COBLONG",
      postalCode: "40132",
      street: "Jl. Dago Asri No. 15, RT 02/05",
    },
  },
  {
    id: "APP-103",
    creatorName: "Dimas Pratama",
    creatorAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop",
    whatsappNumber: "085712349876",
    tiktokHandle: "@dimas_grooming",
    followersCount: "8.7K",
    tier: "TIER_1",
    niche: "Men Grooming",
    completionRate: "95.0%",
    campaignId: "3",
    campaignTitle: "[KAHF] Oil and Acne Care Face Wash Seeding",
    brandName: "Kahf",
    appliedDate: "16 Sep 2026 16:40",
    status: "DISPATCHED",
    courierName: "J&T Express",
    trackingNumber: "JT9928174620ID",
    dispatchedAt: "17 Sep 2026 08:00",
    shippingAddress: {
      recipientName: "Dimas Pratama",
      phone: "085712349876",
      province: "DI YOGYAKARTA",
      city: "KABUPATEN SLEMAN",
      district: "DEPOK",
      postalCode: "55281",
      street: "Jl. Kaliurang KM 5.5 No. 8, Caturtunggal",
    },
  },
  {
    id: "APP-104",
    creatorName: "Amanda Putri",
    creatorAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop",
    whatsappNumber: "087812903456",
    tiktokHandle: "@amanda_skin",
    followersCount: "3.2K",
    tier: "TIER_1",
    niche: "Skincare",
    completionRate: "70.0%",
    campaignId: "4",
    campaignTitle: "[SKINTIFIC] 5X Ceramide Barrier Repair",
    brandName: "Skintific",
    appliedDate: "16 Sep 2026 14:20",
    status: "REJECTED",
    rejectionReason: "Jumlah followers belum mencapai minimum kuota campaign (min. 5K)",
    shippingAddress: {
      recipientName: "Amanda Putri",
      phone: "087812903456",
      province: "JAWA TIMUR",
      city: "KOTA SURABAYA",
      district: "GUBENG",
      postalCode: "60281",
      street: "Jl. Dharmawangsa No. 20",
    },
  },
];
