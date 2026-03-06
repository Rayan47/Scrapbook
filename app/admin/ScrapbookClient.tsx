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
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Add New Memories</h2>
                <UploadButton
                    endpoint="imageUploader"
                    onClientUploadComplete={handleUploadComplete}
                    onUploadError={(error: Error) => alert(error.message)}
                    appearance={{
                        button: {
                            color: "black",
                        },
                    }}
                />
            </section>

            {/* Gallery Section */}
            <section className="bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden">

                {/* Sticky Action Bar */}
                <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-200 p-4 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Scrapbook Gallery</h2>
                        <p className="text-sm text-gray-500">{entries.length} photos in your scrapbook</p>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isSaving ? "Saving..." : "Save All Changes"}
                    </button>
                </div>

                {/* Photo Grid */}
                <div className="p-6">
                    {entries.length === 0 ? (
                        <div className="text-center py-12 text-gray-500 italic">
                            No photos yet. Upload some memories above!
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {entries.map((entry, index) => (
                                <div
                                    key={entry.id}
                                    className="group flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                                >
                                    {/* Image Container with Hover Controls */}
                                    <div className="relative aspect-square w-full bg-gray-100">
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
                                                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-transform hover:scale-105"
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
                                                    className="bg-white text-gray-800 p-2 rounded-full shadow-lg hover:bg-gray-100 disabled:opacity-0 transition-all"
                                                    title="Move Earlier"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                                                </button>
                                                <button
                                                    onClick={() => moveDown(index)}
                                                    disabled={index === entries.length - 1}
                                                    className="bg-white text-gray-800 p-2 rounded-full shadow-lg hover:bg-gray-100 disabled:opacity-0 transition-all"
                                                    title="Move Later"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Paper-styled Caption Area */}
                                    <div className="flex-1 p-4 bg-[#fdfbf7] border-t border-gray-100 flex flex-col">
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                Caption
                                            </label>
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-200 px-2 py-0.5 rounded-full">
                                                Slot {index + 1}
                                            </span>
                                        </div>
                                        <textarea
                                            value={entry.caption || ""}
                                            onChange={(e) => updateCaption(entry.id, e.target.value)}
                                            placeholder="Write a memory here..."
                                            className="w-full flex-1 bg-transparent border-b-2 border-dashed border-gray-300 focus:border-blue-400 outline-none resize-none text-gray-700 text-sm py-1 placeholder:text-gray-400"
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