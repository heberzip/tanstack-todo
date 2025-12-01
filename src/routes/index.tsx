import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Todo } from '@/db/schema'
import { createFileRoute, Link } from '@tanstack/react-router'
import { PlusIcon } from 'lucide-react'

// SERVER FUNCTION
import { getTodos } from '@/service/todos'
import { TodosList } from '@/components/todos/todo-list'

// Runs in client and server
export const Route = createFileRoute('/')({
  component: App,
  loader: () => getTodos(),
})

function App() {
  // INITIAL DATA FETCH
  const todos = Route.useLoaderData()

  // STATE MANAGEMENT AND COMPUTED VALUES
  const todosTotalCount = todos.length
  const todosCompletedCount = todos.filter((t: Todo) => t.isComplete).length

  // HTML RENDERING
  return (
    <div className="min-h-screen container space-y-8">
      {/* HEADER */}
      <div className="flex justify-between items-center gap-4">
        {/* TITLE AND COUNTER */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">TanStack Todo App</h1>
          {todosTotalCount > 0 && (
            <Badge variant="outline" className="py-1 px-2.5">
              {todosCompletedCount} / {todosTotalCount} completed
            </Badge>
          )}
        </div>
        {/* NEW TODO BUTTON */}
        <div>
          <Button variant={'outline'} size={'sm'} asChild>
            <Link to="/todos/new" className="flex gap-2 items-center">
              <PlusIcon className="w-8 h-8" />
              New Todo
            </Link>
          </Button>
        </div>
      </div>

      {/* TODOS LIST */}
      <TodosList todos={todos} />
    </div>
  )
}



