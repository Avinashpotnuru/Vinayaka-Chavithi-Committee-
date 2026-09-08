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
  BadgeCheck,
  HandCoins,
  IndianRupee,
  Pencil,
  Plus,
  Search,
  Trash2,
  Wallet,
} from "lucide-react"
import { useMemo, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ContributionFormDialog } from "@/components/contributions/contribution-form-dialog"
import { RecordPaymentDialog } from "@/components/contributions/record-payment-dialog"
import { formatCurrency } from "@/lib/dashboard-data"
import {
  contributionStatuses,
  formatDate,
  memberById,
  paymentModes,
  type Contribution,
  type ContributionFormValues,
  type ContributionStatus,
  type PaymentMode,
} from "@/lib/contributions-data"
import { getInitials } from "@/lib/members-data"
import { cn } from "@/lib/utils"

const statusStyles: Record<ContributionStatus, string> = {
  Completed: "bg-emerald-500/10 text-emerald-600 border-emerald-600/20 dark:text-emerald-400",
  Partial: "bg-amber-500/10 text-amber-600 border-amber-600/20 dark:text-amber-400",
  Pending: "bg-muted text-muted-foreground border-border",
  Overdue: "bg-chart-4/10 text-chart-4 border-chart-4/20",
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
  column: LegacyColumn<Contribution, TValue>
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

function CellContent<TValue>({ cell }: { cell: LegacyCell<Contribution, TValue> }) {
  const def = cell.column.columnDef.cell
  if (typeof def === "function") {
    return <>{def(cell.getContext())}</>
  }
  return <>{def}</>
}

export function ContributionsView({
  initialContributions,
}: {
  initialContributions: Contribution[]
}) {
  const [contributions, setContributions] =
    useState<Contribution[]>(initialContributions)
  const [search, setSearch] = useState("")
  const [sorting, setSorting] = useState<{ id: string; desc: boolean }[]>([])
  const [modeFilter, setModeFilter] = useState<PaymentMode | "All">("All")
  const [statusFilter, setStatusFilter] = useState<ContributionStatus | "All">(
    "All",
  )
  const [editing, setEditing] = useState<Contribution | null>(null)
  const [deleting, setDeleting] = useState<Contribution | null>(null)
  const [paying, setPaying] = useState<Contribution | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const scoped = useMemo(() => {
    const query = search.trim().toLowerCase()
    return contributions.filter((contribution) => {
      const member = memberById[contribution.memberId]
      const matchesQuery =
        query === "" ||
        member.name.toLowerCase().includes(query) ||
        contribution.status.toLowerCase().includes(query) ||
        (contribution.paymentMode ?? "").toLowerCase().includes(query)
      return (
        matchesQuery &&
        (modeFilter === "All" || contribution.paymentMode === modeFilter) &&
        (statusFilter === "All" || contribution.status === statusFilter)
      )
    })
  }, [contributions, search, modeFilter, statusFilter])

  const columnHelper = legacyCreateColumnHelper<Contribution>()
  const columns = useMemo(
    () => [
      columnHelper.accessor(
        (row) => memberById[row.memberId]?.name ?? row.memberId,
        {
          id: "memberId",
          header: ({ column }) => (
            <SortableHeader column={column} label="Member" />
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
                  {member?.name ?? "Unknown member"}
                </span>
              </div>
            )
          },
        },
      ) as LegacyColumnDef<Contribution, unknown>,
      columnHelper.accessor("expectedAmount", {
        header: ({ column }) => (
          <SortableHeader column={column} label="Expected" align="right" />
        ),
        cell: ({ getValue }) => (
          <span className="block text-right font-medium tabular-nums">
            {formatCurrency(getValue() as number)}
          </span>
        ),
      }) as LegacyColumnDef<Contribution, unknown>,
      columnHelper.accessor("paidAmount", {
        header: ({ column }) => (
          <SortableHeader column={column} label="Paid" align="right" />
        ),
        cell: ({ getValue }) => (
          <span className="block text-right font-medium tabular-nums text-emerald-600 dark:text-emerald-400">
            {formatCurrency(getValue() as number)}
          </span>
        ),
      }) as LegacyColumnDef<Contribution, unknown>,
      columnHelper.accessor(
        (row) => row.expectedAmount - row.paidAmount,
        {
          header: ({ column }) => (
            <SortableHeader column={column} label="Pending" align="right" />
          ),
          id: "pendingAmount",
          cell: ({ getValue }) => {
            const pending = getValue() as number
            return (
              <span
                className={cn(
                  "block text-right tabular-nums",
                  pending === 0
                    ? "text-muted-foreground"
                    : "font-medium text-amber-600 dark:text-amber-400",
                )}
              >
                {formatCurrency(pending)}
              </span>
            )
          },
        },
      ) as LegacyColumnDef<Contribution, unknown>,
      columnHelper.accessor((row) => row.paymentMode ?? "", {
        header: ({ column }) => (
          <SortableHeader column={column} label="Payment Mode" />
        ),
        id: "paymentMode",
        cell: ({ row }) => {
          const mode = row.original.paymentMode
          if (!mode) return <span className="text-muted-foreground">—</span>
          return (
            <span
              className={cn(
                "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                modeStyles[mode],
              )}
            >
              {mode}
            </span>
          )
        },
      }) as LegacyColumnDef<Contribution, unknown>,
      columnHelper.accessor((row) => row.paymentDate ?? "", {
        header: ({ column }) => (
          <SortableHeader column={column} label="Payment Date" />
        ),
        id: "paymentDate",
        cell: ({ getValue }) => (
          <span className="whitespace-nowrap tabular-nums">
            {formatDate(getValue() as string)}
          </span>
        ),
      }) as LegacyColumnDef<Contribution, unknown>,
      columnHelper.accessor("status", {
        header: ({ column }) => (
          <SortableHeader column={column} label="Status" />
        ),
        cell: ({ getValue }) => {
          const status = getValue() as ContributionStatus
          return (
            <Badge variant="outline" className={statusStyles[status]}>
              {status}
            </Badge>
          )
        },
      }) as LegacyColumnDef<Contribution, unknown>,
      {
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => {
          const contribution = row.original
          const pending =
            contribution.expectedAmount - contribution.paidAmount
          return (
            <div className="flex items-center justify-end gap-1">
              {pending > 0 ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1 text-primary hover:text-primary"
                  aria-label={`Record payment for ${memberById[contribution.memberId]?.name ?? "member"}`}
                  onClick={() => setPaying(contribution)}
                >
                  <HandCoins className="size-4" />
                  <span className="hidden lg:inline">Record Payment</span>
                </Button>
              ) : (
                <BadgeCheck className="size-4 text-emerald-600 dark:text-emerald-400" />
              )}
              <Button
                variant="ghost"
                size="icon"
                className="size-8 hover:text-primary"
                aria-label="Edit contribution"
                onClick={() => {
                  setEditing(contribution)
                  setFormOpen(true)
                }}
              >
                <Pencil className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 hover:text-destructive"
                aria-label="Delete contribution"
                onClick={() => setDeleting(contribution)}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          )
        },
      } as LegacyColumnDef<Contribution, unknown>,
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
  const totalExpected = contributions.reduce(
    (sum, c) => sum + c.expectedAmount,
    0,
  )
  const totalPaid = contributions.reduce((sum, c) => sum + c.paidAmount, 0)
  const outstanding = totalExpected - totalPaid
  const collectionRate =
    totalExpected > 0 ? Math.round((totalPaid / totalExpected) * 100) : 0

  async function handleSubmit(values: ContributionFormValues) {
    setError(null)
    try {
      if (editing) {
        const response = await fetch(`/api/contributions/${editing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        })
        const payload = (await response.json()) as {
          contribution?: Contribution
          error?: string
        }
        if (!response.ok || !payload.contribution) {
          setError(payload.error ?? "Failed to update contribution.")
          return
        }
        setContributions((current) =>
          current.map((contribution) =>
            contribution.id === editing.id
              ? payload.contribution!
              : contribution,
          ),
        )
      } else {
        const response = await fetch("/api/contributions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        })
        const payload = (await response.json()) as {
          contribution?: Contribution
          error?: string
        }
        if (!response.ok || !payload.contribution) {
          setError(payload.error ?? "Failed to add contribution.")
          return
        }
        setContributions((current) => [payload.contribution!, ...current])
      }
    } catch {
      setError("Something went wrong. Please try again.")
      return
    }
    setFormOpen(false)
    setEditing(null)
  }

  async function handleRecordPayment({
    amount,
    paymentMode,
    paymentDate,
  }: {
    amount: number
    paymentMode: PaymentMode
    paymentDate: string
  }) {
    if (!paying) return
    setError(null)
    try {
      const response = await fetch(`/api/contributions/${paying.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memberId: paying.memberId,
          expectedAmount: paying.expectedAmount,
          paidAmount: paying.paidAmount + amount,
          paymentMode,
          paymentDate,
        }),
      })
      const payload = (await response.json()) as {
        contribution?: Contribution
        error?: string
      }
      if (!response.ok || !payload.contribution) {
        setError(payload.error ?? "Failed to record payment.")
        return
      }
      setContributions((current) =>
        current.map((contribution) =>
          contribution.id === paying.id ? payload.contribution! : contribution,
        ),
      )
    } catch {
      setError("Something went wrong. Please try again.")
      return
    }
    setPaying(null)
  }

  async function handleDelete() {
    if (!deleting) return
    setError(null)
    try {
      const response = await fetch(`/api/contributions/${deleting.id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        setError("Failed to delete contribution.")
        return
      }
      setContributions((current) =>
        current.filter((contribution) => contribution.id !== deleting.id),
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
            Contributions
          </h1>
          <p className="text-sm text-muted-foreground">
            Track expected and received contributions from committee members.
          </p>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="size-4" />
          Add Contribution
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="flex items-center gap-4 p-5">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-chart-2/15 text-chart-2">
            <IndianRupee className="size-5" />
          </div>
          <div>
            <p className="text-2xl font-semibold leading-none">
              {formatCurrency(totalExpected)}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">Total Expected</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4 p-5">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <HandCoins className="size-5" />
          </div>
          <div>
            <p className="text-2xl font-semibold leading-none">
              {formatCurrency(totalPaid)}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">Collected</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4 p-5">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Wallet className="size-5" />
          </div>
          <div>
            <p className="text-2xl font-semibold leading-none">
              {formatCurrency(outstanding)}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">Outstanding</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4 p-5">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-chart-1/10 text-chart-1">
            <BadgeCheck className="size-5" />
          </div>
          <div className="flex-1">
            <p className="text-2xl font-semibold leading-none">
              {collectionRate}%
            </p>
            <p className="mt-1 text-sm text-muted-foreground">Collection Rate</p>
            <Progress
              value={collectionRate}
              className="mt-2 h-1.5 [&>div]:bg-chart-1"
            />
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
              placeholder="Search by member, mode or status…"
              className="pl-9"
            />
          </div>
          <Select
            value={modeFilter}
            onValueChange={(value) =>
              setModeFilter(value as PaymentMode | "All")
            }
          >
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="Payment Mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Modes</SelectItem>
              {paymentModes.map((mode) => (
                <SelectItem key={mode} value={mode}>
                  {mode}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={statusFilter}
            onValueChange={(value) =>
              setStatusFilter(value as ContributionStatus | "All")
            }
          >
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Statuses</SelectItem>
              {contributionStatuses.map((status) => (
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
                    colSpan={8}
                    className="h-40 text-center text-muted-foreground"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Search className="size-6 opacity-40" />
                      <p className="text-sm">
                        No contributions found matching your filters.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <p className="border-t px-4 py-3 text-sm text-muted-foreground">
          Showing {rows.length} of {scoped.length} contributions
        </p>
      </Card>

      <ContributionFormDialog
        key={editing?.id ?? "new"}
        open={formOpen}
        onOpenChange={setFormOpen}
        contribution={editing}
        members={Object.values(memberById)}
        onSubmit={handleSubmit}
      />

      <RecordPaymentDialog
        key={paying?.id ?? "none"}
        open={paying !== null}
        onOpenChange={(open) => {
          if (!open) setPaying(null)
        }}
        memberName={paying ? (memberById[paying.memberId]?.name ?? "") : ""}
        remainingAmount={
          paying ? paying.expectedAmount - paying.paidAmount : 0
        }
        onSubmit={handleRecordPayment}
      />

      <AlertDialog
        open={deleting !== null}
        onOpenChange={(open) => {
          if (!open) setDeleting(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete contribution?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the{" "}
              {formatCurrency(deleting?.expectedAmount ?? 0)} contribution for{" "}
              {deleting ? (memberById[deleting.memberId]?.name ?? "") : ""}.
              This action cannot be undone.
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