import { type InsertAdviceHistory, type AdviceHistoryRecord, adviceHistory } from "@shared/schema";
import { db } from "./db";
import { desc } from "drizzle-orm";

export interface IStorage {
  saveAdviceHistory(record: InsertAdviceHistory): Promise<AdviceHistoryRecord>;
  getAdviceHistory(limit?: number): Promise<AdviceHistoryRecord[]>;
}

export class DbStorage implements IStorage {
  async saveAdviceHistory(record: InsertAdviceHistory): Promise<AdviceHistoryRecord> {
    const [result] = await db.insert(adviceHistory).values(record).returning();
    return result;
  }

  async getAdviceHistory(limit: number = 20): Promise<AdviceHistoryRecord[]> {
    return await db
      .select()
      .from(adviceHistory)
      .orderBy(desc(adviceHistory.timestamp))
      .limit(limit);
  }
}

export const storage = new DbStorage();
