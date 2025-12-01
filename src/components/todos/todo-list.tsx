import { Todo } from "@/db/schema"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia } from "../ui/empty"
import { ListTodoIcon, PlusIcon } from "lucide-react"
import { Button } from "../ui/button"
import { Link } from "@tanstack/react-router"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "../ui/table"
import { TodoRow } from "./todo-row"
import { TodoCard } from "./todo-card"

export function TodosList({ todos }: { todos: Todo[] }) {
  if (todos.length === 0) {
    return (
      <Empty className="border-2 border-dashed border-foreground/60">
        <EmptyHeader>
          <EmptyMedia variant={'icon'} className="bg-primary/80">
            <ListTodoIcon className="text-primary-foreground" />
          </EmptyMedia>
        </EmptyHeader>

        <EmptyContent>
          <EmptyDescription className="text-muted-foreground/80">
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
   <>
      {/* DESKTOP: table */}
      <div className="hidden md:block">
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

          <TableBody>
            {todos.map((todo) => (
              <TodoRow key={todo.id} {...todo} />
            ))}
          </TableBody>
        </Table>
      </div>

      {/* MOBILE: cards */}
      <div className="space-y-3 md:hidden">
        {todos.map((todo) => (
          <TodoCard key={todo.id} {...todo} />
        ))}
      </div>
    </>
  )
}
