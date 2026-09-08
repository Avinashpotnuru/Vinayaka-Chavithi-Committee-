import { ExpensesView } from "@/components/expenses/expenses-view"
import { listExpenses } from "@/lib/services/expenses"

export const dynamic = "force-dynamic"

export default async function ExpensesPage() {
  const expenses = await listExpenses()
  return <ExpensesView initialExpenses={expenses} />
}