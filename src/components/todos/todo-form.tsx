import { AnyFieldApi, useForm } from '@tanstack/react-form'
import { useServerFn } from '@tanstack/react-start'
import {
  createTodo,
  updateTodo,
  todoSchema,
  type TodoFormValues,
} from '@/service/todos'
import { Todo } from '@/db/schema'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { useState } from 'react'
import { BanIcon, CirclePlusIcon, LoaderIcon } from 'lucide-react'
import { Textarea } from '../ui/textarea'

type FORM_MODE = 'create' | 'edit'

interface TodoFormProps {
  mode: FORM_MODE
  initialTodo?: Todo
}

export function TodoForm({ mode, initialTodo }: TodoFormProps) {
  const [isDisabled, setIsDisabled] = useState(mode === 'create' ? true : false)

  const createTodoFn = useServerFn(createTodo)
  const updateTodoFn = useServerFn(updateTodo)

  const defaultValues: TodoFormValues = initialTodo
    ? { name: initialTodo.name, isComplete: initialTodo.isComplete }
    : { name: '', isComplete: false }

  const form = useForm({
    defaultValues,
    validators: {
      onChange: todoSchema,
      onSubmit: todoSchema,
    },
    onSubmit: async ({ value }) => {
      if (mode === 'edit' && initialTodo) {
        await updateTodoFn({ data: { ...value, id: initialTodo.id } })
      } else {
        await createTodoFn({ data: value })
      }
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="flex gap-4 justify-between"
    >
      <form.Field name="name">
        {(field) => {
          return (
            <div className="flex flex-col gap-2 w-full">
              <Label htmlFor={field.name}>Todo</Label>
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex flex-col gap-1 w-full">
                  {/* Mobile: Textarea */}
                  <Textarea
                    id={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Enter a todo"
                    rows={3}
                    className="block md:hidden"
                  />

                  {/* Desktop: Input */}
                  <Input
                    id={field.name}
                    type="text"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Enter a todo"
                    className="hidden md:block"
                  />
                  <FieldInfo field={field} />
                </div>

                {/* ADD A CHECKBOX ITEM TO HANDLE COMPLETION IN EDIT MODE */}
                {mode === 'edit' && (
                  <form.Field name="isComplete">
                    {(field) => {
                      return (
                        <div className="inline-flex gap-2 items-center mt-2">
                          <Checkbox
                            id={field.name}
                            checked={field.state.value}
                            onCheckedChange={(checked: boolean) =>
                              field.handleChange(checked)
                            }
                          />

                          <Label
                            htmlFor={field.name}
                            className="text-muted-foreground"
                          >
                            {field.state.value ? 'Complete' : 'Incomplete'}
                          </Label>
                        </div>
                      )
                    }}
                  </form.Field>
                )}

                {/* SUBMIT BTN */}
                <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
                  {([canSubmit, isSubmitting]) => {
                    !canSubmit || field.state.value.trim() === ''
                      ? setIsDisabled(true)
                      : setIsDisabled(false)

                    return (
                      <div className="flex w-full md:w-auto justify-end">
                        <Button
                          type="submit"
                          disabled={isDisabled}
                          className="group"
                        >
                          {isSubmitting ? (
                            <div className="flex gap-2 items-center">
                              <LoaderIcon className="animate-spin duration-800" />{' '}
                              {mode === 'create' ? 'Creating…' : 'Updating…'}
                            </div>
                          ) : isDisabled ? (
                            <div className="flex gap-2 items-center">
                              <BanIcon />{' '}
                              {mode === 'create' ? 'Create todo' : 'Edit todo'}
                            </div>
                          ) : (
                            <div className="flex gap-2 items-center">
                              <CirclePlusIcon className="group-hover:animate-pulse" />{' '}
                              {mode === 'create' ? 'Create todo' : 'Edit todo'}
                            </div>
                          )}
                        </Button>
                      </div>
                    )
                  }}
                </form.Subscribe>
              </div>
            </div>
          )
        }}
      </form.Field>
    </form>
  )
}

function FieldInfo({ field }: { field: AnyFieldApi }) {
  const { meta } = field.state

  const errorMessage = meta.errors
    ?.map((err: Record<string, undefined>) =>
      typeof err === 'string' ? err : (err.message ?? String(err)),
    )
    .join(', ')

  return (
    <>
      {meta.isTouched && !meta.isValid && errorMessage && (
        <em className="text-destructive-foreground text-xs ml-2">
          {errorMessage}
        </em>
      )}
      {meta.isValidating ? 'Validating...' : null}
    </>
  )
}
