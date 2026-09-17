"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Card,
  CardBody,
  Button,
  Chip,
  Spinner,
} from "@heroui/react";
import {
  Video,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  TrendingUp,
  Heart,
  MessageCircle,
  RefreshCw,
  ShoppingBag,
} from "lucide-react";
import { CreatorTaskItem } from "@/lib/tasks-data";

export function VideoDetectionCard({ task }: { task: CreatorTaskItem }) {
  const [video, setVideo] = useState(task.detectedVideo);
  const [isScanning, setIsScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState<string | null>(null);

  const handleTriggerDetection = async () => {
    setIsScanning(true);
    setScanMessage(null);
    try {
      const res = await fetch("/api/tasks/detect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskId: task.id,
          tiktokHandle: "@banibanzl",
        }),
      });

      const data = await res.json();
      if (data.success && data.detectedVideo) {
        setVideo(data.detectedVideo);
        setScanMessage("Berhasil! Video TikTok kamu terdeteksi oleh sistem.");
      }
    } catch (err) {
      console.error(err);
      setScanMessage("Gagal menyinkronkan video. Coba beberapa saat lagi.");
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <Card className="border border-divider/60 rounded-3xl overflow-hidden shadow-sm bg-card p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-black text-base text-foreground">
              Auto-Detection Video TikTok
            </h3>
            <p className="text-xs text-default-400">
              Pelacakan otomatis via TikTok Open API tanpa lapor manual.
            </p>
          </div>
        </div>

        {video ? (
          <Chip size="sm" color="success" variant="flat" startContent={<CheckCircle2 className="w-3.5 h-3.5" />} className="font-bold text-xs">
            Tugas Selesai & Terverifikasi
          </Chip>
        ) : (
          <Chip size="sm" color="warning" variant="flat" className="font-bold text-xs">
            Menunggu Video Live
          </Chip>
        )}
      </div>

      {video ? (
        /* Video Detected View */
        <div className="p-4 bg-default-50 dark:bg-default-100/40 rounded-2xl border border-divider/50 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Thumbnail */}
            <div className="relative w-24 h-32 rounded-xl overflow-hidden bg-black shrink-0 shadow-md">
              <Image
                src={video.coverUrl}
                alt={video.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <Video className="w-8 h-8 text-white/90" />
              </div>
            </div>

            {/* Video Meta */}
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <Chip size="sm" color="primary" variant="flat" className="text-[10px] font-bold">
                  Live di TikTok
                </Chip>
                <span className="text-xs text-default-400">Diposting: {video.postDate}</span>
              </div>

              <h4 className="font-bold text-sm text-foreground line-clamp-2">
                {video.title}
              </h4>

              {/* Metrics */}
              <div className="flex items-center gap-4 text-xs font-semibold text-default-700 pt-1">
                <span className="flex items-center gap-1.5 text-brand-600 font-extrabold">
                  <TrendingUp className="w-4 h-4" />
                  {video.viewsCount} Views
                </span>
                <span className="flex items-center gap-1.5 text-rose-500">
                  <Heart className="w-4 h-4 fill-rose-500" />
                  {video.likesCount} Likes
                </span>
                <span className="flex items-center gap-1.5 text-default-500">
                  <MessageCircle className="w-4 h-4" />
                  {video.commentsCount}
                </span>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <Chip size="sm" variant="flat" color="success" startContent={<ShoppingBag className="w-3.5 h-3.5" />} className="text-[11px] font-bold">
                  Keranjang Kuning Resmi Terverifikasi
                </Chip>
              </div>
            </div>

            {/* Link to TikTok */}
            <div className="shrink-0 w-full sm:w-auto">
              <Button
                as="a"
                href={video.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                size="sm"
                color="secondary"
                variant="flat"
                className="w-full sm:w-auto font-bold text-xs"
                endContent={<ExternalLink className="w-3.5 h-3.5" />}
              >
                Buka di TikTok
              </Button>
            </div>
          </div>
        </div>
      ) : (
        /* Video Not Detected Yet (Scanning / Sync state) */
        <div className="text-center py-6 px-4 bg-default-50 dark:bg-default-100/30 rounded-2xl border border-dashed border-divider space-y-4">
          <div className="w-14 h-14 bg-purple-100 dark:bg-purple-950/50 text-purple-600 rounded-full mx-auto flex items-center justify-center">
            {isScanning ? (
              <Spinner color="secondary" size="md" />
            ) : (
              <Video className="w-7 h-7" />
            )}
          </div>

          <div className="max-w-md mx-auto space-y-1">
            <h4 className="font-extrabold text-sm text-foreground">
              {isScanning ? "Memindai Video Akun TikTok Kamu..." : "Belum Ada Video Terdeteksi"}
            </h4>
            <p className="text-xs text-default-500">
              Upload video kamu ke TikTok dengan menyertakan hashtag wajib campaign. Sistem robot kami akan mendeteksi video kamu secara berkala.
            </p>
          </div>

          {scanMessage && (
            <p className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 py-1.5 px-3 rounded-lg max-w-sm mx-auto">
              {scanMessage}
            </p>
          )}

          <Button
            size="sm"
            color="primary"
            onClick={handleTriggerDetection}
            isLoading={isScanning}
            startContent={!isScanning && <RefreshCw className="w-3.5 h-3.5" />}
            className="bg-gradient-to-r from-brand-600 to-purple-600 text-white font-bold text-xs shadow-md shadow-brand-500/20"
          >
            {isScanning ? "Memindai TikTok..." : "Cek / Sinkronkan Video Sekarang"}
          </Button>
        </div>
      )}
    </Card>
  );
}
