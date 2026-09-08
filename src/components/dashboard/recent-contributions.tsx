import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  type Contribution,
  formatCurrency,
} from "@/lib/dashboard-data"
import { cn } from "@/lib/utils"

const typeBadge: Record<string, string> = {
  "Family Contribution": "bg-chart-1/10 text-chart-1",
  Sponsorship: "bg-chart-2/15 text-chart-2",
  "Hundi / Donation": "bg-chart-4/10 text-chart-4",
  Prasadam: "bg-chart-3/10 text-chart-3",
}

export function RecentContributions({
  rows,
}: {
  rows: Contribution[]
}) {
  const typeClass = (type: string) =>
    typeBadge[type] ??
    "bg-muted/60 text-muted-foreground"
  return (
    <Card className="col-span-2">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>Recent Contributions</CardTitle>
        <Link
          href="/contributions"
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          View all
          <ArrowRight className="size-3.5" />
        </Link>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead className="hidden sm:table-cell">Type</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="hidden text-right sm:table-cell">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                  No contributions recorded yet
                </TableCell>
              </TableRow>
            ) : null}
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <Avatar className="size-8">
                      <AvatarFallback
                        className={cn("text-[11px] text-white", row.avatarColor)}
                      >
                        {row.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="leading-tight">
                      <p className="font-medium">{row.member}</p>
                      <p className="text-xs text-muted-foreground sm:hidden">
                        {row.type} &middot; {row.date}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Badge variant="outline" className={cn("border-transparent", typeClass(row.type))}>
                    {row.type}
                  </Badge>
                </TableCell>
                <TableCell className="hidden text-muted-foreground md:table-cell">
                  {row.date}
                </TableCell>
                <TableCell className="text-right font-medium tabular-nums">
                  {formatCurrency(row.amount)}
                </TableCell>
                <TableCell className="hidden text-right sm:table-cell">
                  <Badge
                    variant="outline"
                    className={cn(
                      "border-transparent",
                      row.status === "Paid"
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                    )}
                  >
                    {row.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}