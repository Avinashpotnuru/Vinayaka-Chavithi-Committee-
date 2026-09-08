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
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  IndianRupee,
  Pencil,
  Plus,
  ReceiptText,
  Search,
  Trash2,
  Wallet,
  PiggyBank,
} from "lucide-react"
import { useMemo, useState } from "react"

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
import { ExpenseFormDialog } from "@/components/expenses/expense-form-dialog"
import { PageHeader } from "@/components/page-header"
import { StatusPill } from "@/components/status-pill"
import { SummaryCard } from "@/components/summary-card"
import { formatCurrency } from "@/lib/dashboard-data"
import { formatDate, type PaymentMode } from "@/lib/contributions-data"
import {
  expenseCategories,
  type Expense,
  type ExpenseCategory,
  type ExpenseFormValues,
} from "@/lib/expenses-data"
import { cn } from "@/lib/utils"

const categoryStyles: Record<ExpenseCategory, string> = {
  "Pooja Items": "bg-chart-1/10 text-chart-1 border-chart-1/20",
  Decorations: "bg-chart-4/10 text-chart-4 border-chart-4/20",
  Prasadam: "bg-chart-3/10 text-chart-3 border-chart-3/20",
  "Sound & Lighting": "bg-chart-2/15 text-chart-2 border-chart-2/25",
  Transport: "bg-chart-5/10 text-chart-5 border-chart-5/20",
  "Printing & Posters": "bg-rose-500/10 text-rose-600 border-rose-600/20 dark:text-rose-400",
  Cleaning: "bg-sky-500/10 text-sky-600 border-sky-600/20 dark:text-sky-400",
  Contingency: "bg-muted text-muted-foreground border-border",
}

const modeStyles: Record<PaymentMode, string> = {
  UPI: "bg-chart-1/10 text-chart-1",
  Cash: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  Card: "bg-chart-4/10 text-chart-4",
  "Bank Transfer": "bg-chart-2/15 text-chart-2",
  Cheque: "bg-chart-3/10 text-chart-3",
}

function SortableHeader<TValue>({
  column,
  label,
  align = "left",
}: {
  column: LegacyColumn<Expense, TValue>
  label: string
  align?: "left" | "right"
}) {
  const sorted = column.getIsSorted()
  const Icon = sorted === "asc" ? ArrowUp : sorted === "desc" ? ArrowDown : ArrowUpDown
  return (
    <button
      type="button"
      onClick={column.getToggleSortingHandler()}
      className={cn(
        "inline-flex items-center gap-1 hover:text-foreground",
        align === "right" && "justify-end",
      )}
      aria-label={`Sort by ${label}`}
    >
      {label}
      <Icon className="size-3.5 opacity-60" />
    </button>
  )
}

function CellContent<TValue>({ cell }: { cell: LegacyCell<Expense, TValue> }) {
  const def = cell.column.columnDef.cell
  if (typeof def === "function") {
    return <>{def(cell.getContext())}</>
  }
  return <>{def}</>
}

