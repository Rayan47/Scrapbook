"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {

    const router = useRouter();
  const handleCenterClick = () => {
    router.push("/open_book");
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

        {/* 2. Titlebar Image (Top Layer, Fixed to Top) */}
          <header className="absolute top-0 left-0 w-200 h-80 flex items-center justify-center z-10 pt-0">
              {/* Increased h-32 to h-64 (16rem/256px) */}

              <div className="relative w-full max-w-10xl h-full">
                  {/* Increased max-w-2xl to max-w-5xl to give the image room to expand horizontally */}
                  <Image
                      src="/title-01.png"
                      alt="Website Title"
                      fill
                      style={{ objectFit: "contain" }}
                      priority
                  />
              </div>
          </header>

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

      </main>
  );
}