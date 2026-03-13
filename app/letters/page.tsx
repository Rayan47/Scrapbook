import React from "react";

import LetterCarousel from "@/app/components/lettercarousel";
import {db} from "@/src/db";
import {letters} from "@/src/db/schema";
import {asc} from "drizzle-orm";
import Link from "next/link";

// Initialize the retro font
export const fetchCache = 'force-no-store';

export default async function Letters() {

    const fetched = await db.select().from(letters).orderBy(asc(letters.id));
    return (
        <div>
        <Link
            href="/open_book"
            className="absolute top-8 left-8 z-50 bg-[#e0c097] border-4 border-[#5d4037] text-[#5d4037]
                font-bold py-2 px-4 rounded-sm shadow-[4px_4px_0px_0px_rgba(93,64,55,1)]
                active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(93,64,55,1)] transition-all
                font-mono text-lg hover:bg-[#d7b486]"
        >
            &lt; BACK
        </Link>
       <LetterCarousel letters_content={fetched}/>
        </div>
    );

}