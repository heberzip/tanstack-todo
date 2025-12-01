import { TodoForm } from '@/components/todos/todo-form'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeftIcon } from 'lucide-react'

export const Route = createFileRoute('/todos/new')({
  component: RouteComponent,
})

function RouteComponent() {
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
          <CardTitle>Add a new todo</CardTitle>
          <CardDescription>
            Create a new task to add to your todo list.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <TodoForm mode={'create'} />
        </CardContent>
      </Card>
    </div>
  )
}
