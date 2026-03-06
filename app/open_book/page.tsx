import Image from "next/image";
import Title_bar from "@/app/components/titlebar";
import Scrapbook from "@/app/components/opened_book";
import { db } from "@/src/db";
import { scrapbookEntries } from "@/src/db/schema";
import { asc } from "drizzle-orm";

// Make the page dynamically rendered to always get fresh data
export const dynamic = "force-dynamic";

export default async function Home() {
    // Fetch all scrapbook entries from the database, ordered by their index
    const entries = await db.select().from(scrapbookEntries).orderBy(asc(scrapbookEntries.orderIndex));

    return (
        <main className="relative w-full h-screen overflow-hidden">

            {/* 1. Static Background Image */}
            <div className="absolute inset-0 -z-10">
                <Image
                    src="/background-01.png"
                    alt="Static Background"
                    fill
                    style={{ objectFit: "cover" }}
                    priority
                />
            </div>

            <Title_bar/>

            {/* 3. Centered Scrapbook Component */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
                {/* Pass the fetched entries to the client component */}
                <Scrapbook entries={entries} />
            </div>

        </main>
    );
}