// db/schema.ts
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const scrapbookEntries = sqliteTable('scrapbook_entries', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    key: text('key').notNull(), // The UploadThing file key
    url: text('url').notNull(),
    caption: text('caption').default(''),
    // --- Grouping Fields ---
    // The integer ID for the group this image belongs to, used for ordering groups
    groupId: integer('group_id'),
    // The internal order of an image within its group (0 is the thumbnail)
    groupOrderIndex: integer('group_order_index').notNull().default(0),
});

export const letters = sqliteTable('scrapbook_letters', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    title: text('title').notNull(),
    content: text('content').notNull(),
    createdAt: text('created_at').notNull()
});

// Infer types for TypeScript
export type SelectEntry = typeof scrapbookEntries.$inferSelect;
export type InsertEntry = typeof scrapbookEntries.$inferInsert;

// Infer types for the letters table
export type SelectLetter = typeof letters.$inferSelect;
export type InsertLetter = typeof letters.$inferInsert;