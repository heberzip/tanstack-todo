import { pgTable, boolean, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const todos = pgTable('todos', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  isComplete: boolean().default(false).notNull(),
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp({ withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
})

export type Todo = typeof todos.$inferSelect;
export type NewTodo = typeof todos.$inferInsert;
