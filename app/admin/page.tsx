// app/admin/page.tsx
import { db } from "@/src/db";
import { scrapbookEntries } from "@/src/db/schema";
import ScrapbookClient from "./ScrapbookClient";

// Force Next.js to dynamically render this page so it always shows fresh DB data
export const dynamic = "force-dynamic";

export default async function AdminPage() {
    // Fetch existing entries from Turso
    const data = await db.select().from(scrapbookEntries);

    return (
        <main className="min-h-screen bg-gray-100 py-10">
            <h1 className="text-3xl font-bold text-center mb-8 text-black">Scrapbook Dashboard</h1>

            {/* Pass the DB data to our interactive client component */}
            <ScrapbookClient initialEntries={data} />
        </main>
    );
}