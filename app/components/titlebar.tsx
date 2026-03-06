import { Press_Start_2P } from "next/font/google";

// Initialize the 8-bit font
const pixelFont = Press_Start_2P({
    weight: "400",
    subsets: ["latin"],
    display: "swap",
});

export default function Title_bar() {
    return (
        // 1. Removed the fixed height classes (h-24, h-32, etc.) so it naturally shrinks.
        <header className="absolute top-0 left-1/2 -translate-x-1/2 w-[62vw] max-w-[777px] z-10 mt-4">

            {/* 2. Added tight vertical padding (py-3 md:py-5) to shrink the box's height around the text */}
            <div className="w-full bg-[#76b3cf] border-[8px] border-black flex items-center justify-center py-3 md:py-5 px-4 md:px-8">

                {/* 3. Added 'leading-none' to strip away the font's invisible vertical spacing for perfect centering */}
                <h1
                    className={`${pixelFont.className} flex w-full justify-around text-2xl md:text-4xl lg:text-5xl tracking-widest leading-none`}
                >
          <span className="text-[#f3eed5] drop-shadow-sm" style={textOutlineStyle}>
            THANNE
          </span>
                    <span className="text-[#f3eed5] drop-shadow-sm" style={textOutlineStyle}>
            THANNE
          </span>
                </h1>

            </div>
        </header>
    );
}

// Custom inline style to handle the text stroke
const textOutlineStyle = {
    WebkitTextStroke: "6px #ebb646", // The gold/yellow outline
    paintOrder: "stroke fill",       // Ensures the stroke draws outside the letters
};