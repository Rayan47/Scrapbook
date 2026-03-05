"use client";

import Image from "next/image";
import Title_bar from "@/app/components/titlebar";

export default function Home() {
    const handleCenterClick = () => {
        alert("Center image button was clicked!");
        // You can replace this alert with a router.push('/new-page') or other logic
    };

    return (
        <main className="relative w-full h-screen overflow-hidden">

            {/* 1. Static Background Image (Bottom Layer) */}
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

            {/* 3. Centered Image Button (Top Layer, Centered) */}
            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                {/* We use pointer-events-none on the wrapper so clicks pass through the empty space,
            but restore pointer-events-auto on the button itself so it remains clickable. */}
                <button
                    onClick={handleCenterClick}
                    className="relative w-160 h-80 cursor-pointer hover:scale-105 transition-transform duration-200 pointer-events-auto"
                >
                    <Image
                        src="/open book.png"
                        alt="Center Button"
                        fill
                        style={{ objectFit: "contain" }}
                    />
                </button>
            </div>

        </main>
    );
}