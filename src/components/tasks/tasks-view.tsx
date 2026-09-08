"use client"

import {
  getCoreRowModel,
  getSortedRowModel,
  legacyCreateColumnHelper,
  useLegacyTable,
  type LegacyCell,
  type LegacyColumn,
  type LegacyColumnDef,
} from "@tanstack/react-table/legacy"
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  CheckCircle2,
  Clock,
  ListTodo,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react"
import { useMemo, useState } from "react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { TaskFormDialog } from "@/components/tasks/task-form-dialog"
import { memberById } from "@/lib/contributions-data"
import { getInitials, mockMembers } from "@/lib/members-data"
import {
  formatDate,
  isPastDue,
  taskStatuses,
  type Task,
  type TaskFormValues,
  type TaskStatus,
} from "@/lib/tasks-data"
import { cn } from "@/lib/utils"

const statusDot: Record<TaskStatus, string> = {
  "To Do": "bg-muted-foreground",
  "In Progress": "bg-chart-2",
  Done: "bg-emerald-500",
  Overdue: "bg-chart-4",
}

const statusStyles: Record<TaskStatus, string> = {
  "To Do": "bg-muted text-muted-foreground border-border",
  "In Progress": "bg-chart-2/15 text-chart-2 border-chart-2/25",
  Done: "bg-emerald-500/10 text-emerald-600 border-emerald-600/20 dark:text-emerald-400",
  Overdue: "bg-chart-4/10 text-chart-4 border-chart-4/20",
}

const nameChip: Record<TaskStatus, string> = {
  "To Do": "bg-muted-foreground/10 text-muted-foreground",
  "In Progress": "bg-chart-2/15 text-chart-2",
  Done: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  Overdue: "bg-chart-4/10 text-chart-4",
}

function SortableHeader<TValue>({
  column,
  label,
}: {
  column: LegacyColumn<Task, TValue>
  label: string
}) {
  const sorted = column.getIsSorted()
  const Icon = sorted === "asc" ? ArrowUp : sorted === "desc" ? ArrowDown : ArrowUpDown
  return (
    <button
      type="button"
      onClick={column.getToggleSortingHandler()}
      className="inline-flex items-center gap-1 hover:text-foreground"
      aria-label={`Sort by ${label}`}
    >
      {label}
      <Icon className="size-3.5 opacity-60" />
    </button>
  )
}

function CellContent<TValue>({ cell }: { cell: LegacyCell<Task, TValue> }) {
  const def = cell.column.columnDef.cell
  if (typeof def === "function") {
    return <>{def(cell.getContext())}</>
  }
  return <>{def}</>
}

