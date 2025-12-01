import { Todo } from '@/db/schema'
import { deleteTodo, toggleTodo } from '@/service/todos'
import { Link, useRouter } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { TableCell, TableRow } from '../ui/table'
import { Checkbox } from '../ui/checkbox'
import { cn, formatter } from '@/lib/utils'
import { Button } from '../ui/button'
import { PencilIcon, Trash2Icon } from 'lucide-react'
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
import { TruncatedText } from '../ui/truncated-text'
import { useEffect, useState } from 'react'

export function TodoRow({ id, name, createdAt, isComplete }: Todo) {
  const router = useRouter()
  const [isCompleted, setIsCompleted] = useState(isComplete)

  useEffect(() => {
    setIsCompleted(isComplete)
  }, [isComplete])

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
    <TableRow
      onClick={(e) => {
        const target = e.target as HTMLElement
        if (target.closest('[data-actions]')) return

        handleToggleTodo(id, isCompleted)
      }}
    >
      {/* CHECKBOX */}
      <TableCell>
        <Checkbox
          checked={isCompleted}
          onCheckedChange={(checked: boolean) => console.log(checked)}
        />
      </TableCell>

      {/* TASK NAME */}
      <TableCell
        className={cn(
          'block font-medium text-sm mt-1',
          isCompleted && 'text-muted-foreground line-through italic',
        )}
      >
        <TruncatedText
          text={name}
          maxChars={80}
          className="block w-full truncate"
        />
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
