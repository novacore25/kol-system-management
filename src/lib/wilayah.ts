export interface WilayahItem {
  id: string;
  name: string;
}

const BASE_URL = "https://emsifa.github.io/api-wilayah-indonesia/api";

// Simple in-memory cache to prevent redundant HTTP calls
const cache = new Map<string, WilayahItem[]>();

export async function getProvinces(): Promise<WilayahItem[]> {
  const cacheKey = "provinces";
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)!;
  }

  try {
    const res = await fetch(`${BASE_URL}/provinces.json`, { next: { revalidate: 86400 } });
    if (!res.ok) throw new Error("Failed to fetch provinces");
    const data: WilayahItem[] = await res.json();
    cache.set(cacheKey, data);
    return data;
  } catch (error) {
    console.error("Error fetching provinces:", error);
    return [];
  }
}

export async function getRegencies(provinceId: string): Promise<WilayahItem[]> {
  const cacheKey = `regencies_${provinceId}`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)!;
  }

  try {
    const res = await fetch(`${BASE_URL}/regencies/${provinceId}.json`, { next: { revalidate: 86400 } });
    if (!res.ok) throw new Error("Failed to fetch regencies");
    const data: WilayahItem[] = await res.json();
    cache.set(cacheKey, data);
    return data;
  } catch (error) {
    console.error(`Error fetching regencies for province ${provinceId}:`, error);
    return [];
  }
}

export async function getDistricts(regencyId: string): Promise<WilayahItem[]> {
  const cacheKey = `districts_${regencyId}`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)!;
  }

  try {
    const res = await fetch(`${BASE_URL}/districts/${regencyId}.json`, { next: { revalidate: 86400 } });
    if (!res.ok) throw new Error("Failed to fetch districts");
    const data: WilayahItem[] = await res.json();
    cache.set(cacheKey, data);
    return data;
  } catch (error) {
    console.error(`Error fetching districts for regency ${regencyId}:`, error);
    return [];
  }
}

export async function getVillages(districtId: string): Promise<WilayahItem[]> {
  const cacheKey = `villages_${districtId}`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)!;
  }

  try {
    const res = await fetch(`${BASE_URL}/villages/${districtId}.json`, { next: { revalidate: 86400 } });
    if (!res.ok) throw new Error("Failed to fetch villages");
    const data: WilayahItem[] = await res.json();
    cache.set(cacheKey, data);
    return data;
  } catch (error) {
    console.error(`Error fetching villages for district ${districtId}:`, error);
    return [];
  }
}
