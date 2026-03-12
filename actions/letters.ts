"use server";

import { db } from "@/src/db";
import { letters, type SelectLetter, type InsertLetter } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function addLetter(letter: Omit<InsertLetter, "id" | "createdAt">) {
    try {
        const newLetter = await db.insert(letters).values({
            ...letter,
            createdAt: new Date().toISOString(),
        }).returning();
        revalidatePath("/admin");
        return { success: true, letter: newLetter[0] };
    } catch (error) {
        console.error("Failed to add letter:", error);
        return { success: false, error: "Failed to add letter" };
    }
}

export async function updateLetter(id: number, updates: Partial<Omit<InsertLetter, "id" | "createdAt">>) {
    try {
        const updatedLetter = await db.update(letters)
            .set(updates)
            .where(eq(letters.id, id))
            .returning();
        revalidatePath("/admin");
        return { success: true, letter: updatedLetter[0] };
    } catch (error) {
        console.error("Failed to update letter:", error);
        return { success: false, error: "Failed to update letter" };
    }
}

export async function deleteLetter(id: number) {
    try {
        await db.delete(letters).where(eq(letters.id, id));
        revalidatePath("/admin");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete letter:", error);
        return { success: false, error: "Failed to delete letter" };
    }
}
