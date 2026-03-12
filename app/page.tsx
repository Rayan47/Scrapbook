"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import BackgroundBuilder from "@/app/components/bg";

export default function Home() {

    const router = useRouter();
  const handleCenterClick = () => {
    router.push("/login");
  };

  return (
        <BackgroundBuilder>

          {/* 3. Centered Image Button (Top Layer, Centered) */}
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
              {/* We use pointer-events-none on the wrapper so clicks pass through the empty space,
            but restore pointer-events-auto on the button itself so it remains clickable. */}
              <button
                  onClick={handleCenterClick}
                  className="relative w-80 h-70 cursor-pointer hover:scale-105 transition-transform duration-200 pointer-events-auto"
              >
                  <Image
                      src="/closed book-01.png"
                      alt="Center Button"
                      fill
                      style={{ objectFit: "contain" }}
                  />
              </button>
          </div>
        </BackgroundBuilder>

  );
}