import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const $users = pgTable('users', {
  id: serial('id').primaryKey(),
  visibleId: text('user_id').notNull().unique(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const $notes = pgTable('notes', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  imageUrl: text('imageUrl'),
  userId: text('user_id').notNull(),
  editorState: text('editor_state'),
});

export type UserType = typeof $users.$inferInsert;
export type NoteType = typeof $notes.$inferInsert;
