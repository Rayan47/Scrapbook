"use client";

import React, { useState } from "react";
import { Press_Start_2P } from "next/font/google";
import { useRouter } from "next/navigation";


// Initialize the retro font
const pixelFont = Press_Start_2P({
    weight: "400",
    subsets: ["latin"],
    // Adjust font size slightly as this font renders quite large
    variable: '--font-pixel'
});

export default function RetroLogin() {
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        router.push("/open_book");

    };

    return (
        // 1. Grid Background
        <main
            className={`min-h-screen flex items-center justify-center ${pixelFont.className}`}
            style={{
                backgroundColor: "#fdf3ce", // Light yellow background
                backgroundImage: `
          linear-gradient(to right, white 2px, transparent 2px),
          linear-gradient(to bottom, white 2px, transparent 2px)
        `,
                backgroundSize: "40px 40px"
            }}
        >

            {/* 2. Main Window Container */}
            <div className="w-[450px] max-w-[90vw] border-[4px] border-black rounded-3xl overflow-hidden shadow-sm bg-[#f3ecdc]">

                {/* 3. Title Bar */}
                <div className="bg-[#73b6cf] border-b-[4px] border-black px-4 py-3 flex justify-between items-center">
                    <h1 className="text-black text-sm md:text-base tracking-widest mt-1">
                        ENTER PASSWORD &lt;3
                    </h1>

                    {/* Close Button */}
                    <button className="bg-[#ebb647] border-[3px] border-black rounded-md w-8 h-8 flex items-center justify-center hover:bg-yellow-400 active:scale-95 transition-all">
                        <span className="text-black text-xl leading-none mt-1">X</span>
                    </button>
                </div>

                {/* 4. Window Body & Form */}
                <form onSubmit={handleSubmit} className="p-8 flex flex-col items-center">

                    <div className="w-full mb-10 flex items-end">
                        <label className="text-black text-sm mr-4 mb-2">
                            PASSWORD:
                        </label>
                        {/* Input Field: styled as just a bottom border */}
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="flex-1 bg-transparent border-b-[3px] border-black outline-none text-black px-2 pb-1 text-lg font-sans"
                            autoFocus
                        />
                    </div>

                    {/* 5. OK Button */}
                    <button
                        type="submit"
                        className="bg-[#ed8b98] border-[4px] border-black rounded-full px-8 py-3 hover:bg-[#ff9caa] active:scale-95 transition-all"
                    >
            <span className="text-black text-sm tracking-widest mt-1 block">
              OK !
            </span>
                    </button>

                </form>
            </div>

        </main>
    );
}