import Image from "next/image";
import Link from "next/link";
import Title_bar from "@/app/components/titlebar";
import Scrapbook from "@/app/components/opened_book";
import { db } from "@/src/db";
import { scrapbookEntries } from "@/src/db/schema";
import { asc } from "drizzle-orm";
import BackgroundBuilder from "@/app/components/bg";

// Make the page dynamically rendered to always get fresh data
export const dynamic = "force-dynamic";

export default async function Home() {
    // Fetch all scrapbook entries from the database, ordered by their index
    const entries = await db.select().from(scrapbookEntries).orderBy(asc(scrapbookEntries.groupId));

    return (
        <BackgroundBuilder>
            {/* Edit Button (Bottom Right) */}
            <Link
                href="/admin"
                className="absolute bottom-8 right-8 z-50 bg-[#e0c097] border-4 border-[#5d4037] text-[#5d4037]
                font-bold py-2 px-4 rounded-sm shadow-[4px_4px_0px_0px_rgba(93,64,55,1)] 
                active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(93,64,55,1)] transition-all
                font-mono text-lg hover:bg-[#d7b486]"
            >
                EDIT
            </Link>

            {/* 3. Centered Scrapbook Component */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
                {/* Pass the fetched entries to the client component */}
                <Scrapbook entries={entries} />
            </div>
        </BackgroundBuilder>

    );
}