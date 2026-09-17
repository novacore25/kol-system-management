"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardBody,
  CardFooter,
  Chip,
  Button,
} from "@heroui/react";
import {
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  Video,
  ArrowRight,
  TrendingUp,
  Gift,
} from "lucide-react";
import { CreatorTaskItem } from "@/lib/tasks-data";

export function TaskCard({ task }: { task: CreatorTaskItem }) {
  return (
    <Card className="border border-divider/60 shadow-sm hover:shadow-md transition-all rounded-2xl overflow-hidden bg-card">
      <div className="flex flex-col sm:flex-row items-start sm:items-center p-4 gap-4">
        {/* Banner Mini */}
        <div className="relative w-full sm:w-28 h-28 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
          <Image
            src={task.bannerUrl}
            alt={task.campaignTitle}
            fill
            className="object-cover"
          />
        </div>

        {/* Info Content */}
        <div className="flex-1 space-y-1.5 w-full">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                {task.brandName}
              </span>
              <span className="text-default-400">•</span>
              <span className="text-[11px] font-bold text-emerald-600">
                {task.commissionRateText}
              </span>
            </div>

            {/* Status Chip */}
            {task.status === "PENDING_REVIEW" && (
              <Chip size="sm" color="warning" variant="flat" className="font-bold text-xs">
                Ditinjau Admin
              </Chip>
            )}
            {task.status === "SAMPLE_DISPATCHED" && (
              <Chip
                size="sm"
                color="secondary"
                variant="flat"
                startContent={<Truck className="w-3.5 h-3.5" />}
                className="font-bold text-xs"
              >
                Sampel Dikirim ({task.courierName})
              </Chip>
            )}
            {task.status === "WAITING_POST" && (
              <Chip
                size="sm"
                color="warning"
                variant="solid"
                startContent={<Video className="w-3.5 h-3.5" />}
                className="font-bold text-xs text-white"
              >
                Siap Upload Video
              </Chip>
            )}
            {task.status === "VIDEO_DETECTED" && (
              <Chip
                size="sm"
                color="success"
                variant="flat"
                startContent={<CheckCircle2 className="w-3.5 h-3.5" />}
                className="font-bold text-xs"
              >
                Video Terdeteksi Live
              </Chip>
            )}
            {task.status === "REJECTED" && (
              <Chip
                size="sm"
                color="danger"
                variant="flat"
                startContent={<XCircle className="w-3.5 h-3.5" />}
                className="font-bold text-xs"
              >
                Ditolak
              </Chip>
            )}
          </div>

          <h3 className="text-base font-extrabold text-foreground line-clamp-1">
            {task.campaignTitle}
          </h3>

          {/* Logistics / Video Summary */}
          {task.status === "SAMPLE_DISPATCHED" && (
            <div className="bg-default-50 dark:bg-default-100/50 p-2 rounded-xl text-xs flex items-center justify-between">
              <span className="text-default-600 font-medium flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-brand-600" />
                Resi: <strong className="font-mono text-foreground">{task.trackingNumber}</strong>
              </span>
              <span className="text-[10px] text-default-400">
                Estimasi tiba: {task.estimatedArrival}
              </span>
            </div>
          )}

          {task.status === "VIDEO_DETECTED" && task.detectedVideo && (
            <div className="bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 p-2 rounded-xl text-xs flex items-center justify-between">
              <span className="text-emerald-800 dark:text-emerald-300 font-semibold flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                {task.detectedVideo.viewsCount} Views • {task.detectedVideo.likesCount} Likes
              </span>
              <Chip size="sm" variant="dot" color="success" className="border-none text-[10px]">
                Keranjang Terverifikasi
              </Chip>
            </div>
          )}

          {task.status === "REJECTED" && (
            <p className="text-xs text-rose-600 bg-rose-50 dark:bg-rose-950/40 p-2 rounded-xl">
              Alasan: {task.rejectionReason}
            </p>
          )}

          <div className="flex items-center gap-2 text-[11px] text-default-400 pt-1">
            <Clock className="w-3.5 h-3.5 text-default-400" />
            <span>Tenggat Video: {task.deadlineDate} (Sisa {task.daysRemaining} hari)</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="w-full sm:w-auto shrink-0 pt-2 sm:pt-0">
          <Button
            as={Link}
            href={`/my-tasks/${task.id}`}
            color="primary"
            variant="flat"
            size="sm"
            className="w-full sm:w-auto font-bold text-xs"
            endContent={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Lihat Detail & Panduan
          </Button>
        </div>
      </div>
    </Card>
  );
}
