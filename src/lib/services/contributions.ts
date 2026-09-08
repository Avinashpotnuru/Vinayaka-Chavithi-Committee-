import { ObjectId, type Db, type Document, type WithId } from "mongodb"

import { withDatabase } from "@/lib/mongodb"
import {
  deriveContributionStatus,
  mockContributions,
  type Contribution,
  type ContributionFormValues,
} from "@/lib/contributions-data"

const COLLECTION = "contributions"

function toContribution(doc: WithId<Document>): Contribution {
  return {
    id: doc._id.toString(),
    memberId: doc.memberId as string,
    expectedAmount: doc.expectedAmount as number,
    paidAmount: doc.paidAmount as number,
    paymentMode: doc.paymentMode as Contribution["paymentMode"],
    paymentDate: doc.paymentDate as Contribution["paymentDate"],
    status: doc.status as Contribution["status"],
  }
}

function seedDoc(contribution: (typeof mockContributions)[number]) {
  return {
    memberId: contribution.memberId,
    expectedAmount: contribution.expectedAmount,
    paidAmount: contribution.paidAmount,
    paymentMode: contribution.paymentMode,
    paymentDate: contribution.paymentDate,
    status: contribution.status,
  }
}

async function seedIfEmpty(db: Db) {
  const count = await db.collection(COLLECTION).countDocuments()
  if (count > 0) return
  await db.collection(COLLECTION).insertMany(mockContributions.map(seedDoc))
}

function deriveStatus(values: ContributionFormValues): Contribution["status"] {
  return deriveContributionStatus(values.expectedAmount, values.paidAmount)
}

export async function listContributions(): Promise<Contribution[]> {
  return withDatabase(async (db) => {
    await seedIfEmpty(db)
    const docs = await db.collection(COLLECTION).find().toArray()
    return docs.map(toContribution)
  })
}

export async function createContribution(
  values: ContributionFormValues,
): Promise<Contribution> {
  return withDatabase(async (db) => {
    const result = await db.collection(COLLECTION).insertOne({
      ...values,
      status: deriveStatus(values),
    })
    return {
      id: result.insertedId.toString(),
      ...values,
      status: deriveStatus(values),
    }
  })
}

export async function updateContribution(
  id: string,
  values: ContributionFormValues,
): Promise<Contribution | null> {
  return withDatabase(async (db) => {
    const doc = await db.collection(COLLECTION).findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...values, status: deriveStatus(values) } },
      { returnDocument: "after" },
    )
    return doc ? toContribution(doc) : null
  })
}

export async function deleteContribution(id: string): Promise<boolean> {
  return withDatabase(async (db) => {
    const result = await db
      .collection(COLLECTION)
      .deleteOne({ _id: new ObjectId(id) })
    return result.deletedCount > 0
  })
}