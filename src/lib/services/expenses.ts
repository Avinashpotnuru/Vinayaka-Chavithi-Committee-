import { ObjectId, type Db, type Document, type WithId } from "mongodb"

import { withDatabase } from "@/lib/mongodb"
import {
  mockExpenses,
  type Expense,
  type ExpenseFormValues,
} from "@/lib/expenses-data"

const COLLECTION = "expenses"

function toExpense(doc: WithId<Document>): Expense {
  return {
    id: doc._id.toString(),
    name: doc.name as string,
    category: doc.category as Expense["category"],
    amount: doc.amount as number,
    date: doc.date as string,
    paymentMode: doc.paymentMode as Expense["paymentMode"],
    notes: doc.notes as string,
  }
}

function seedDoc(expense: (typeof mockExpenses)[number]) {
  return {
    name: expense.name,
    category: expense.category,
    amount: expense.amount,
    date: expense.date,
    paymentMode: expense.paymentMode,
    notes: expense.notes,
  }
}

async function seedIfEmpty(db: Db) {
  const count = await db.collection(COLLECTION).countDocuments()
  if (count > 0) return
  await db
    .collection(COLLECTION)
    .insertMany(mockExpenses.slice(0, 5).map(seedDoc))
}

export async function listExpenses(): Promise<Expense[]> {
  return withDatabase(async (db) => {
    await seedIfEmpty(db)
    const docs = await db.collection(COLLECTION).find().toArray()
    return docs.map(toExpense)
  })
}

export async function createExpense(
  values: ExpenseFormValues,
): Promise<Expense> {
  return withDatabase(async (db) => {
    const result = await db.collection(COLLECTION).insertOne(values)
    return { id: result.insertedId.toString(), ...values }
  })
}

export async function updateExpense(
  id: string,
  values: ExpenseFormValues,
): Promise<Expense | null> {
  return withDatabase(async (db) => {
    const doc = await db.collection(COLLECTION).findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: values },
      { returnDocument: "after" },
    )
    return doc ? toExpense(doc) : null
  })
}

export async function deleteExpense(id: string): Promise<boolean> {
  return withDatabase(async (db) => {
    const result = await db
      .collection(COLLECTION)
      .deleteOne({ _id: new ObjectId(id) })
    return result.deletedCount > 0
  })
}