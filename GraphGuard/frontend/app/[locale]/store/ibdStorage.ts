import { get, set, del } from 'idb-keyval'

const createIdbStorage = (dbName: string) => ({
  getItem: async (key: string): Promise<string | null> => {
    try {
      const value = await get(`${dbName}:${key}`)
      return value ?? null
    } catch {
      return null
    }
  },
  setItem: async (key: string, value: string): Promise<void> => {
    await set(`${dbName}:${key}`, value)
  },
  removeItem: async (key: string): Promise<void> => {
    await del(`${dbName}:${key}`)
  },
})

export default createIdbStorage