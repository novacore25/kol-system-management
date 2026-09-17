"use client";

import React, { useState, useEffect } from "react";
import { Select, SelectItem } from "@heroui/react";
import { MapPin } from "lucide-react";

export interface WilayahOption {
  id: string;
  name: string;
}

export interface SelectedWilayah {
  provinceId: string;
  provinceName: string;
  regencyId: string;
  regencyName: string;
  districtId: string;
  districtName: string;
  villageId: string;
  villageName: string;
}

interface WilayahSelectProps {
  onChange: (wilayah: SelectedWilayah) => void;
  initialValues?: Partial<SelectedWilayah>;
}

export function WilayahSelect({ onChange, initialValues }: WilayahSelectProps) {
  const [provinces, setProvinces] = useState<WilayahOption[]>([]);
  const [regencies, setRegencies] = useState<WilayahOption[]>([]);
  const [districts, setDistricts] = useState<WilayahOption[]>([]);
  const [villages, setVillages] = useState<WilayahOption[]>([]);

  const [provinceId, setProvinceId] = useState(initialValues?.provinceId || "");
  const [regencyId, setRegencyId] = useState(initialValues?.regencyId || "");
  const [districtId, setDistrictId] = useState(initialValues?.districtId || "");
  const [villageId, setVillageId] = useState(initialValues?.villageId || "");

  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingRegencies, setLoadingRegencies] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingVillages, setLoadingVillages] = useState(false);

  // Load provinces on mount
  useEffect(() => {
    async function loadProvinces() {
      setLoadingProvinces(true);
      try {
        const res = await fetch("/api/wilayah?type=provinces");
        if (res.ok) {
          const data = await res.json();
          setProvinces(data);
        }
      } catch (err) {
        console.error("Gagal memuat provinsi:", err);
      } finally {
        setLoadingProvinces(false);
      }
    }
    loadProvinces();
  }, []);

  // Load regencies when provinceId changes
  useEffect(() => {
    if (!provinceId) {
      setRegencies([]);
      setRegencyId("");
      return;
    }

    async function loadRegencies() {
      setLoadingRegencies(true);
      try {
        const res = await fetch(`/api/wilayah?type=regencies&parentId=${provinceId}`);
        if (res.ok) {
          const data = await res.json();
          setRegencies(data);
        }
      } catch (err) {
        console.error("Gagal memuat kabupaten/kota:", err);
      } finally {
        setLoadingRegencies(false);
      }
    }
    loadRegencies();
  }, [provinceId]);

  // Load districts when regencyId changes
  useEffect(() => {
    if (!regencyId) {
      setDistricts([]);
      setDistrictId("");
      return;
    }

    async function loadDistricts() {
      setLoadingDistricts(true);
      try {
        const res = await fetch(`/api/wilayah?type=districts&parentId=${regencyId}`);
        if (res.ok) {
          const data = await res.json();
          setDistricts(data);
        }
      } catch (err) {
        console.error("Gagal memuat kecamatan:", err);
      } finally {
        setLoadingDistricts(false);
      }
    }
    loadDistricts();
  }, [regencyId]);

  // Load villages when districtId changes
  useEffect(() => {
    if (!districtId) {
      setVillages([]);
      setVillageId("");
      return;
    }

    async function loadVillages() {
      setLoadingVillages(true);
      try {
        const res = await fetch(`/api/wilayah?type=villages&parentId=${districtId}`);
        if (res.ok) {
          const data = await res.json();
          setVillages(data);
        }
      } catch (err) {
        console.error("Gagal memuat kelurahan/desa:", err);
      } finally {
        setLoadingVillages(false);
      }
    }
    loadVillages();
  }, [districtId]);

  // Trigger parent onChange whenever selections update
  const notifyChange = (
    pId: string,
    rId: string,
    dId: string,
    vId: string
  ) => {
    const prov = provinces.find((p) => p.id === pId);
    const reg = regencies.find((r) => r.id === rId);
    const dist = districts.find((d) => d.id === dId);
    const vill = villages.find((v) => v.id === vId);

    onChange({
      provinceId: pId,
      provinceName: prov?.name || "",
      regencyId: rId,
      regencyName: reg?.name || "",
      districtId: dId,
      districtName: dist?.name || "",
      villageId: vId,
      villageName: vill?.name || "",
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1.5 text-xs font-bold text-default-700">
        <MapPin className="w-4 h-4 text-brand-600" />
        <span>Wilayah Pengiriman (API Wilayah Indonesia)</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* 1. Provinsi */}
        <Select
          label="Provinsi"
          placeholder="Pilih Provinsi"
          size="sm"
          variant="bordered"
          isLoading={loadingProvinces}
          selectedKeys={provinceId ? [provinceId] : []}
          onChange={(e) => {
            const val = e.target.value;
            setProvinceId(val);
            setRegencyId("");
            setDistrictId("");
            setVillageId("");
            notifyChange(val, "", "", "");
          }}
          isRequired
        >
          {provinces.map((prov) => (
            <SelectItem key={prov.id} textValue={prov.name}>
              {prov.name}
            </SelectItem>
          ))}
        </Select>

        {/* 2. Kabupaten / Kota */}
        <Select
          label="Kabupaten / Kota"
          placeholder={provinceId ? "Pilih Kab/Kota" : "Pilih Provinsi dulu"}
          size="sm"
          variant="bordered"
          isDisabled={!provinceId}
          isLoading={loadingRegencies}
          selectedKeys={regencyId ? [regencyId] : []}
          onChange={(e) => {
            const val = e.target.value;
            setRegencyId(val);
            setDistrictId("");
            setVillageId("");
            notifyChange(provinceId, val, "", "");
          }}
          isRequired
        >
          {regencies.map((reg) => (
            <SelectItem key={reg.id} textValue={reg.name}>
              {reg.name}
            </SelectItem>
          ))}
        </Select>

        {/* 3. Kecamatan */}
        <Select
          label="Kecamatan"
          placeholder={regencyId ? "Pilih Kecamatan" : "Pilih Kab/Kota dulu"}
          size="sm"
          variant="bordered"
          isDisabled={!regencyId}
          isLoading={loadingDistricts}
          selectedKeys={districtId ? [districtId] : []}
          onChange={(e) => {
            const val = e.target.value;
            setDistrictId(val);
            setVillageId("");
            notifyChange(provinceId, regencyId, val, "");
          }}
          isRequired
        >
          {districts.map((dist) => (
            <SelectItem key={dist.id} textValue={dist.name}>
              {dist.name}
            </SelectItem>
          ))}
        </Select>

        {/* 4. Kelurahan / Desa */}
        <Select
          label="Kelurahan / Desa"
          placeholder={districtId ? "Pilih Kelurahan/Desa" : "Pilih Kecamatan dulu"}
          size="sm"
          variant="bordered"
          isDisabled={!districtId}
          isLoading={loadingVillages}
          selectedKeys={villageId ? [villageId] : []}
          onChange={(e) => {
            const val = e.target.value;
            setVillageId(val);
            notifyChange(provinceId, regencyId, districtId, val);
          }}
          isRequired
        >
          {villages.map((vill) => (
            <SelectItem key={vill.id} textValue={vill.name}>
              {vill.name}
            </SelectItem>
          ))}
        </Select>
      </div>
    </div>
  );
}
