import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const bbox = searchParams.get("bbox");
    const proximity = searchParams.get("proximity");

    if (!bbox || !proximity) {
      return NextResponse.json(
        { error: "bbox and proximity are required" },
        { status: 400 }
      );
    }

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

    if (!token) {
      return NextResponse.json(
        { error: "Mapbox token is missing" },
        { status: 500 }
      );
    }

    const params = new URLSearchParams({
      access_token: token,
      limit: "25",
      language: "en",
      bbox,
      proximity,
    });

    const response = await fetch(
      `https://api.mapbox.com/search/searchbox/v1/category/coffee?${params.toString()}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const error = await response.text();

      console.error("Mapbox coffee search failed:", error);

      return NextResponse.json(
        { error: "Coffee search failed" },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Coffee shops route error:", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}