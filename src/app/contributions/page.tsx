import { ContributionsView } from "@/components/contributions/contributions-view"
import { listContributions } from "@/lib/services/contributions"

export const dynamic = "force-dynamic"

export default async function ContributionsPage() {
  const contributions = await listContributions()
  return <ContributionsView initialContributions={contributions} />
}