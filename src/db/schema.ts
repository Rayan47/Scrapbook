// db/schema.ts
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const scrapbookEntries = sqliteTable('scrapbook_entries', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    key: text('key').notNull(), // The UploadThing file key
    url: text('url').notNull(),
    caption: text('caption').default(''),
    orderIndex: integer('order_index').notNull().default(0),
});

// Infer types for TypeScript
export type SelectEntry = typeof scrapbookEntries.$inferSelect;