"use client"

import {
  getCoreRowModel,
  getFilteredRowModel,
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
  Pencil,
  Plus,
  Search,
  Trash2,
  UserCheck,
  UserPlus,
  Users,
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
import { MemberFormDialog } from "@/components/members/member-form-dialog"
import {
  formatMobile,
  getInitials,
  memberRoles,
  memberStatuses,
  type Member,
  type MemberFormValues,
  type MemberRole,
  type MemberStatus,
} from "@/lib/members-data"

const roleStyles: Record<MemberRole, string> = {
  President: "bg-chart-4/10 text-chart-4 border-chart-4/20",
  Secretary: "bg-chart-2/15 text-chart-2 border-chart-2/25",
  Treasurer: "bg-chart-1/10 text-chart-1 border-chart-1/20",
  Member: "bg-chart-5/10 text-chart-5 border-chart-5/20",
  Volunteer: "bg-chart-3/10 text-chart-3 border-chart-3/20",
}

const statusStyles: Record<MemberStatus, string> = {
  Active: "bg-emerald-500/10 text-emerald-600 border-emerald-600/20 dark:text-emerald-400",
  Pending: "bg-amber-500/10 text-amber-600 border-amber-600/20 dark:text-amber-400",
  Inactive: "bg-muted text-muted-foreground border-border",
}

function SortableHeader<TValue>({
  column,
  label,
}: {
  column: LegacyColumn<Member, TValue>
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

function CellContent<TValue>({ cell }: { cell: LegacyCell<Member, TValue> }) {
  const def = cell.column.columnDef.cell
  if (typeof def === "function") {
    return <>{def(cell.getContext())}</>
  }
  return <>{def}</>
}

export function MembersView({ initialMembers }: { initialMembers: Member[] }) {
  const [members, setMembers] = useState<Member[]>(initialMembers)
  const [search, setSearch] = useState("")
  const [sorting, setSorting] = useState<{ id: string; desc: boolean }[]>([
    { id: "name", desc: false },
  ])
  const [roleFilter, setRoleFilter] = useState<MemberRole | "All">("All")
  const [statusFilter, setStatusFilter] = useState<MemberStatus | "All">("All")
  const [editing, setEditing] = useState<Member | null>(null)
  const [deleting, setDeleting] = useState<Member | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const scoped = useMemo(
    () =>
      members.filter(
        (member) =>
          (roleFilter === "All" || member.role === roleFilter) &&
          (statusFilter === "All" || member.status === statusFilter),
      ),
    [members, roleFilter, statusFilter],
  )

  const columnHelper = legacyCreateColumnHelper<Member>()
  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        header: ({ column }) => <SortableHeader column={column} label="Name" />,
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <Avatar className="size-9">
              <AvatarFallback
                className={`${row.original.avatarColor} text-white text-xs font-semibold`}
              >
                {getInitials(row.original.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium leading-tight">{row.original.name}</p>
              <p className="text-xs text-muted-foreground md:hidden">
                {formatMobile(row.original.mobile)}
              </p>
            </div>
          </div>
        ),
      }) as LegacyColumnDef<Member, unknown>,
      columnHelper.accessor("mobile", {
        header: ({ column }) => (
          <SortableHeader column={column} label="Mobile Number" />
        ),
        cell: ({ getValue }) => {
          const mobile = getValue() as string
          return (
            <span className="font-medium tabular-nums whitespace-nowrap">
              {formatMobile(mobile)}
            </span>
          )
        },
      }) as LegacyColumnDef<Member, unknown>,
      columnHelper.accessor("houseNumber", {
        header: ({ column }) => (
          <SortableHeader column={column} label="House Number" />
        ),
        cell: ({ getValue }) => getValue() as string,
      }) as LegacyColumnDef<Member, unknown>,
      columnHelper.accessor("role", {
        header: ({ column }) => <SortableHeader column={column} label="Role" />,
        cell: ({ getValue }) => {
          const role = getValue() as MemberRole
          return (
            <Badge variant="outline" className={roleStyles[role]}>
              {role}
            </Badge>
          )
        },
      }) as LegacyColumnDef<Member, unknown>,
      columnHelper.accessor("status", {
        header: ({ column }) => (
          <SortableHeader column={column} label="Status" />
        ),
        cell: ({ getValue }) => {
          const status = getValue() as MemberStatus
          return (
            <Badge variant="outline" className={statusStyles[status]}>
              {status}
            </Badge>
          )
        },
      }) as LegacyColumnDef<Member, unknown>,
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
                setDialogOpen(true)
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
      } as LegacyColumnDef<Member, unknown>,
    ],
    [columnHelper],
  )

  const table = useLegacyTable({
    data: scoped,
    columns,
    state: {
      sorting,
      globalFilter: search,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setSearch,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  const rows = table.getRowModel().rows
  const activeCount = members.filter((m) => m.status === "Active").length
  const pendingCount = members.filter((m) => m.status === "Pending").length

  async function handleSubmit(values: MemberFormValues) {
    setError(null)
    try {
      if (editing) {
        const response = await fetch(`/api/members/${editing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        })
        const payload = (await response.json()) as { member?: Member; error?: string }
        if (!response.ok || !payload.member) {
          setError(payload.error ?? "Failed to update member.")
          return
        }
        setMembers((current) =>
          current.map((member) =>
            member.id === editing.id ? payload.member! : member,
          ),
        )
      } else {
        const response = await fetch("/api/members", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        })
        const payload = (await response.json()) as { member?: Member; error?: string }
        if (!response.ok || !payload.member) {
          setError(payload.error ?? "Failed to add member.")
          return
        }
        setMembers((current) => [payload.member!, ...current])
      }
    } catch {
      setError("Something went wrong. Please try again.")
      return
    }
    setDialogOpen(false)
    setEditing(null)
  }

  async function handleDelete() {
    if (!deleting) return
    setError(null)
    try {
      const response = await fetch(`/api/members/${deleting.id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        setError("Failed to delete member.")
        return
      }
      setMembers((current) =>
        current.filter((member) => member.id !== deleting.id),
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
            Members
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage household members, office bearers and volunteers of the
            committee.
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="size-4" />
          Add Member
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="flex items-center gap-4 p-5">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-chart-1/10 text-chart-1">
            <Users className="size-5" />
          </div>
          <div>
            <p className="text-2xl font-semibold leading-none">{members.length}</p>
            <p className="mt-1 text-sm text-muted-foreground">Total Members</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4 p-5">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <UserCheck className="size-5" />
          </div>
          <div>
            <p className="text-2xl font-semibold leading-none">{activeCount}</p>
            <p className="mt-1 text-sm text-muted-foreground">Active Members</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4 p-5">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <UserPlus className="size-5" />
          </div>
          <div>
            <p className="text-2xl font-semibold leading-none">{pendingCount}</p>
            <p className="mt-1 text-sm text-muted-foreground">Pending Approval</p>
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => table.setGlobalFilter(e.target.value)}
              placeholder="Search by name, mobile or house number…"
              className="pl-9"
            />
          </div>
          <Select
            value={roleFilter}
            onValueChange={(value) => setRoleFilter(value as MemberRole | "All")}
          >
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Roles</SelectItem>
              {memberRoles.map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={statusFilter}
            onValueChange={(value) =>
              setStatusFilter(value as MemberStatus | "All")
            }
          >
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Statuses</SelectItem>
              {memberStatuses.map((status) => (
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
                    colSpan={6}
                    className="h-40 text-center text-muted-foreground"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Search className="size-6 opacity-40" />
                      <p className="text-sm">
                        No members found matching your search.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <p className="border-t px-4 py-3 text-sm text-muted-foreground">
          Showing {rows.length} of {scoped.length} members
        </p>
      </Card>

      <MemberFormDialog
        key={editing?.id ?? "new"}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        member={editing}
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
            <AlertDialogTitle>Delete member?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleting?.name} will be permanently removed from the committee
              directory. This action cannot be undone.
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