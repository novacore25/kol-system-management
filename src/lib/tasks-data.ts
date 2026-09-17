export interface CreatorTaskItem {
  id: string;
  campaignId: string;
  campaignTitle: string;
  brandName: string;
  bannerUrl: string;
  commissionRateText: string;
  status:
    | "PENDING_REVIEW"
    | "SAMPLE_DISPATCHED"
    | "WAITING_POST"
    | "VIDEO_DETECTED"
    | "REJECTED";
  rejectionReason?: string;
  
  // Logistics
  courierName?: string;
  trackingNumber?: string;
  dispatchedDate?: string;
  estimatedArrival?: string;
  trackingTimeline?: {
    date: string;
    title: string;
    description: string;
    isCompleted: boolean;
  }[];

  // SOW & Guidelines
  deadlineDate: string;
  daysRemaining: number;
  mandatoryHashtags: string[];
  mandatoryMentions: string[];
  soundUrl?: string;
  targetAffiliateLink: string;
  sowChecklist: string[];

  // Video Tracking
  detectedVideo?: {
    videoId: string;
    videoUrl: string;
    title: string;
    coverUrl: string;
    viewsCount: string;
    likesCount: string;
    commentsCount: string;
    postDate: string;
    isBasketVerified: boolean;
  };
}

export const initialCreatorTasks: CreatorTaskItem[] = [
  {
    id: "task-1",
    campaignId: "1",
    campaignTitle: "[MAKE OVER] Velvet Mattifying Cushion Special 9.9",
    brandName: "Make Over Indonesia",
    bannerUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=800&auto=format&fit=crop",
    commissionRateText: "Komisi 18%",
    status: "VIDEO_DETECTED",
    deadlineDate: "30 Sep 2026",
    daysRemaining: 13,
    courierName: "J&T Express",
    trackingNumber: "JT8829104821ID",
    dispatchedDate: "12 Sep 2026",
    estimatedArrival: "14 Sep 2026",
    trackingTimeline: [
      { date: "12 Sep 10:00", title: "Paket Dikirim dari Gudang Agency", description: "Nomor resi JT8829104821ID diterbitkan", isCompleted: true },
      { date: "13 Sep 14:20", title: "Paket Tiba di Hub Jakarta Pusat", description: "Paket sedang dibawa kurir ke alamat", isCompleted: true },
      { date: "14 Sep 11:30", title: "Sampel Berhasil Diterima", description: "Diterima oleh Hibban Nazala", isCompleted: true },
    ],
    mandatoryHashtags: ["#MakeOver99", "#VelvetCushion", "#ComplexionMatte", "#NusantaraCreator"],
    mandatoryMentions: ["@makeoverid"],
    soundUrl: "https://www.tiktok.com/music/Make-Over-99-Official-Sound-71289123891",
    targetAffiliateLink: "https://shop.tiktok.com/view/product/172981928391?source=agency_tap_nusantara",
    sowChecklist: [
      "Durasi video minimal 35 detik",
      "Pencahayaan terang & jelas",
      "Hook 3 detik pertama menampilkan coverage kulit",
      "Wajib menyematkan tautan keranjang kuning resmi",
    ],
    detectedVideo: {
      videoId: "7281920192831",
      videoUrl: "https://www.tiktok.com/@banibanzl/video/7281920192831",
      title: "Review Jujur Make Over Velvet Cushion! Beneran matte seharian?",
      coverUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=400&auto=format&fit=crop",
      viewsCount: "34.5K",
      likesCount: "2.8K",
      commentsCount: "142",
      postDate: "16 Sep 2026 19:45",
      isBasketVerified: true,
    },
  },
  {
    id: "task-2",
    campaignId: "2",
    campaignTitle: "[EMINA] Glossy Tinted Glow Balm x Daily Fresh",
    brandName: "Emina Cosmetics",
    bannerUrl: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=800&auto=format&fit=crop",
    commissionRateText: "Komisi 15%",
    status: "SAMPLE_DISPATCHED",
    deadlineDate: "05 Oct 2026",
    daysRemaining: 18,
    courierName: "SiCepat Ekspres",
    trackingNumber: "004289194821",
    dispatchedDate: "16 Sep 2026",
    estimatedArrival: "18 Sep 2026",
    trackingTimeline: [
      { date: "16 Sep 16:00", title: "Manifested", description: "Paket telah diterima di drop point SiCepat", isCompleted: true },
      { date: "17 Sep 04:30", title: "In Transit", description: "Paket dalam perjalanan ke kota tujuan", isCompleted: true },
      { date: "Estimasi 18 Sep", title: "Menunggu Pengantaran Kurir", description: "Paket akan diantar ke alamat Anda", isCompleted: false },
    ],
    mandatoryHashtags: ["#EminaGlowBalm", "#DailySchoolLook", "#GlowWithEmina"],
    mandatoryMentions: ["@eminacosmetics"],
    targetAffiliateLink: "https://shop.tiktok.com/view/product/172981928392?source=agency_tap_nusantara",
    sowChecklist: [
      "Review honest & swatch warna di bibir",
      "Angle video natural daylight",
      "Mention tekstur ringan & tidak lengket",
    ],
  },
  {
    id: "task-3",
    campaignId: "3",
    campaignTitle: "[KAHF] Oil and Acne Care Face Wash Seeding",
    brandName: "Kahf Men",
    bannerUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop",
    commissionRateText: "Komisi 20%",
    status: "PENDING_REVIEW",
    deadlineDate: "30 Sep 2026",
    daysRemaining: 13,
    mandatoryHashtags: ["#KahfMen", "#AcneCareFaceWash", "#LelakiPemberani"],
    mandatoryMentions: ["@kahfeveryday"],
    targetAffiliateLink: "https://shop.tiktok.com/view/product/172981928393?source=agency_tap_nusantara",
    sowChecklist: [
      "Tunjukkan busa halus dan sensasi segar setelah cuci muka",
      "Jelaskan kandungan Mediterranean Sage & French Cypress",
      "Wajib pasang keranjang kuning TikTok Shop resmi",
    ],
  },
  {
    id: "task-4",
    campaignId: "4",
    campaignTitle: "[SKINTIFIC] 5X Ceramide Barrier Repair Moisture Gel",
    brandName: "Skintific Indonesia",
    bannerUrl: "https://images.unsplash.com/photo-1608248597359-bb5832dcda8e?q=80&w=800&auto=format&fit=crop",
    commissionRateText: "Komisi 16%",
    status: "REJECTED",
    rejectionReason: "Jumlah followers saat ini belum mencapai syarat minimum campaign (5,000 followers). Silakan coba campaign lainnya yang tersedia!",
    deadlineDate: "10 Oct 2026",
    daysRemaining: 23,
    mandatoryHashtags: ["#SkintificID", "#5XCeramide", "#SkinBarrierSavior"],
    mandatoryMentions: ["@skintific_id"],
    targetAffiliateLink: "https://shop.tiktok.com/view/product/172981928394?source=agency_tap_nusantara",
    sowChecklist: [
      "Visualisasi tekstur gel yang meleleh di kulit",
      "Klaim perbaikan skin barrier dalam 7 hari",
    ],
  },
];