export function ExpensesView({ initialExpenses }: { initialExpenses: Expense[] }) {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses)
  const [search, setSearch] = useState("")
  const [sorting, setSorting] = useState<{ id: string; desc: boolean }[]>([])
  const [categoryFilter, setCategoryFilter] = useState<
    ExpenseCategory | "All"
  >("All")
  const [editing, setEditing] = useState<Expense | null>(null)
  const [deleting, setDeleting] = useState<Expense | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const scoped = useMemo(() => {
    const query = search.trim().toLowerCase()
    return expenses.filter((expense) => {
      const matchesQuery =
        query === "" ||
        expense.name.toLowerCase().includes(query) ||
        expense.category.toLowerCase().includes(query) ||
        expense.paymentMode.toLowerCase().includes(query) ||
        expense.notes.toLowerCase().includes(query)
      return matchesQuery && (categoryFilter === "All" || expense.category === categoryFilter)
    })
  }, [expenses, search, categoryFilter])

  const columnHelper = legacyCreateColumnHelper<Expense>()
  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        header: ({ column }) => (
          <SortableHeader column={column} label="Expense Name" />
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-chart-2/15 text-chart-2">
              <ReceiptText className="size-4" />
            </div>
            <div className="min-w-0">
              <p className="font-medium leading-tight">{row.original.name}</p>
              <p className="truncate text-xs text-muted-foreground md:hidden">
                {row.original.notes}
              </p>
            </div>
          </div>
        ),
      }) as LegacyColumnDef<Expense, unknown>,
      columnHelper.accessor("category", {
        header: ({ column }) => (
          <SortableHeader column={column} label="Category" />
        ),
        cell: ({ getValue }) => {
          const category = getValue() as ExpenseCategory
          return (
            <StatusPill className={categoryStyles[category]}>
              {category}
            </StatusPill>
          )
        },
      }) as LegacyColumnDef<Expense, unknown>,
      columnHelper.accessor("amount", {
        header: ({ column }) => (
          <SortableHeader column={column} label="Amount" align="right" />
        ),
        cell: ({ getValue }) => (
          <span className="block text-right font-medium tabular-nums">
            {formatCurrency(getValue() as number)}
          </span>
        ),
      }) as LegacyColumnDef<Expense, unknown>,
      columnHelper.accessor("date", {
        header: ({ column }) => <SortableHeader column={column} label="Date" />,
        cell: ({ getValue }) => (
          <span className="whitespace-nowrap tabular-nums">
            {formatDate(getValue() as string)}
          </span>
        ),
      }) as LegacyColumnDef<Expense, unknown>,
      columnHelper.accessor("paymentMode", {
        header: ({ column }) => (
          <SortableHeader column={column} label="Payment Mode" />
        ),
        cell: ({ getValue }) => {
          const mode = getValue() as PaymentMode
          return <StatusPill className={modeStyles[mode]}>{mode}</StatusPill>
        },
      }) as LegacyColumnDef<Expense, unknown>,
      columnHelper.accessor("notes", {
        header: ({ column }) => <SortableHeader column={column} label="Notes" />,
        cell: ({ getValue }) => {
          const notes = getValue() as string
          if (!notes) return <span className="text-muted-foreground">—</span>
          return (
            <span
              className="block max-w-56 truncate text-muted-foreground"
              title={notes}
            >
              {notes}
            </span>
          )
        },
      }) as LegacyColumnDef<Expense, unknown>,
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
      } as LegacyColumnDef<Expense, unknown>,
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
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0)
  const averageExpense = expenses.length > 0 ? totalSpent / expenses.length : 0
  const topCategory = useMemo(() => {
    const byCategory = new Map<ExpenseCategory, number>()
    for (const expense of expenses) {
      byCategory.set(
        expense.category,
        (byCategory.get(expense.category) ?? 0) + expense.amount,
      )
    }
    let best: { name: ExpenseCategory; total: number } | null = null
    for (const [name, total] of byCategory) {
      if (!best || total > best.total) best = { name, total }
    }
    return best
  }, [expenses])

  async function handleSubmit(values: ExpenseFormValues) {
    setError(null)
    try {
      if (editing) {
        const response = await fetch(`/api/expenses/${editing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        })
        const payload = (await response.json()) as {
          expense?: Expense
          error?: string
        }
        if (!response.ok || !payload.expense) {
          setError(payload.error ?? "Failed to update expense.")
          return
        }
        setExpenses((current) =>
          current.map((expense) =>
            expense.id === editing.id ? payload.expense! : expense,
          ),
        )
      } else {
        const response = await fetch("/api/expenses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        })
        const payload = (await response.json()) as {
          expense?: Expense
          error?: string
        }
        if (!response.ok || !payload.expense) {
          setError(payload.error ?? "Failed to add expense.")
          return
        }
        setExpenses((current) => [payload.expense!, ...current])
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
      const response = await fetch(`/api/expenses/${deleting.id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        setError("Failed to delete expense.")
        return
      }
      setExpenses((current) =>
        current.filter((expense) => expense.id !== deleting.id),
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
      <PageHeader
        title="Expenses"
        description="Track festival and committee spending against the budget."
        action={
          <Button onClick={() => setFormOpen(true)}>
            <Plus className="size-4" />
            Add Expense
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          label="Total Spent"
          value={formatCurrency(totalSpent)}
          icon={IndianRupee}
          iconClass="bg-chart-2/15 text-chart-2"
        />
        <SummaryCard
          label="Total Expenses"
          value={expenses.length.toLocaleString("en-IN")}
          icon={ReceiptText}
          iconClass="bg-chart-1/10 text-chart-1"
        />
        <SummaryCard
          label={`Top Category · ${formatCurrency(topCategory?.total ?? 0)}`}
          value={topCategory?.name ?? "—"}
          icon={PiggyBank}
          iconClass="bg-chart-3/10 text-chart-3"
        />
        <SummaryCard
          label="Average Expense"
          value={formatCurrency(averageExpense)}
          icon={Wallet}
          iconClass="bg-chart-5/10 text-chart-5"
        />
      </div>

      <Card>
        <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, category, mode or notes…"
              className="pl-9"
            />
          </div>
          <Select
            value={categoryFilter}
            onValueChange={(value) =>
              setCategoryFilter(value as ExpenseCategory | "All")
            }
          >
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Categories</SelectItem>
              {expenseCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
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
                    colSpan={7}
                    className="h-40 text-center text-muted-foreground"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Search className="size-6 opacity-40" />
                      <p className="text-sm">
                        No expenses found matching your search.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <p className="border-t px-4 py-3 text-sm text-muted-foreground">
          Showing {rows.length} of {scoped.length} expenses
        </p>
      </Card>

      <ExpenseFormDialog
        key={editing?.id ?? "new"}
        open={formOpen}
        onOpenChange={setFormOpen}
        expense={editing}
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
            <AlertDialogTitle>Delete expense?</AlertDialogTitle>
            <AlertDialogDescription>
              &ldquo;{deleting?.name}&rdquo; ({formatCurrency(deleting?.amount ?? 0)}) will
              be permanently removed. This action cannot be undone.
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