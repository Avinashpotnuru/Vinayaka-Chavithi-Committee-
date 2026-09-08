import { TasksView } from "@/components/tasks/tasks-view"
import { listTasks } from "@/lib/services/tasks"

export const dynamic = "force-dynamic"

export default async function TasksPage() {
  const tasks = await listTasks()
  return <TasksView initialTasks={tasks} />
}