import { ObjectId, type Db, type Document, type WithId } from "mongodb"

import { withDatabase } from "@/lib/mongodb"
import {
  avatarColors,
  mockMembers,
  type Member,
  type MemberFormValues,
} from "@/lib/members-data"

const COLLECTION = "members"

function toMember(doc: WithId<Document>): Member {
  return {
    id: doc._id.toString(),
    name: doc.name as string,
    mobile: doc.mobile as string,
    houseNumber: doc.houseNumber as string,
    role: doc.role as Member["role"],
    status: doc.status as Member["status"],
    avatarColor: doc.avatarColor as string,
  }
}

function seedDoc(member: (typeof mockMembers)[number]) {
  return {
    name: member.name,
    mobile: member.mobile,
    houseNumber: member.houseNumber,
    role: member.role,
    status: member.status,
    avatarColor: member.avatarColor,
  }
}

async function seedIfEmpty(db: Db) {
  const count = await db.collection(COLLECTION).countDocuments()
  if (count > 0) return
  await db.collection(COLLECTION).insertMany(mockMembers.map(seedDoc))
}

export async function listMembers(): Promise<Member[]> {
  return withDatabase(async (db) => {
    await seedIfEmpty(db)
    const docs = await db
      .collection(COLLECTION)
      .find()
      .sort({ name: 1 })
      .toArray()
    return docs.map(toMember)
  })
}

export async function createMember(
  values: MemberFormValues,
): Promise<Member> {
  return withDatabase(async (db) => {
    const avatarColor =
      avatarColors[Math.floor(Math.random() * avatarColors.length)]
    const result = await db.collection(COLLECTION).insertOne({
      ...values,
      avatarColor,
    })
    return {
      id: result.insertedId.toString(),
      ...values,
      avatarColor,
    }
  })
}

export async function updateMember(
  id: string,
  values: MemberFormValues,
): Promise<Member | null> {
  return withDatabase(async (db) => {
    const doc = await db.collection(COLLECTION).findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: values },
      { returnDocument: "after" },
    )
    return doc ? toMember(doc) : null
  })
}

export async function deleteMember(id: string): Promise<boolean> {
  return withDatabase(async (db) => {
    const result = await db
      .collection(COLLECTION)
      .deleteOne({ _id: new ObjectId(id) })
    return result.deletedCount > 0
  })
}