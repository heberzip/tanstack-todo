import { TodoForm } from '@/components/todo-form'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { getTodo } from '@/service/todos'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeftIcon } from 'lucide-react'

export const Route = createFileRoute('/todos/$id/edit')({
  component: RouteComponent,
  loader: ({ params }) => getTodo({ data: params }),
})

function RouteComponent() {
  const todo = Route.useLoaderData()

  return (
    <div className="container space-y-4">
      <Button
        variant={'ghost'}
        asChild
        size={'sm'}
        className="text-muted-foreground"
      >
        <Link to="/">
          <ArrowLeftIcon />
          Todo List
        </Link>
      </Button>

      <Card className="border-2 border-foreground/60 border-dashed">
        <CardHeader>
          <CardTitle>
            Edit todo -{'  '}
            <span className="text-muted-foreground italic">{todo.name}</span>
          </CardTitle>
          <CardDescription>
            Edit the selected todo to update the task.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <TodoForm mode={'edit'} initialTodo={todo} />
        </CardContent>
      </Card>
    </div>
  )
}
