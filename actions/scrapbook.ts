// actions/scrapbook.ts
"use server";

import { db } from "@/src/db";
import { scrapbookEntries } from "@/src/db/schema";
import { eq, and, max } from "drizzle-orm";
import { UTApi } from "uploadthing/server";
import { revalidatePath } from "next/cache";

const utapi = new UTApi();

// Helper to get the next available group ID
async function getNextGroupId() {
    const result = await db
        .select({ maxId: max(scrapbookEntries.groupId) })
        .from(scrapbookEntries);
    return (result[0]?.maxId || 0) + 1;
}

// 1. Add new images to a specific group
export async function addImagesToGroup(groupId: number, uploads: { key: string; url: string }[]) {
    if (uploads.length === 0) return [];

    // Find the max groupOrderIndex in the target group to append the new images
    const result = await db
        .select({ maxIndex: max(scrapbookEntries.groupOrderIndex) })
        .from(scrapbookEntries)
        .where(eq(scrapbookEntries.groupId, groupId));
    
    let nextIndex = (result[0]?.maxIndex ?? -1) + 1;

    const newEntries = uploads.map((upload) => ({
        ...upload,
        groupId: groupId,
        groupOrderIndex: nextIndex++,
    }));

    const inserted = await db.insert(scrapbookEntries).values(newEntries).returning();
    revalidatePath("/admin");
    return inserted;
}

// 2. Save new uploads: Each gets its own new group
export async function saveNewUploads(uploads: { key: string; url: string }[]) {
    if (uploads.length === 0) return [];

    const newEntries = [];
    let nextGroupId = await getNextGroupId();

    for (const upload of uploads) {
        newEntries.push({
            ...upload,
            groupId: nextGroupId++,
            groupOrderIndex: 0, // It's the first and only image in its group
        });
    }

    const inserted = await db.insert(scrapbookEntries).values(newEntries).returning();
    revalidatePath("/admin");
    return inserted;
}

// 3. Sync captions only (ordering is now by groupId)
export async function syncEntries(entries: { id: number; caption: string | null }[]) {
    for (const entry of entries) {
        await db
            .update(scrapbookEntries)
            .set({ caption: entry.caption })
            .where(eq(scrapbookEntries.id, entry.id));
    }
    revalidatePath("/admin");
    return { success: true };
}

// 4. Delete entry
export async function deleteEntry(id: number, fileKey: string) {
    try {
        await utapi.deleteFiles(fileKey);
        await db.delete(scrapbookEntries).where(eq(scrapbookEntries.id, id));
        revalidatePath("/admin");
        return { success: true };
    } catch (error) {
        console.error("Deletion failed:", error);
        return { success: false };
    }
}

// 5. Reorder images within a group
export async function reorderGroupImages(groupId: number, orderedIds: number[]) {
    for (let i = 0; i < orderedIds.length; i++) {
        await db.update(scrapbookEntries)
            .set({ groupOrderIndex: i })
            .where(and(eq(scrapbookEntries.groupId, groupId), eq(scrapbookEntries.id, orderedIds[i])));
    }

    revalidatePath("/admin");
    return { success: true };
}

// 6. Create a new, empty group and return its ID
export async function createNewGroup() {
    const newGroupId = await getNextGroupId();
    // No need to insert anything, the group exists conceptually once we use its ID.
    revalidatePath("/admin");
    return { success: true, newGroupId };
}