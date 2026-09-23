import { RawDataVideo, RawDataLive, RawDataSales, CampaignSalesAwarenessSummary } from "@/types";

export interface CreatorTaskItem {
  id: string;
  campaignId: string;
  campaignTitle: string;
  brandName: string;
  bannerUrl: string;
  commissionRateText: string;
  productId: string;
  creatorUsername: string;
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

  // Raw Ingestion Datasets & Summary Analytics
  rawVideos?: RawDataVideo[];
  rawLives?: RawDataLive[];
  rawSales?: RawDataSales[];
  salesSummary?: CampaignSalesAwarenessSummary;
}

export const initialCreatorTasks: CreatorTaskItem[] = [
  {
    id: "task-1",
    campaignId: "1",
    campaignTitle: "[MAKE OVER] Velvet Mattifying Cushion Special 9.9",
    brandName: "Make Over Indonesia",
    bannerUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=800&auto=format&fit=crop",
    commissionRateText: "Komisi 18%",
    productId: "172981928391",
    creatorUsername: "@banibanzl",
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
    mandatoryHashtags: ["#MakeOver99", "#VelvetCushion", "#ComplexionMatte", "#Creavy"],
    mandatoryMentions: ["@makeoverid"],
    soundUrl: "https://www.tiktok.com/music/Make-Over-99-Official-Sound-71289123891",
    targetAffiliateLink: "https://shop.tiktok.com/view/product/172981928391?source=agency_creavy_target&creator=@banibanzl",
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
    rawVideos: [
      {
        id: "rv-101",
        campaignId: "1",
        productId: "172981928391",
        creatorUsername: "@banibanzl",
        videoId: "7281920192831",
        videoUrl: "https://www.tiktok.com/@banibanzl/video/7281920192831",
        caption: "Review Jujur Make Over Velvet Cushion! Beneran matte seharian? #MakeOver99 #VelvetCushion #Creavy @makeoverid",
        postTime: "2026-09-16 19:45:00",
        durationSeconds: 42,
        viewsCount: 34520,
        likesCount: 2840,
        commentsCount: 142,
        sharesCount: 88,
        retentionRate: 71.4,
      },
      {
        id: "rv-102",
        campaignId: "1",
        productId: "172981928391",
        creatorUsername: "@banibanzl",
        videoId: "7282049182734",
        videoUrl: "https://www.tiktok.com/@banibanzl/video/7282049182734",
        caption: "GRWM Kondangan Pakai Make Over Velvet Cushion 💖 Ketahanan 12 Jam! #MakeOver99 #Creavy",
        postTime: "2026-09-19 11:20:00",
        durationSeconds: 58,
        viewsCount: 18900,
        likesCount: 1450,
        commentsCount: 64,
        sharesCount: 32,
        retentionRate: 64.8,
      },
    ],
    rawLives: [
      {
        id: "rl-201",
        campaignId: "1",
        productId: "172981928391",
        creatorUsername: "@banibanzl",
        liveRoomId: "live_9928174619",
        liveTitle: "Flash Sale & Beauty Spills Malam Minggu! Diskon Make Over Cushion 💄",
        startTime: "2026-09-20 20:00:00",
        endTime: "2026-09-20 22:30:00",
        durationMinutes: 150,
        totalLiveViews: 12450,
        peakViewersPcu: 485,
        avgViewersAcu: 210,
        totalComments: 1320,
        totalShares: 145,
        totalProductClicks: 640,
      },
    ],
    rawSales: [
      {
        id: "rs-301",
        campaignId: "1",
        productId: "172981928391",
        skuId: "SKU-MO-01-LIGHT",
        productName: "Make Over Velvet Cushion - 01 Light Beige",
        creatorUsername: "@banibanzl",
        orderId: "TTSP-99281746201",
        contentType: "VIDEO",
        sourceId: "7281920192831",
        orderStatus: "SETTLED",
        quantity: 2,
        itemPrice: 185000,
        totalGmv: 370000,
        commissionRate: 18.0,
        commissionAmount: 66600,
        settledCommission: 66600,
        orderCreatedTime: "2026-09-17 10:14:22",
        orderSettledTime: "2026-09-21 14:00:00",
        buyerRegion: "DKI Jakarta",
      },
      {
        id: "rs-302",
        campaignId: "1",
        productId: "172981928391",
        skuId: "SKU-MO-02-NATURAL",
        productName: "Make Over Velvet Cushion - 02 Natural",
        creatorUsername: "@banibanzl",
        orderId: "TTSP-99281746202",
        contentType: "VIDEO",
        sourceId: "7281920192831",
        orderStatus: "SETTLED",
        quantity: 1,
        itemPrice: 185000,
        totalGmv: 185000,
        commissionRate: 18.0,
        commissionAmount: 33300,
        settledCommission: 33300,
        orderCreatedTime: "2026-09-17 14:32:01",
        orderSettledTime: "2026-09-21 15:30:00",
        buyerRegion: "Jawa Barat",
      },
      {
        id: "rs-303",
        campaignId: "1",
        productId: "172981928391",
        skuId: "SKU-MO-01-LIGHT",
        productName: "Make Over Velvet Cushion - 01 Light Beige",
        creatorUsername: "@banibanzl",
        orderId: "TTSP-99281746305",
        contentType: "LIVE",
        sourceId: "live_9928174619",
        orderStatus: "DELIVERED",
        quantity: 3,
        itemPrice: 185000,
        totalGmv: 555000,
        commissionRate: 18.0,
        commissionAmount: 99900,
        settledCommission: 0,
        orderCreatedTime: "2026-09-20 21:15:10",
        buyerRegion: "Jawa Timur",
      },
      {
        id: "rs-304",
        campaignId: "1",
        productId: "172981928391",
        skuId: "SKU-MO-03-MEDIUM",
        productName: "Make Over Velvet Cushion - 03 Medium",
        creatorUsername: "@banibanzl",
        orderId: "TTSP-99281746310",
        contentType: "LIVE",
        sourceId: "live_9928174619",
        orderStatus: "PAID",
        quantity: 1,
        itemPrice: 185000,
        totalGmv: 185000,
        commissionRate: 18.0,
        commissionAmount: 33300,
        settledCommission: 0,
        orderCreatedTime: "2026-09-20 22:04:45",
        buyerRegion: "Banten",
      },
    ],
    salesSummary: {
      productId: "172981928391",
      creatorUsername: "@banibanzl",
      totalViews: 53420,
      totalLikes: 4290,
      totalLiveDurationMinutes: 150,
      totalLivePeakViewers: 485,
      totalItemsSold: 7,
      totalGmv: 1295000,
      estimatedCommission: 233100,
      settledCommission: 99900,
      videoCount: 2,
      liveCount: 1,
    },
  },
  {
    id: "task-2",
    campaignId: "2",
    campaignTitle: "[EMINA] Glossy Tinted Glow Balm x Daily Fresh",
    brandName: "Emina Cosmetics",
    bannerUrl: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=800&auto=format&fit=crop",
    commissionRateText: "Komisi 15%",
    productId: "172981928392",
    creatorUsername: "@banibanzl",
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
    mandatoryHashtags: ["#EminaGlowBalm", "#DailySchoolLook", "#GlowWithEmina", "#Creavy"],
    mandatoryMentions: ["@eminacosmetics"],
    targetAffiliateLink: "https://shop.tiktok.com/view/product/172981928392?source=agency_creavy_target&creator=@banibanzl",
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
    productId: "172981928393",
    creatorUsername: "@banibanzl",
    status: "PENDING_REVIEW",
    deadlineDate: "30 Sep 2026",
    daysRemaining: 13,
    mandatoryHashtags: ["#KahfMen", "#AcneCareFaceWash", "#LelakiPemberani", "#Creavy"],
    mandatoryMentions: ["@kahfeveryday"],
    targetAffiliateLink: "https://shop.tiktok.com/view/product/172981928393?source=agency_creavy_target&creator=@banibanzl",
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
    productId: "172981928394",
    creatorUsername: "@banibanzl",
    status: "REJECTED",
    rejectionReason: "Jumlah followers saat ini belum mencapai syarat minimum campaign (5,000 followers). Silakan coba campaign lainnya yang tersedia!",
    deadlineDate: "10 Oct 2026",
    daysRemaining: 23,
    mandatoryHashtags: ["#SkintificID", "#5XCeramide", "#SkinBarrierSavior", "#Creavy"],
    mandatoryMentions: ["@skintific_id"],
    targetAffiliateLink: "https://shop.tiktok.com/view/product/172981928394?source=agency_creavy_target&creator=@banibanzl",
    sowChecklist: [
      "Visualisasi tekstur gel yang meleleh di kulit",
      "Klaim perbaikan skin barrier dalam 7 hari",
    ],
  },
];
