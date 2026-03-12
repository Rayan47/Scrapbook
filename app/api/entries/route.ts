// app/api/entries/route.ts
import { db } from "@/src/db";
import { scrapbookEntries } from "@/src/db/schema";
import { NextResponse } from "next/server";

export async function GET() {
    const entries = await db.select().from(scrapbookEntries);
    return NextResponse.json(entries);
}