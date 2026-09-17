import { NextRequest, NextResponse } from "next/server";
import {
  getProvinces,
  getRegencies,
  getDistricts,
  getVillages,
} from "@/lib/wilayah";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const parentId = searchParams.get("parentId");

  try {
    switch (type) {
      case "provinces": {
        const provinces = await getProvinces();
        return NextResponse.json(provinces);
      }
      case "regencies": {
        if (!parentId) {
          return NextResponse.json({ error: "parentId (provinceId) is required" }, { status: 400 });
        }
        const regencies = await getRegencies(parentId);
        return NextResponse.json(regencies);
      }
      case "districts": {
        if (!parentId) {
          return NextResponse.json({ error: "parentId (regencyId) is required" }, { status: 400 });
        }
        const districts = await getDistricts(parentId);
        return NextResponse.json(districts);
      }
      case "villages": {
        if (!parentId) {
          return NextResponse.json({ error: "parentId (districtId) is required" }, { status: 400 });
        }
        const villages = await getVillages(parentId);
        return NextResponse.json(villages);
      }
      default:
        return NextResponse.json(
          { error: "Invalid type. Must be provinces, regencies, districts, or villages" },
          { status: 400 }
        );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error fetching region data" },
      { status: 500 }
    );
  }
}
