"use client"

import { Press_Start_2P } from "next/font/google";
import { ReactNode } from "react";
import Image from "next/image";
import { Bar } from "@/app/components/titlebar";
import {useRouter} from "next/navigation";

const pixelFont = Press_Start_2P({
    weight: "400",
    subsets: ["latin"],
    variable: '--font-pixel'
});



export default function BackgroundBuilder({children, removeImages}: {
    children: ReactNode,
    removeImages?: boolean
}) {

    const router = useRouter();
    const handleLetterClick = () => {
        router.push("/letters");
    };
    return (

        <div className={`min-h-screen flex flex-col items-center justify-start pt-4 gap-8 ${pixelFont.className} relative overflow-hidden`}
              style={{
                  backgroundColor: "#fdf3ce", // Light yellow background
                  backgroundImage: `
          linear-gradient(to right, white 2px, transparent 2px),
          linear-gradient(to bottom, white 2px, transparent 2px)
        `,
                  backgroundSize: "40px 40px"
              }}>
            <Bar>THANNE THANNE</Bar>
            {!removeImages && (
                <div>
            {/* TOP LEFT: Polaroids */}
            <div className="absolute mt-[-2rem] top-4 left-4 md:top-8 md:left-4 w-48 md:w-72 pointer-events-none">
                {/* Replace with your actual separated image paths */}
                <Image
                    src="/polaroid .png"
                    alt="Polaroid decoration"
                    width={420}
                    height={420}
                    className="w-100 h-auto drop-shadow-lg"
                />
            </div>

            {/* TOP RIGHT: Coffee Cup */}
            {/* Pushed slightly off-screen on mobile to save space */}
            <div className="absolute -top-6 -right-6 md:top-4 md:right-4 w-40 md:w-72 pointer-events-none">
                <Image
                    src="/cup .png"
                    alt="Coffee cup"
                    width={345}
                    height={345}
                    className="w-full h-auto drop-shadow-md"
                />
            </div>

            {/* BOTTOM LEFT: Pencils and Scale */}
            <div className="absolute bottom-2 mb-[-4rem] left-2 md:bottom-8 md:left-8 pointer-events-none flex items-end">
                {/* Pencils stay anchored to the left */}
                <div className="w-56 ml-[-6rem] md:w-96 relative z-10">
                    <Image
                        src="/pencils.png"
                        alt="Pencils and ruler"
                        width={180}
                        height={90}
                        className="w-72 h-auto drop-shadow-md"
                    />
                </div>
                {/* Scale pushed closer to the middle */}
                <div className="w-[26rem] ml-[-6rem] mb-8 relative z-0">
                    <Image
                        src="/scale.png"
                        alt="Scale"
                        width={600}
                        height={600}
                        className="w-full h-auto drop-shadow-md"
                    />
                </div>
            </div>

            {/* BOTTOM RIGHT: The Interactive Letter & Hearts */}
            <div className="absolute bottom-6 right-6 md:bottom-2 md:right-12 flex items-center z-50">
                {/* Decorative Hearts - Pushed closer to the middle */}
                <div className="hidden md:block w-48 mb-[-5rem] mr-[1rem] pointer-events-none relative z-0">
                    <Image
                        src="/heart .png"
                        alt="Hearts"
                        width={231}
                        height={231}
                        className="w-full h-auto"
                    />
                </div>

                {/* The Letter Button - Stays anchored to the right */}
                <button
                    onClick={handleLetterClick}
                    className="w-60 md:w-[20rem] transition-transform duration-200 hover:-translate-y-2 hover:scale-105 hover:rotate-2 mr-[-3rem]] focus:outline-none relative z-10"
                    aria-label="Open letter"
                >
                    <Image
                        src="/letter .png"
                        alt="Open letter"
                        width={460}
                        height={231}
                        className="w-full h-auto drop-shadow-xl"
                    />
                </button>
            </div>

                <div/>
                </div>)}
            <main>


            {children}
            </main>


        </div>
    );
        }