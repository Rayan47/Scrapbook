// actions/scrapbook.ts
"use server";

import { db } from "@/src/db"; // Your Drizzle DB instance connected to Turso
import { scrapbookEntries } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { UTApi } from "uploadthing/server";
import { revalidatePath } from "next/cache";

const utapi = new UTApi();

// 1. Save new uploads to Turso
export async function saveNewUploads(uploads: { key: string; url: string; orderIndex: number }[]) {
    if (uploads.length === 0) return [];

    const inserted = await db.insert(scrapbookEntries).values(uploads).returning();
    revalidatePath("/admin"); // Refresh the page data
    return inserted;
}

// 2. Sync captions and ordering to Turso
export async function syncEntries(entries: { id: number; caption: string | null; orderIndex: number }[]) {
    // In SQLite/Turso, we update row by row (or use a batch transaction)
    for (const entry of entries) {
        await db
            .update(scrapbookEntries)
            .set({ caption: entry.caption, orderIndex: entry.orderIndex })
            .where(eq(scrapbookEntries.id, entry.id));
    }
    revalidatePath("/admin");
    return { success: true };
}

// 3. Delete from UploadThing AND Turso
export async function deleteEntry(id: number, fileKey: string) {
    try {
        // Delete the physical file from UploadThing
        await utapi.deleteFiles(fileKey);
        // Delete the record from Turso
        await db.delete(scrapbookEntries).where(eq(scrapbookEntries.id, id));

        revalidatePath("/admin");
        return { success: true };
    } catch (error) {
        console.error("Deletion failed:", error);
        return { success: false };
    }
}