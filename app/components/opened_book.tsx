"use client";

import { useState } from "react";
import Image from "next/image";
import type { SelectEntry } from "@/src/db/schema";

interface ScrapbookProps {
    entries: SelectEntry[];
}

export default function Scrapbook({ entries }: ScrapbookProps) {
    const [currentPage, setCurrentPage] = useState(0);
    const [openGroupId, setOpenGroupId] = useState<number | null>(null);
    const [carouselIndex, setCarouselIndex] = useState(0);

    const itemsPerPage = 4;

    // Group entries by groupId
    const groupedEntries = entries.reduce((acc, entry) => {
        const groupId = entry.groupId;
        if (groupId === null || groupId === undefined) return acc;
        
        if (!acc[groupId]) {
            acc[groupId] = [];
        }
        acc[groupId].push(entry);
        return acc;
    }, {} as Record<number, SelectEntry[]>);

    // Sort entries within each group by groupOrderIndex
    Object.keys(groupedEntries).forEach(key => {
        const groupId = Number(key);
        groupedEntries[groupId].sort((a, b) => a.groupOrderIndex - b.groupOrderIndex);
    });

    // Get thumbnails (first image of each group) and sort them by their groupId
    const thumbnailEntries = Object.values(groupedEntries)
        .map(group => group[0])
        .sort((a, b) => (a.groupId || 0) - (b.groupId || 0));

    const totalPages = Math.ceil(thumbnailEntries.length / itemsPerPage);
    const currentEntries = thumbnailEntries.slice(
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

    const handleOpenCarousel = (groupId: number | null) => {
        if (groupId !== null) {
            setOpenGroupId(groupId);
            setCarouselIndex(0);
        }
    };

    const handleCloseCarousel = () => {
        setOpenGroupId(null);
    };

    const getGroupedImages = () => {
        if (openGroupId === null) return [];
        return groupedEntries[openGroupId] || [];
    };

    const handleCarouselNext = () => {
        const groupedImages = getGroupedImages();
        if (carouselIndex < groupedImages.length - 1) {
            setCarouselIndex(prev => prev + 1);
        }
    };

    const handleCarouselPrev = () => {
        if (carouselIndex > 0) {
            setCarouselIndex(prev => prev - 1);
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
                    <div className="absolute top-[9.8%] left-[6.5%] w-[14.5%] h-[45%] overflow-hidden group cursor-pointer" onClick={() => handleOpenCarousel(getEntry(0).groupId)}>
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
                    <div className="absolute top-[10.2%] left-[30.5%] w-[14.5%] h-[45%] overflow-hidden group cursor-pointer" onClick={() => handleOpenCarousel(getEntry(1).groupId)}>
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
                    <div className="absolute top-[10.75%] left-[55.9%] w-[14.5%] h-[45%] overflow-hidden group cursor-pointer" onClick={() => handleOpenCarousel(getEntry(2).groupId)}>
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
                    <div className="absolute top-[10.75%] left-[78%] w-[14.5%] h-[45%] overflow-hidden group cursor-pointer" onClick={() => handleOpenCarousel(getEntry(3).groupId)}>
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

            {/* Carousel Modal */}
            {openGroupId !== null && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                    <div className="relative w-full max-w-3xl">
                        <button onClick={handleCloseCarousel} className="absolute -top-10 right-0 text-white text-3xl">&times;</button>
                        <div className="relative aspect-video">
                            <Image
                                src={getGroupedImages()[carouselIndex]?.url || ""}
                                alt="Carousel Image"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <button onClick={handleCarouselPrev} disabled={carouselIndex === 0} className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white text-3xl disabled:opacity-50">&lt;</button>
                        <button onClick={handleCarouselNext} disabled={carouselIndex === getGroupedImages().length - 1} className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white text-3xl disabled:opacity-50">&gt;</button>
                    </div>
                </div>
            )}
        </div>
    );
}