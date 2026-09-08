import { ObjectId, type Db, type Document, type WithId } from "mongodb"

import { withDatabase } from "@/lib/mongodb"
import { mockTasks, type Task, type TaskFormValues } from "@/lib/tasks-data"

const COLLECTION = "tasks"

function toTask(doc: WithId<Document>): Task {
  return {
    id: doc._id.toString(),
    name: doc.name as string,
    memberId: doc.memberId as string,
    dueDate: doc.dueDate as string,
    status: doc.status as Task["status"],
  }
}

function seedDoc(task: (typeof mockTasks)[number]) {
  return {
    name: task.name,
    memberId: task.memberId,
    dueDate: task.dueDate,
    status: task.status,
  }
}

async function seedIfEmpty(db: Db) {
  const count = await db.collection(COLLECTION).countDocuments()
  if (count > 0) return
  await db.collection(COLLECTION).insertMany(mockTasks.map(seedDoc))
}

export async function listTasks(): Promise<Task[]> {
  return withDatabase(async (db) => {
    await seedIfEmpty(db)
    const docs = await db.collection(COLLECTION).find().toArray()
    return docs.map(toTask)
  })
}

export async function createTask(values: TaskFormValues): Promise<Task> {
  return withDatabase(async (db) => {
    const result = await db.collection(COLLECTION).insertOne(values)
    return { id: result.insertedId.toString(), ...values }
  })
}

export async function updateTask(
  id: string,
  values: TaskFormValues,
): Promise<Task | null> {
  return withDatabase(async (db) => {
    const doc = await db.collection(COLLECTION).findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: values },
      { returnDocument: "after" },
    )
    return doc ? toTask(doc) : null
  })
}

export async function deleteTask(id: string): Promise<boolean> {
  return withDatabase(async (db) => {
    const result = await db
      .collection(COLLECTION)
      .deleteOne({ _id: new ObjectId(id) })
    return result.deletedCount > 0
  })
}