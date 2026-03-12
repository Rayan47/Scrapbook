"use client";

import { useState } from "react";
import Image from "next/image";
import { UploadButton } from "@/src/utils/uploadthing";
import { addImagesToGroup, syncEntries, deleteEntry, reorderGroupImages, createNewGroup } from "@/actions/scrapbook";
import { addLetter, updateLetter, deleteLetter } from "@/actions/letters";
import type { SelectEntry, SelectLetter } from "@/src/db/schema";
import { ClientUploadedFileData } from "uploadthing/types";
import "@uploadthing/react/styles.css";

interface Props {
    initialEntries: SelectEntry[];
    initialLetters: SelectLetter[];
}

export default function ScrapbookClient({ initialEntries, initialLetters }: Props) {
    // --- SCRAPBOOK ENTRIES STATE ---
    // Sort initial entries by groupId and then groupOrderIndex
    const [entries, setEntries] = useState<SelectEntry[]>(
        [...initialEntries].sort((a, b) => {
            if (a.groupId !== b.groupId) {
                return (a.groupId || 0) - (b.groupId || 0);
            }
            return a.groupOrderIndex - b.groupOrderIndex;
        })
    );
    const [isSaving, setIsSaving] = useState(false);

    // Group entries by groupId and sort by groupOrderIndex
    const groupedEntries = entries.reduce((acc, entry) => {
        const groupId = entry.groupId;
        if (groupId === null || groupId === undefined) return acc;
        
        if (!acc[groupId]) {
            acc[groupId] = [];
        }
        acc[groupId].push(entry);
        return acc;
    }, {} as Record<number, SelectEntry[]>);

    // Sort entries within each group
    Object.keys(groupedEntries).forEach(key => {
        const groupId = Number(key);
        groupedEntries[groupId].sort((a, b) => a.groupOrderIndex - b.groupOrderIndex);
    });

    // We need a way to track empty groups created in this session
    const [emptyGroupIds, setEmptyGroupIds] = useState<number[]>([]);

    // --- LETTERS STATE ---
    const [letters, setLetters] = useState<SelectLetter[]>(initialLetters);
    const [newLetterTitle, setNewLetterTitle] = useState("");
    const [newLetterContent, setNewLetterContent] = useState("");
    const [editingLetterId, setEditingLetterId] = useState<number | null>(null);
    const [editLetterTitle, setEditLetterTitle] = useState("");
    const [editLetterContent, setEditLetterContent] = useState("");

    // --- SCRAPBOOK HANDLERS ---
    const handleCreateGroupAndShow = async () => {
        const res = await createNewGroup();
        if (res.success && res.newGroupId) {
            setEmptyGroupIds(prev => [...prev, res.newGroupId!]);
        }
    };

    // Merge existing group IDs with empty group IDs
    const allGroupIds = Array.from(new Set([...Object.keys(groupedEntries).map(Number), ...emptyGroupIds])).sort((a, b) => a - b);


    const handleGroupUploadComplete = async (groupId: number, res: ClientUploadedFileData<{ uploadedBy: string }>[]) => {
        console.log(`Upload complete for group ${groupId}:`, res);
        const newUploads = res.map((file) => ({
            key: file.key,
            url: file.url,
        }));

        const savedEntries = await addImagesToGroup(groupId, newUploads);
        if (savedEntries && savedEntries.length > 0) {
            // Remove from empty groups if we just added to it
            if (emptyGroupIds.includes(groupId)) {
                setEmptyGroupIds(prev => prev.filter(id => id !== groupId));
            }
            setEntries((prev) => [...prev, ...savedEntries]);
            alert("Images added to group!");
        }
    };

    const updateCaption = (id: number, newCaption: string) => {
        setEntries((prev) =>
            prev.map((entry) => (entry.id === id ? { ...entry, caption: newCaption } : entry))
        );
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

    const handleReorder = async (groupId: number, currentIndex: number, direction: 'left' | 'right') => {
        const group = groupedEntries[groupId];
        if (!group) return;

        const newIndex = direction === 'left' ? currentIndex - 1 : currentIndex + 1;
        if (newIndex < 0 || newIndex >= group.length) return;

        // Swap in local state for immediate feedback
        const newGroup = [...group];
        [newGroup[currentIndex], newGroup[newIndex]] = [newGroup[newIndex], newGroup[currentIndex]];
        
        // Update the groupOrderIndex for all items in the group based on their new position
        const orderedIds = newGroup.map(entry => entry.id);
        
        // Optimistic update
        const updatedEntries = entries.map(entry => {
            if (entry.groupId === groupId) {
                const newOrderIndex = orderedIds.indexOf(entry.id);
                return { ...entry, groupOrderIndex: newOrderIndex };
            }
            return entry;
        });
        setEntries(updatedEntries);

        // Persist to server
        await reorderGroupImages(groupId, orderedIds);
    };

    // --- LETTERS HANDLERS ---
    const handleAddLetter = async () => {
        if (!newLetterTitle.trim() || !newLetterContent.trim()) {
            alert("Please fill in both title and content for the letter.");
            return;
        }

        const res = await addLetter({
            title: newLetterTitle,
            content: newLetterContent
        });

        if (res.success && res.letter) {
            setLetters(prev => [...prev, res.letter!]);
            setNewLetterTitle("");
            setNewLetterContent("");
            alert("Letter added!");
        } else {
            alert("Failed to add letter.");
        }
    };

    const startEditingLetter = (letter: SelectLetter) => {
        setEditingLetterId(letter.id);
        setEditLetterTitle(letter.title);
        setEditLetterContent(letter.content);
    };

    const cancelEditingLetter = () => {
        setEditingLetterId(null);
        setEditLetterTitle("");
        setEditLetterContent("");
    };

    const handleUpdateLetter = async (id: number) => {
        if (!editLetterTitle.trim() || !editLetterContent.trim()) {
            alert("Title and content cannot be empty.");
            return;
        }

        const res = await updateLetter(id, {
            title: editLetterTitle,
            content: editLetterContent
        });

        if (res.success && res.letter) {
            setLetters(prev => prev.map(l => l.id === id ? res.letter! : l));
            setEditingLetterId(null);
            alert("Letter updated!");
        } else {
            alert("Failed to update letter.");
        }
    };

    const handleDeleteLetter = async (id: number) => {
        if (!window.confirm("Permanently delete this letter?")) return;
        
        const res = await deleteLetter(id);
        if (res.success) {
            setLetters(prev => prev.filter(l => l.id !== id));
        } else {
            alert("Failed to delete letter.");
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-12">

            {/* --- MEMORIES SECTION --- */}
            <div>
                <h1 className="text-2xl font-bold text-[#5d4037] mb-6 font-mono border-b-4 border-[#5d4037] inline-block pb-2">
                    Manage Memories
                </h1>

                {/* Top Action Section */}
                <section className="bg-[#fdfbf7] p-6 rounded-sm shadow-[4px_4px_0px_0px_rgba(93,64,55,1)] border-2 border-[#5d4037] mb-8 flex justify-between items-end">
                    <div>
                        <h2 className="text-xl font-bold text-[#5d4037] mb-2 font-mono">Manage Groups</h2>
                        <button
                            onClick={handleCreateGroupAndShow}
                            className="bg-[#e0c097] hover:bg-[#d7b486] text-[#5d4037] px-6 py-2.5 rounded-sm font-bold shadow-[2px_2px_0px_0px_rgba(93,64,55,1)] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-2 border-2 border-[#5d4037] font-mono"
                        >
                            + Create New Group
                        </button>
                    </div>
                    <div>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="bg-[#e0c097] hover:bg-[#d7b486] text-[#5d4037] px-6 py-2.5 rounded-sm font-bold shadow-[2px_2px_0px_0px_rgba(93,64,55,1)] active:translate-y-[2px] active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 border-2 border-[#5d4037] font-mono"
                        >
                            {isSaving ? "Saving..." : "Save All Changes"}
                        </button>
                    </div>
                </section>

                {/* Groups List */}
                <div className="space-y-8">
                    {allGroupIds.map((groupId) => (
                        <section key={groupId} className="bg-[#fdfbf7] rounded-sm border-2 border-[#5d4037] shadow-[4px_4px_0px_0px_rgba(93,64,55,1)] overflow-hidden">
                            <div className="bg-[#e0c097] p-3 border-b-2 border-[#5d4037] flex justify-between items-center">
                                <h3 className="text-lg font-bold text-[#5d4037] font-mono">Group #{groupId}</h3>
                                <div className="flex items-center gap-4">
                                    <span className="text-sm font-mono text-[#5d4037]">{groupedEntries[groupId]?.length || 0} images</span>
                                    <UploadButton
                                        endpoint="imageUploader"
                                        onClientUploadComplete={(res) => handleGroupUploadComplete(groupId, res)}
                                        onUploadError={(error: Error) => alert(error.message)}
                                        content={{
                                            button({ ready }) {
                                                if (ready) return "Add Image";
                                                return "...";
                                            },
                                        }}
                                        appearance={{
                                            button: {
                                                color: "#5d4037",
                                                backgroundColor: "#fdfbf7",
                                                border: "1px solid #5d4037",
                                                borderRadius: "0px",
                                                fontSize: "0.75rem",
                                                padding: "0.25rem 0.5rem",
                                                fontFamily: "monospace",
                                            },
                                            allowedContent: {
                                                display: "none",
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                            
                            <div className="p-4 overflow-x-auto">
                                {(!groupedEntries[groupId] || groupedEntries[groupId].length === 0) ? (
                                    <div className="text-center py-8 text-[#8d6e63] italic font-mono text-sm">
                                        This group is empty. Add an image to get started.
                                    </div>
                                ) : (
                                    <div className="flex gap-4 pb-2">
                                        {groupedEntries[groupId].map((entry, index) => (
                                            <div key={entry.id} className="flex-shrink-0 w-64 bg-white border-2 border-[#5d4037] p-2 shadow-sm">
                                                <div className="relative aspect-square w-full mb-2 border border-[#5d4037]">
                                                    <Image
                                                        src={entry.url}
                                                        alt="Scrapbook photo"
                                                        fill
                                                        className="object-cover"
                                                    />
                                                    {index === 0 && (
                                                        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 font-mono border border-black shadow-sm">
                                                            THUMBNAIL
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                <div className="space-y-2">
                                                    <textarea
                                                        value={entry.caption || ""}
                                                        onChange={(e) => updateCaption(entry.id, e.target.value)}
                                                        placeholder="Caption..."
                                                        className="w-full bg-transparent border-b border-dashed border-[#8d6e63] focus:border-[#5d4037] outline-none resize-none text-[#5d4037] text-xs py-1 font-mono h-16"
                                                    />
                                                    
                                                    <div className="flex flex-col gap-2">
                                                        {/* Reorder Controls */}
                                                        <div className="flex justify-center gap-2">
                                                            <button
                                                                onClick={() => handleReorder(groupId, index, 'left')}
                                                                disabled={index === 0}
                                                                className="bg-[#e0c097] text-[#5d4037] px-2 py-1 rounded-sm border border-[#5d4037] shadow-[1px_1px_0px_0px_rgba(93,64,55,1)] active:translate-y-[1px] active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed font-mono text-xs"
                                                            >
                                                                &lt;
                                                            </button>
                                                            <button
                                                                onClick={() => handleReorder(groupId, index, 'right')}
                                                                disabled={index === groupedEntries[groupId].length - 1}
                                                                className="bg-[#e0c097] text-[#5d4037] px-2 py-1 rounded-sm border border-[#5d4037] shadow-[1px_1px_0px_0px_rgba(93,64,55,1)] active:translate-y-[1px] active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed font-mono text-xs"
                                                            >
                                                                &gt;
                                                            </button>
                                                        </div>

                                                        <button
                                                            onClick={() => handleDelete(entry.id, entry.key)}
                                                            className="text-xs text-red-500 font-mono text-left hover:underline mt-1"
                                                        >
                                                            Delete Image
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </section>
                    ))}
                </div>
            </div>

            {/* --- LETTERS SECTION --- */}
            <div className="pt-8 border-t-4 border-dashed border-[#5d4037]">
                <h1 className="text-2xl font-bold text-[#5d4037] mb-6 font-mono border-b-4 border-[#5d4037] inline-block pb-2">
                    Manage Letters
                </h1>

                {/* Add New Letter */}
                <section className="bg-[#fdfbf7] p-6 rounded-sm shadow-[4px_4px_0px_0px_rgba(93,64,55,1)] border-2 border-[#5d4037] mb-8">
                    <h2 className="text-xl font-bold text-[#5d4037] mb-4 font-mono">Add New Letter</h2>
                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="Letter Title"
                            value={newLetterTitle}
                            onChange={(e) => setNewLetterTitle(e.target.value)}
                            className="w-full bg-white border-2 border-[#5d4037] p-2 font-mono text-[#5d4037] focus:outline-none focus:bg-[#fefefe]"
                        />
                        <textarea
                            placeholder="Letter Content..."
                            value={newLetterContent}
                            onChange={(e) => setNewLetterContent(e.target.value)}
                            rows={5}
                            className="w-full bg-white border-2 border-[#5d4037] p-2 font-mono text-[#5d4037] focus:outline-none focus:bg-[#fefefe]"
                        />
                        <button
                            onClick={handleAddLetter}
                            className="bg-[#e0c097] hover:bg-[#d7b486] text-[#5d4037] px-6 py-2.5 rounded-sm font-bold shadow-[2px_2px_0px_0px_rgba(93,64,55,1)] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-2 border-2 border-[#5d4037] font-mono"
                        >
                            + Add Letter
                        </button>
                    </div>
                </section>

                {/* Letters List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {letters.map((letter) => (
                        <div key={letter.id} className="bg-[#fdfbf7] p-4 rounded-sm border-2 border-[#5d4037] shadow-[4px_4px_0px_0px_rgba(93,64,55,1)] flex flex-col">
                            {editingLetterId === letter.id ? (
                                // Edit Mode
                                <div className="space-y-4 flex-grow">
                                    <input
                                        type="text"
                                        value={editLetterTitle}
                                        onChange={(e) => setEditLetterTitle(e.target.value)}
                                        className="w-full bg-white border-2 border-[#5d4037] p-2 font-mono text-[#5d4037] focus:outline-none"
                                    />
                                    <textarea
                                        value={editLetterContent}
                                        onChange={(e) => setEditLetterContent(e.target.value)}
                                        rows={5}
                                        className="w-full bg-white border-2 border-[#5d4037] p-2 font-mono text-[#5d4037] focus:outline-none"
                                    />
                                    <div className="flex gap-2 justify-end">
                                        <button
                                            onClick={cancelEditingLetter}
                                            className="px-3 py-1 bg-gray-200 border-2 border-[#5d4037] text-[#5d4037] font-mono hover:bg-gray-300"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => handleUpdateLetter(letter.id)}
                                            className="px-3 py-1 bg-[#e0c097] border-2 border-[#5d4037] text-[#5d4037] font-mono hover:bg-[#d7b486]"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                // View Mode
                                <div className="flex flex-col h-full">
                                    <h3 className="text-lg font-bold text-[#5d4037] font-mono mb-2 pb-2 border-b-2 border-[#5d4037] border-dashed">
                                        {letter.title}
                                    </h3>
                                    <p className="text-[#5d4037] font-mono text-sm whitespace-pre-wrap flex-grow mb-4">
                                        {letter.content}
                                    </p>
                                    <div className="flex justify-between items-center text-xs mt-auto">
                                        <span className="text-[#8d6e63] font-mono">
                                            {new Date(letter.createdAt).toLocaleDateString()}
                                        </span>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => startEditingLetter(letter)}
                                                className="text-[#5d4037] hover:underline font-bold font-mono"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteLetter(letter.id)}
                                                className="text-red-500 hover:underline font-bold font-mono"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                
                {letters.length === 0 && (
                    <div className="text-center py-8 text-[#8d6e63] italic font-mono">
                        No letters yet. Write something special!
                    </div>
                )}
            </div>

        </div>
    );
}