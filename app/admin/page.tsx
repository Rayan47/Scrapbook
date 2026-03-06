// app/admin/page.tsx
import { db } from "@/src/db";
import { scrapbookEntries } from "@/src/db/schema";
import ScrapbookClient from "./ScrapbookClient";
import { Bar } from "@/app/components/titlebar";
import {Press_Start_2P} from "next/font/google";

// Force Next.js to dynamically render this page so it always shows fresh DB data
export const dynamic = "force-dynamic";
const pixelFont = Press_Start_2P({
    weight: "400",
    subsets: ["latin"],
    // Adjust font size slightly as this font renders quite large
    variable: '--font-pixel'
});

export default async function AdminPage() {
    // Fetch existing entries from Turso
    const data = await db.select().from(scrapbookEntries);

    return (
        <main className={`min-h-screen flex flex-col items-center justify-start pt-32 ${pixelFont.className}`}
              style={{
                  backgroundColor: "#fdf3ce", // Light yellow background
                  backgroundImage: `
          linear-gradient(to right, white 2px, transparent 2px),
          linear-gradient(to bottom, white 2px, transparent 2px)
        `,
                  backgroundSize: "40px 40px"
              }}>
            <Bar>Dashboard</Bar>
            {/* Pass the DB data to our interactive client component */}
            <ScrapbookClient initialEntries={data} />
        </main>
    );
}