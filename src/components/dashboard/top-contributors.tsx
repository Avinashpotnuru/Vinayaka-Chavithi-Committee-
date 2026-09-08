import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  type TopContributor,
  formatCurrency,
} from "@/lib/dashboard-data"
import { cn } from "@/lib/utils"

export function TopContributors({
  rows,
}: {
  rows: TopContributor[]
}) {
  const maxAmount = rows[0]?.amount ?? 0

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>Top Contributors</CardTitle>
        <Link
          href="/members"
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          View all
          <ArrowRight className="size-3.5" />
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        {rows.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No contributions yet
          </p>
        ) : null}
        {rows.map((person) => (
          <div key={person.rank} className="flex items-center gap-3">
            <span className="w-4 text-sm font-semibold text-muted-foreground tabular-nums">
              {person.rank}
            </span>
            <Avatar className="size-9">
              <AvatarFallback
                className={cn("text-xs text-white", person.avatarColor)}
              >
                {person.initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <p className="truncate text-sm font-medium">{person.name}</p>
                <p className="text-sm font-semibold tabular-nums">
                  {formatCurrency(person.amount)}
                </p>
              </div>
              <Progress
                value={(person.amount / maxAmount) * 100}
                className="mt-1.5 h-1.5"
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}