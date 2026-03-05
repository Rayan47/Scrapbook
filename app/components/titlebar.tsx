import Image from "next/image";

export default function Title_bar(){

    return (
    <header className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-40 flex items-center justify-center z-10 pt-0">
        {/* The left-1/2 and -translate-x-1/2 combo ensures perfect centering regardless of the width */}

        <div className="relative w-full max-w-10xl h-full">
    <Image
        src="/title-01.png"
    alt="Website Title"
    fill
    style={{ objectFit: "contain" }}
    priority
    />
    </div>
    </header>
    )


}