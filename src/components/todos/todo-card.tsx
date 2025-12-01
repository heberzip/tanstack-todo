import { Todo } from '@/db/schema'
import { deleteTodo, toggleTodo } from '@/service/todos'
import { useRouter } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { Checkbox } from '../ui/checkbox'
import { cn, formatter } from '@/lib/utils'
import { Button } from '../ui/button'
import { PencilIcon, Trash2Icon } from 'lucide-react'
import { Link } from '@tanstack/react-router'
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
} from '../ui/alert-dialog'
import { Label } from '../ui/label'
import { TruncatedText } from '../ui/truncated-text'
import { useState } from 'react'

export function TodoCard({ id, name, createdAt, isComplete }: Todo) {
  const router = useRouter()
  const [isCompleted, setIsCompleted] = useState(isComplete)

  const deleteTodoFn = useServerFn(deleteTodo)
  const toggleTodoFn = useServerFn(toggleTodo)

  const handleDeleteTodo = async (id: string) => {
    const res = await deleteTodoFn({ data: { id } })
    router.invalidate()
    return res
  }

  const handleToggleTodo = async (id: string, isCompleted: boolean) => {
    const next = !isCompleted
    setIsCompleted(next)
    const res = await toggleTodoFn({ data: { id, isComplete: next } })
    router.invalidate()
    return res
  }

  return (
    <div className="flex items-start gap-3 rounded-lg border bg-card text-card-foreground p-4">
      {/* Left column: checkbox */}
      <Button
        className="mt-1 w-fit h-fit shrink-0"
        onClick={() => handleToggleTodo(id, isCompleted)}
        variant="ghost"
        size="icon-sm"
      >
        <Checkbox id={'todo-checkbox-' + id} checked={isCompleted} />
      </Button>

      {/* Right column: content */}
      <div className="flex-1 min-w-0 space-y-1">
        <Label
          htmlFor={'todo-checkbox-' + id}
          className={cn(
            'block font-medium text-sm', 
            isCompleted && 'text-muted-foreground line-through italic',
          )}
        >
          <TruncatedText
            text={name}
            maxChars={40}
            className="block w-full truncate" 
          />
        </Label>
        <div className="text-xs text-muted-foreground">
          Created: {formatter(createdAt)}
        </div>
      </div>

      {/* Right column: actions */}
      <div className="flex items-end gap-1 shrink-0" data-actions>
        <Button variant="ghost" size="icon-sm" asChild>
          <Link to="/todos/$id/edit" params={{ id }}>
            <PencilIcon className="w-4 h-4" />
          </Link>
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive_ghost" size="icon-sm">
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
    </div>
  )
}
