import { MembersView } from "@/components/members/members-view"
import { listMembers } from "@/lib/services/members"

export const dynamic = "force-dynamic"

export default async function MembersPage() {
  const members = await listMembers()
  return <MembersView initialMembers={members} />
}