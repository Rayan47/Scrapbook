"use client";

import { useState } from "react";
import Image from "next/image";
import type { SelectEntry } from "@/src/db/schema";

interface ScrapbookProps {
    entries: SelectEntry[];
}

export default function Scrapbook({ entries }: ScrapbookProps) {
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 4;

    const totalPages = Math.ceil(entries.length / itemsPerPage);
    const currentEntries = entries.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
    );

    const handleNext = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentPage > 0) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    // Helper to safely get an entry for a specific slot (0-3)
    const getEntry = (index: number) => currentEntries[index];

    return (
        // The main wrapper. It must be 'relative' so the absolute children stay inside it.
        <div className="relative w-full max-w-4xl mx-auto drop-shadow-xl pointer-events-auto">

            {/* 1. The Background Book Image */}
            <Image
                src="/open book.png"
                alt="Scrapbook"
                width={1200}
                height={560}
                className="w-full h-auto"
                priority
            />

            {/* ======================= */}
            {/* --- PAGE 1 (LEFT) --- */}
            {/* ======================= */}

            {/* Slot 1: Far Left Photo */}
            {getEntry(0) && (
                <>
                    <div className="absolute top-[9.8%] left-[6.5%] w-[14.5%] h-[45%] overflow-hidden group cursor-pointer">
                        <Image
                            src={getEntry(0).url}
                            alt="Memory 1"
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                    </div>
                    {/* Slot 1: Far Left Caption */}
                    <div className="absolute top-[60%] left-[6%] w-[18%] h-[24%] flex items-center justify-center p-2 -rotate-2 overflow-hidden">
                        <p className="text-black text-xs md:text-sm text-center leading-tight font-mono">
                            {getEntry(0).caption}
                        </p>
                    </div>
                </>
            )}

            {/* Slot 2: Inner Left Photo */}
            {getEntry(1) && (
                <>
                    <div className="absolute top-[10.2%] left-[30.5%] w-[14.5%] h-[45%] overflow-hidden group cursor-pointer">
                        <Image
                            src={getEntry(1).url}
                            alt="Memory 2"
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                    </div>
                    {/* Slot 2: Inner Left Caption */}
                    <div className="absolute top-[60%] left-[29%] w-[18%] h-[24%] flex items-center justify-center p-2 -rotate-1 overflow-hidden">
                        <p className="text-black text-xs md:text-sm text-center leading-tight font-mono">
                            {getEntry(1).caption}
                        </p>
                    </div>
                </>
            )}


            {/* ======================== */}
            {/* --- PAGE 2 (RIGHT) --- */}
            {/* ======================== */}

            {/* Slot 3: Inner Right Photo */}
            {getEntry(2) && (
                <>
                    <div className="absolute top-[10.75%] left-[55.9%] w-[14.5%] h-[45%] overflow-hidden group cursor-pointer">
                        <Image
                            src={getEntry(2).url}
                            alt="Memory 3"
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                    </div>
                    {/* Slot 3: Inner Right Caption */}
                    <div className="absolute top-[60%] left-[53%] w-[18%] h-[24%] flex items-center justify-center p-2 rotate-1 overflow-hidden">
                        <p className="text-black text-xs md:text-sm text-center leading-tight font-mono">
                            {getEntry(2).caption}
                        </p>
                    </div>
                </>
            )}

            {/* Slot 4: Far Right Photo */}
            {getEntry(3) && (
                <>
                    <div className="absolute top-[10.75%] left-[78%] w-[14.5%] h-[45%] overflow-hidden group cursor-pointer">
                        <Image
                            src={getEntry(3).url}
                            alt="Memory 4"
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                    </div>
                    {/* Slot 4: Far Right Caption */}
                    <div className="absolute top-[60%] left-[76%] w-[18%] h-[24%] flex items-center justify-center p-2 rotate-2 overflow-hidden">
                        <p className="text-black text-xs md:text-sm text-center leading-tight font-mono">
                            {getEntry(3).caption}
                        </p>
                    </div>
                </>
            )}

            {/* ======================== */}
            {/* --- NAVIGATION --- */}
            {/* ======================== */}

            {/* Previous Page Button */}
            <button
                onClick={handlePrev}
                disabled={currentPage === 0}
                className={`absolute top-1/2 -left-16 transform -translate-y-1/2 
                bg-[#e0c097] border-4 border-[#5d4037] text-[#5d4037] 
                font-bold py-2 px-4 rounded-sm shadow-[4px_4px_0px_0px_rgba(93,64,55,1)] 
                active:translate-y-[-40%] active:shadow-none transition-all
                disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-y-[-50%] disabled:active:shadow-[4px_4px_0px_0px_rgba(93,64,55,1)]
                font-mono text-xl z-20`}
                aria-label="Previous Page"
            >
                &lt; PREV
            </button>

            {/* Next Page Button */}
            <button
                onClick={handleNext}
                disabled={currentPage >= totalPages - 1}
                className={`absolute top-1/2 -right-16 transform -translate-y-1/2 
                bg-[#e0c097] border-4 border-[#5d4037] text-[#5d4037] 
                font-bold py-2 px-4 rounded-sm shadow-[4px_4px_0px_0px_rgba(93,64,55,1)] 
                active:translate-y-[-40%] active:shadow-none transition-all
                disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-y-[-50%] disabled:active:shadow-[4px_4px_0px_0px_rgba(93,64,55,1)]
                font-mono text-xl z-20`}
                aria-label="Next Page"
            >
                NEXT &gt;
            </button>

            {/* Page Indicator */}
            <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 font-mono text-[#5d4037] font-bold bg-[#e0c097] px-4 py-1 border-2 border-[#5d4037] rounded-sm shadow-[2px_2px_0px_0px_rgba(93,64,55,1)]">
                PAGE {currentPage + 1} / {totalPages || 1}
            </div>

        </div>
    );
}