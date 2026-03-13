"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {SelectLetter} from "@/src/db/schema";
import BackgroundBuilder from "@/app/components/bg";
import React, {useState} from "react";


export default function LetterCarousel({ letters_content }: { letters_content: SelectLetter[] }) {
    const router = useRouter();
    const [isVisible, setIsVisible] = useState(true);
    const toggleVisibility = () => {
        setIsVisible(prevIsVisible => !prevIsVisible);
    };

    return (
        // 1. Grid Background
        <BackgroundBuilder removeImages={true}>

            {/* NEW: Dark overlay that fades in when the carousel is open */}
            {!isVisible && (
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-0 pointer-events-none transition-opacity duration-500" />
            )}

            {/* 3. Centered Content (Top Layer) */}
            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                {isVisible ? (
                    <button
                        onClick={toggleVisibility}
                        className="relative w-[320px] h-[280px] cursor-pointer hover:scale-105 transition-transform duration-200 pointer-events-auto"
                    >
                        <Image
                            src="/letter folder.png"
                            alt="Center Button"
                            fill
                            style={{ objectFit: "contain" }}
                        />
                    </button>
                ) : (
                    // FIX: We wrap the carousel in 'pointer-events-auto' so you can scroll/click it!
                    <div className="pointer-events-auto w-full z-10 flex flex-col items-center">
                        <div className="relative w-full max-w-6xl mx-auto px-4 group">
                            {/* Scrollable Container */}
                            <div
                                className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-12 pt-4
                           scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none]
                           [&::-webkit-scrollbar]:hidden"
                            >
                                {letters_content.map((letter) => (
                                    <div
                                        key={letter.id}
                                        className="snap-center shrink-0 w-[85vw] md:w-[450px] flex flex-col items-center transition-transform duration-300 hover:scale-[1.02]"
                                    >
                                        {/* Letter Container */}
                                        <div className="relative w-full aspect-[4/5] drop-shadow-2xl flex items-center justify-center p-8 md:p-12">
                                            <Image
                                                src="/letter writing .png"
                                                alt="Parchment paper"
                                                fill
                                                priority
                                                className="object-contain -z-10 select-none"
                                                sizes="(max-width: 768px) 85vw, 450px"
                                            />

                                            {/* Text Content */}
                                            <div className="relative z-10 w-full h-full flex flex-col justify-between text-slate-800 font-serif overflow-hidden py-6">
                                                <div>
                                                    <h3 className="text-xl md:text-2xl font-bold mb-3 border-b border-slate-900/10 pb-2">
                                                        {letter.title}
                                                    </h3>
                                                    <p className="text-sm md:text-base leading-relaxed line-clamp-[10] italic">
                                                        {letter.content}
                                                    </p>
                                                </div>

                                                <div className="flex justify-between items-center mt-4">
                                    <span className="text-[10px] uppercase tracking-widest text-slate-500">
                                        Ref: #{letter.id}
                                    </span>
                                                    <span className="text-xs font-semibold text-slate-600">
                                        {new Date(letter.createdAt).toLocaleDateString(undefined, {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </span>
                                                </div>
                                            </div>
                                        </div>


                                    </div>
                                ))}
                            </div>

                            {/* Visual Hint: Gradient Fades on edges */}
                        </div>

                        {/* Optional but recommended: A button to close the carousel */}
                        <button
                            onClick={toggleVisibility}
                            className="mt-6 px-6 py-2 bg-white/10 hover:bg-white/20 text-white/80 hover:text-white rounded-full transition-colors text-sm backdrop-blur-md border border-white/10"
                        >
                            Close Scrapbook
                        </button>
                        {/* Action Button */}
                        <button
                            onClick={() => router.push(`/admin`)}
                            className="mt-6 px-8 py-2.5 bg-amber-900 text-amber-50 rounded-full
                                       hover:bg-amber-800 transition-all shadow-lg active:scale-95
                                       font-medium text-sm tracking-wide"
                        >
                            Edit Entry
                        </button>
                    </div>
                )}
            </div>
        </BackgroundBuilder>

    );
}