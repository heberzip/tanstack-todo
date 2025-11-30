import { db } from '@/db'
import { Todo, todos } from '@/db/schema'
import { createServerFn } from '@tanstack/react-start'
import { notFound, redirect } from '@tanstack/react-router'
import z from 'zod'
import { eq } from 'drizzle-orm'

// Zod validation schema
export const todoSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  isComplete: z.boolean().optional(),
})
export type TodoFormValues = z.infer<typeof todoSchema>

// CREATE SCHEMA
export const createTodoSchema = todoSchema.omit({ isComplete: true })
export type CreateTodoValues = z.infer<typeof createTodoSchema>

// UPDATE SCHEMA
export const updateTodoSchema = todoSchema.extend({
  id: z.string(),
})
export type UpdateTodoValues = z.infer<typeof updateTodoSchema>

/**
 * Server Functions
 *
 * @methods GET, POST, PUT
 */
// GET FUNCTION
export const getTodos = createServerFn({
  method: 'GET',
}).handler(async () => {
  const rows = await db.query.todos.findMany({
    orderBy: (t, { asc }) => [asc(t.isComplete), asc(t.createdAt)],
  })

  return rows as Todo[]
})

// GET ONE TODO FUNCTION
export const getTodo = createServerFn({
  method: 'GET',
})
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const todo = await db.query.todos.findFirst({
      where: eq(todos.id, data.id),
    })

    if (!todo) throw notFound()

    return todo as Todo
  })

// POST FUNCTION
export const createTodo = createServerFn({
  method: 'POST',
})
  .inputValidator(createTodoSchema)
  .handler(async ({ data }) => {
    await db.insert(todos).values({
      ...data,
      isComplete: false,
    })

    throw redirect({
      to: '/',
    })
  })

// PUT FUNCTION
export const updateTodo = createServerFn({
  method: 'POST',
})
  .inputValidator(updateTodoSchema)
  .handler(async ({ data }) => {
    const { id, ...rest } = data
    await db.update(todos).set(rest).where(eq(todos.id, id))

    throw redirect({
      to: '/',
    })
  })

// DELETE FUNCTION
export const deleteTodo = createServerFn({
  method: 'POST',
})
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    await db.delete(todos).where(eq(todos.id, data.id))
  })

// TOGGLE FUNCTION
export const toggleTodo = createServerFn({
  method: 'POST',
})
  .inputValidator((data: { id: string; isComplete: boolean }) => data)
  .handler(async ({ data }) => {
    await db
      .update(todos)
      .set({ isComplete: data.isComplete })
      .where(eq(todos.id, data.id))
  })
