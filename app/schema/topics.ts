import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { relations } from 'drizzle-orm';

import { user } from './auth';

export const topics = sqliteTable('topics', {
  id: integer().primaryKey(),
  title: text().notNull(),
  description: text().notNull(),
  createdAt: text()
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text(),
  createdBy: text()
    .notNull()
    .references(() => user.id),
});

export const topicsRelations = relations(topics, ({ one, many }) => ({
  creator: one(user, {
    fields: [topics.createdBy],
    references: [user.id],
  }),
  votes: many(votes),
}));

export const votes = sqliteTable('votes', {
  id: integer().primaryKey(),
  topicId: integer().references(() => topics.id),
  userId: integer().references(() => user.id),
  createdAt: text().default(sql`(CURRENT_TIMESTAMP)`),
});

export const votesRelations = relations(votes, ({ one }) => ({
  topic: one(topics, {
    fields: [votes.topicId],
    references: [topics.id],
  }),
  user: one(user, {
    fields: [votes.userId],
    references: [user.id],
  }),
}));
