import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
} from '@/components/ui/empty'
import { Todo } from '@/db/schema'
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { ListTodoIcon, PencilIcon, PlusIcon, Trash2Icon } from 'lucide-react'

// SERVER FUNCTION
import { deleteTodo, getTodos, toggleTodo } from '@/service/todos'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import { useServerFn } from '@tanstack/react-start'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

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

function TodosList({ todos }: { todos: Todo[] }) {
  if (todos.length === 0) {
    return (
      <Empty className="border-2 border-dashed border-primary/60">
        <EmptyHeader>
          <EmptyMedia variant={'icon'} className="bg-primary/80">
            <ListTodoIcon className="text-primary-foreground" />
          </EmptyMedia>
        </EmptyHeader>

        <EmptyContent>
          <EmptyDescription className="text-primary/80">
            You have no todos yet. Click the "New Todo" button to add your first
          </EmptyDescription>
          <Button asChild>
            <Link to="/todos/new">
              <PlusIcon className="w-8 h-8" />
              New Todo
            </Link>
          </Button>
        </EmptyContent>
      </Empty>
    )
  }

  return (
    <Table>
      <TableHeader className="bg-primary/8 hover:bg-primary/10">
        <TableRow>
          {/* FIRST ONE EMPTY TO RENDER CHECKBOXES */}
          <TableHead></TableHead>
          <TableHead>Task (todo)</TableHead>
          <TableHead>Create Date</TableHead>
          <TableHead className="text-center w-0 px-6">Actions</TableHead>
        </TableRow>
      </TableHeader>

      {/* BODY */}
      <TableBody>
        {todos.map((todo) => (
          <TodoRow key={todo.id} {...todo} />
        ))}
      </TableBody>
    </Table>
  )
}

function TodoRow({ id, name, createdAt, isComplete }: Todo) {
  const router = useRouter()

  const deleteTodoFn = useServerFn(deleteTodo)
  const toggleTodoFn = useServerFn(toggleTodo)

  const handleDeleteTodo = async (id: string) => {
    const res = await deleteTodoFn({ data: { id } })
    router.invalidate()
    return res
  }

  const handleToggleTodo = async (id: string, isComplete: boolean) => {
    const res = await toggleTodoFn({ data: { id, isComplete: !isComplete } })
    router.invalidate()
    return res
  }

  return (
    <TableRow
      onClick={(e) => {
        const target = e.target as HTMLElement
        if (target.closest('[data-actions]')) return

        handleToggleTodo(id, isComplete)
      }}
    >
      {/* CHECKBOX */}
      <TableCell>
        <Checkbox
          checked={isComplete}
          onCheckedChange={(checked: boolean) => console.log(checked)}
        />
      </TableCell>

      {/* TASK NAME */}
      <TableCell
        className={cn(
          'font-medium',
          isComplete && 'text-muted-foreground line-through italic',
        )}
      >
        {name}
      </TableCell>

      {/* CREATE DATE */}
      <TableCell className="text-sm text-muted-foreground">
        {formatter(createdAt)}
      </TableCell>

      {/* ACTIONS */}
      <TableCell data-actions>
        <div className="flex items-center justify-end gap-2">
          <Button variant={'ghost'} size={'icon-sm'} asChild>
            <Link to={'/todos/$id/edit'} params={{ id }}>
              <PencilIcon className="w-4 h-4" />
            </Link>
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant={'destructive_ghost'} size={'icon-sm'}>
                <Trash2Icon className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  task from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleDeleteTodo(id)}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </TableCell>
    </TableRow>
  )
}

const formatter = (date: Date) => {
  const formatter = new Intl.DateTimeFormat('es-ES', {
    dateStyle: 'short',
  })

  return formatter.format(date)
}
