// app/admin/page.tsx
import { db } from "@/src/db";
import { scrapbookEntries, letters } from "@/src/db/schema";
import ScrapbookClient from "./ScrapbookClient";
import { Bar } from "@/app/components/titlebar";
import {Press_Start_2P} from "next/font/google";
import Link from "next/link";
import { asc } from "drizzle-orm";

// Force Next.js to dynamically render this page so it always shows fresh DB data
export const dynamic = "force-dynamic";
const pixelFont = Press_Start_2P({
    weight: "400",
    subsets: ["latin"],
    // Adjust font size slightly as this font renders quite large
    variable: '--font-pixel'
});

export default async function AdminPage() {
    // Fetch existing entries from Turso, ordered by group and then by group order
    const entryData = await db.select().from(scrapbookEntries).orderBy(asc(scrapbookEntries.groupId), asc(scrapbookEntries.groupOrderIndex));
    const letterData = await db.select().from(letters).orderBy(asc(letters.createdAt));

    return (
        <main className={`min-h-screen flex flex-col items-center justify-start pt-4 gap-8 ${pixelFont.className} relative`}
              style={{
                  backgroundColor: "#fdf3ce", // Light yellow background
                  backgroundImage: `
          linear-gradient(to right, white 2px, transparent 2px),
          linear-gradient(to bottom, white 2px, transparent 2px)
        `,
                  backgroundSize: "40px 40px"
              }}>
            
            {/* Back Button (Top Left) */}
            <Link
                href="/open_book"
                className="absolute top-8 left-8 z-50 bg-[#e0c097] border-4 border-[#5d4037] text-[#5d4037] 
                font-bold py-2 px-4 rounded-sm shadow-[4px_4px_0px_0px_rgba(93,64,55,1)] 
                active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(93,64,55,1)] transition-all
                font-mono text-lg hover:bg-[#d7b486]"
            >
                &lt; BACK
            </Link>

            <Bar>Dashboard</Bar>
            {/* Pass the DB data to our interactive client component */}
            <ScrapbookClient initialEntries={entryData} initialLetters={letterData} />
        </main>
    );
}