export function TasksView({ initialTasks }: { initialTasks: Task[] }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [search, setSearch] = useState("")
  const [sorting, setSorting] = useState<{ id: string; desc: boolean }[]>([])
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "All">("All")
  const [memberFilter, setMemberFilter] = useState<string>("All")
  const [editing, setEditing] = useState<Task | null>(null)
  const [deleting, setDeleting] = useState<Task | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const scoped = useMemo(() => {
    const query = search.trim().toLowerCase()
    return tasks.filter((task) => {
      const matchesQuery =
        query === "" || task.name.toLowerCase().includes(query)
      return (
        matchesQuery &&
        (statusFilter === "All" || task.status === statusFilter) &&
        (memberFilter === "All" || task.memberId === memberFilter)
      )
    })
  }, [tasks, search, statusFilter, memberFilter])

  const columnHelper = legacyCreateColumnHelper<Task>()
  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        header: ({ column }) => (
          <SortableHeader column={column} label="Task Name" />
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-lg",
                nameChip[row.original.status],
              )}
            >
              <ListTodo
                className={cn(
                  "size-4",
                  row.original.status === "Done" && "opacity-70",
                )}
              />
            </div>
            <div>
              <p
                className={cn(
                  "font-medium leading-tight",
                  row.original.status === "Done" &&
                    "text-muted-foreground line-through",
                )}
              >
                {row.original.name}
              </p>
            </div>
          </div>
        ),
      }) as LegacyColumnDef<Task, unknown>,
      columnHelper.accessor(
        (row) => memberById[row.memberId]?.name ?? row.memberId,
        {
          id: "memberId",
          header: ({ column }) => (
            <SortableHeader column={column} label="Assigned Member" />
          ),
          cell: ({ row }) => {
            const member = memberById[row.original.memberId]
            return (
              <div className="flex items-center gap-3">
                <Avatar className="size-8">
                  <AvatarFallback
                    className={`${member?.avatarColor ?? "bg-chart-1"} text-white text-xs font-semibold`}
                  >
                    {getInitials(member?.name ?? "?")}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium leading-tight">
                  {member?.name ?? "Unassigned"}
                </span>
              </div>
            )
          },
        },
      ) as LegacyColumnDef<Task, unknown>,
      columnHelper.accessor("dueDate", {
        header: ({ column }) => (
          <SortableHeader column={column} label="Due Date" />
        ),
        cell: ({ row }) => {
          const task = row.original
          const overdue = isPastDue(task)
          return (
            <span
              className={cn(
                "inline-flex items-center gap-1.5 whitespace-nowrap tabular-nums",
                overdue && "font-medium text-chart-4",
              )}
            >
              {overdue && <span className="size-1.5 rounded-full bg-chart-4" />}
              {formatDate(task.dueDate)}
            </span>
          )
        },
      }) as LegacyColumnDef<Task, unknown>,
      columnHelper.accessor("status", {
        header: ({ column }) => (
          <SortableHeader column={column} label="Status" />
        ),
        cell: ({ getValue }) => {
          const status = getValue() as TaskStatus
          return (
            <Badge variant="outline" className={statusStyles[status]}>
              <span
                className={cn("size-1.5 rounded-full", statusDot[status])}
              />
              {status}
            </Badge>
          )
        },
      }) as LegacyColumnDef<Task, unknown>,
      {
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="size-8 hover:text-primary"
              aria-label={`Edit ${row.original.name}`}
              onClick={() => {
                setEditing(row.original)
                setFormOpen(true)
              }}
            >
              <Pencil className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 hover:text-destructive"
              aria-label={`Delete ${row.original.name}`}
              onClick={() => setDeleting(row.original)}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        ),
      } as LegacyColumnDef<Task, unknown>,
    ],
    [columnHelper],
  )

  const table = useLegacyTable({
    data: scoped,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  const rows = table.getRowModel().rows
  const doneCount = tasks.filter((t) => t.status === "Done").length
  const inProgressCount = tasks.filter((t) => t.status === "In Progress").length
  const overdueCount = tasks.filter((t) => t.status === "Overdue").length

  async function handleSubmit(values: TaskFormValues) {
    setError(null)
    try {
      if (editing) {
        const response = await fetch(`/api/tasks/${editing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        })
        const payload = (await response.json()) as {
          task?: Task
          error?: string
        }
        if (!response.ok || !payload.task) {
          setError(payload.error ?? "Failed to update task.")
          return
        }
        setTasks((current) =>
          current.map((task) =>
            task.id === editing.id ? payload.task! : task,
          ),
        )
      } else {
        const response = await fetch("/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        })
        const payload = (await response.json()) as {
          task?: Task
          error?: string
        }
        if (!response.ok || !payload.task) {
          setError(payload.error ?? "Failed to add task.")
          return
        }
        setTasks((current) => [payload.task!, ...current])
      }
    } catch {
      setError("Something went wrong. Please try again.")
      return
    }
    setFormOpen(false)
    setEditing(null)
  }

  async function handleDelete() {
    if (!deleting) return
    setError(null)
    try {
      const response = await fetch(`/api/tasks/${deleting.id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        setError("Failed to delete task.")
        return
      }
      setTasks((current) =>
        current.filter((task) => task.id !== deleting.id),
      )
    } catch {
      setError("Something went wrong. Please try again.")
      return
    }
    setDeleting(null)
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-8">
      {error ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Tasks
          </h1>
          <p className="text-sm text-muted-foreground">
            Plan and track festival preparation tasks across the committee.
          </p>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="size-4" />
          Add Task
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="flex items-center gap-4 p-5">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-chart-1/10 text-chart-1">
            <ListTodo className="size-5" />
          </div>
          <div>
            <p className="text-2xl font-semibold leading-none">{tasks.length}</p>
            <p className="mt-1 text-sm text-muted-foreground">Total Tasks</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4 p-5">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="size-5" />
          </div>
          <div>
            <p className="text-2xl font-semibold leading-none">{doneCount}</p>
            <p className="mt-1 text-sm text-muted-foreground">Completed</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4 p-5">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-chart-2/15 text-chart-2">
            <Clock className="size-5" />
          </div>
          <div>
            <p className="text-2xl font-semibold leading-none">
              {inProgressCount}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">In Progress</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4 p-5">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-chart-4/10 text-chart-4">
            <AlertTriangle className="size-5" />
          </div>
          <div>
            <p className="text-2xl font-semibold leading-none">{overdueCount}</p>
            <p className="mt-1 text-sm text-muted-foreground">Overdue</p>
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by task name…"
              className="pl-9"
            />
          </div>
          <Select
            value={memberFilter}
            onValueChange={setMemberFilter}
          >
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Assigned Member" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Members</SelectItem>
              {mockMembers.map((member) => (
                <SelectItem key={member.id} value={member.id}>
                  {member.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={statusFilter}
            onValueChange={(value) =>
              setStatusFilter(value as TaskStatus | "All")
            }
          >
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Statuses</SelectItem>
              {taskStatuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {typeof header.column.columnDef.header === "function"
                        ? header.column.columnDef.header(header.getContext())
                        : header.column.columnDef.header}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {rows.length > 0 ? (
                rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        <CellContent cell={cell} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-40 text-center text-muted-foreground"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Search className="size-6 opacity-40" />
                      <p className="text-sm">
                        No tasks found matching your filters.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <p className="border-t px-4 py-3 text-sm text-muted-foreground">
          Showing {rows.length} of {scoped.length} tasks
        </p>
      </Card>

      <TaskFormDialog
        key={editing?.id ?? "new"}
        open={formOpen}
        onOpenChange={setFormOpen}
        task={editing}
        members={mockMembers}
        onSubmit={handleSubmit}
      />

      <AlertDialog
        open={deleting !== null}
        onOpenChange={(open) => {
          if (!open) setDeleting(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete task?</AlertDialogTitle>
            <AlertDialogDescription>
              &ldquo;{deleting?.name}&rdquo; will be permanently removed. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={handleDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}