"use client";

import { useState } from "react";
import Image from "next/image";
import { UploadButton } from "@/src/utils/uploadthing";
import { saveNewUploads, syncEntries, deleteEntry } from "@/actions/scrapbook";
import type { SelectEntry } from "@/src/db/schema";
import { ClientUploadedFileData } from "uploadthing/types";

interface Props {
    initialEntries: SelectEntry[];
}

export default function ScrapbookClient({ initialEntries }: Props) {
    const [entries, setEntries] = useState<SelectEntry[]>(
        [...initialEntries].sort((a, b) => a.orderIndex - b.orderIndex)
    );
    const [isSaving, setIsSaving] = useState(false);

    const handleUploadComplete = async (res: ClientUploadedFileData<{ uploadedBy: string }>[]) => {
        console.log("Upload complete:", res);
        const startIndex = entries.length;
        const newUploads = res.map((file, i) => ({
            key: file.key,
            url: file.url,
            caption: "",
            orderIndex: startIndex + i,
        }));

        const savedEntries = await saveNewUploads(newUploads);
        if (savedEntries && savedEntries.length > 0) {
            setEntries((prev) => [...prev, ...savedEntries]);
            alert("Uploads saved to database!");
        }
    };

    const updateCaption = (id: number, newCaption: string) => {
        setEntries((prev) =>
            prev.map((entry) => (entry.id === id ? { ...entry, caption: newCaption } : entry))
        );
    };

    const moveUp = (index: number) => {
        if (index === 0) return;
        const newEntries = [...entries];
        [newEntries[index - 1], newEntries[index]] = [newEntries[index], newEntries[index - 1]];
        const reordered = newEntries.map((entry, i) => ({ ...entry, orderIndex: i }));
        setEntries(reordered);
    };

    const moveDown = (index: number) => {
        if (index === entries.length - 1) return;
        const newEntries = [...entries];
        [newEntries[index + 1], newEntries[index]] = [newEntries[index], newEntries[index + 1]];
        const reordered = newEntries.map((entry, i) => ({ ...entry, orderIndex: i }));
        setEntries(reordered);
    };

    const handleSave = async () => {
        setIsSaving(true);
        await syncEntries(entries);
        setIsSaving(false);
        alert("Captions and ordering synced to Turso!");
    };

    const handleDelete = async (id: number, key: string) => {
        if (!window.confirm("Permanently delete this memory?")) return;
        setEntries((prev) => prev.filter((entry) => entry.id !== id));
        await deleteEntry(id, key);
    };

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8">

            {/* Top Upload Section */}
            <section className="bg-[#fdfbf7] p-6 rounded-sm shadow-[4px_4px_0px_0px_rgba(93,64,55,1)] border-2 border-[#5d4037] mb-8">
                <h2 className="text-xl font-bold text-[#5d4037] mb-4 font-mono">Add New Memories</h2>
                <UploadButton
                    endpoint="imageUploader"
                    onClientUploadComplete={handleUploadComplete}
                    onUploadError={(error: Error) => alert(error.message)}
                    content={{
                        button({ ready }) {
                            if (ready) return "Click here to choose your image";
                            return "Getting ready...";
                        },
                    }}
                    appearance={{
                        button: {
                            color: "#5d4037",
                            backgroundColor: "#e0c097",
                            border: "2px solid #5d4037",
                            borderRadius: "0px",
                            boxShadow: "2px 2px 0px 0px rgba(93,64,55,1)",
                            fontFamily: "monospace",
                            fontWeight: "bold",
                            padding: "0.5rem 1rem",
                        },
                        container: {
                            display: "flex",
                            justifyContent: "flex-start",
                        },
                        allowedContent: {
                            color: "#5d4037",
                            fontFamily: "monospace",
                        }
                    }}
                />
            </section>

            {/* Gallery Section */}
            <section className="bg-[#fdfbf7] rounded-sm border-2 border-[#5d4037] shadow-[4px_4px_0px_0px_rgba(93,64,55,1)] overflow-hidden">

                {/* Sticky Action Bar */}
                <div className="sticky top-0 z-20 bg-[#fdfbf7]/90 backdrop-blur-md border-b-2 border-[#5d4037] p-4 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-[#5d4037] font-mono">Scrapbook Gallery</h2>
                        <p className="text-sm text-[#8d6e63] font-mono">{entries.length} photos in your scrapbook</p>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-[#e0c097] hover:bg-[#d7b486] text-[#5d4037] px-6 py-2.5 rounded-sm font-bold shadow-[2px_2px_0px_0px_rgba(93,64,55,1)] active:translate-y-[2px] active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 border-2 border-[#5d4037] font-mono"
                    >
                        {isSaving ? "Saving..." : "Save All Changes"}
                    </button>
                </div>

                {/* Photo Grid */}
                <div className="p-6">
                    {entries.length === 0 ? (
                        <div className="text-center py-12 text-[#8d6e63] italic font-mono">
                            No photos yet. Upload some memories above!
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {entries.map((entry, index) => (
                                <div
                                    key={entry.id}
                                    className="group flex flex-col bg-white rounded-sm shadow-[4px_4px_0px_0px_rgba(93,64,55,1)] border-2 border-[#5d4037] overflow-hidden hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(93,64,55,1)] transition-all"
                                >
                                    {/* Image Container with Hover Controls */}
                                    <div className="relative aspect-square w-full bg-gray-100 border-b-2 border-[#5d4037]">
                                        <Image
                                            src={entry.url}
                                            alt={`Scrapbook photo ${index + 1}`}
                                            fill
                                            className="object-cover"
                                        />

                                        {/* Overlay Controls (Visible on Hover) */}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                                            {/* Top: Delete Button */}
                                            <div className="flex justify-end">
                                                <button
                                                    onClick={() => handleDelete(entry.id, entry.key)}
                                                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-sm border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-transform hover:scale-105"
                                                    title="Delete Photo"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                                                </button>
                                            </div>

                                            {/* Bottom: Order Arrows */}
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() => moveUp(index)}
                                                    disabled={index === 0}
                                                    className="bg-white text-gray-800 p-2 rounded-sm border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-100 disabled:opacity-0 transition-all"
                                                    title="Move Earlier"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                                                </button>
                                                <button
                                                    onClick={() => moveDown(index)}
                                                    disabled={index === entries.length - 1}
                                                    className="bg-white text-gray-800 p-2 rounded-sm border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-100 disabled:opacity-0 transition-all"
                                                    title="Move Later"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Paper-styled Caption Area */}
                                    <div className="flex-1 p-4 bg-[#fdfbf7] flex flex-col">
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="text-[10px] font-bold text-[#8d6e63] uppercase tracking-widest font-mono">
                                                Caption
                                            </label>
                                            <span className="text-[10px] font-bold text-[#5d4037] uppercase tracking-widest bg-[#e0c097] px-2 py-0.5 rounded-sm border border-[#5d4037] font-mono">
                                                Slot {index + 1}
                                            </span>
                                        </div>
                                        <textarea
                                            value={entry.caption || ""}
                                            onChange={(e) => updateCaption(entry.id, e.target.value)}
                                            placeholder="Write a memory here..."
                                            className="w-full flex-1 bg-transparent border-b-2 border-dashed border-[#8d6e63] focus:border-[#5d4037] outline-none resize-none text-[#5d4037] text-sm py-1 placeholder:text-[#bcaaa4] font-mono"
                                            rows={2}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}