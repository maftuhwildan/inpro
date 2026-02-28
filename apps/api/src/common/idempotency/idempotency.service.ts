import { Injectable } from '@nestjs/common'

type StoreEntry = {
  statusCode: number
  body: unknown
}

@Injectable()
export class IdempotencyService {
  private readonly store = new Map<string, StoreEntry>()

  get(key: string) {
    return this.store.get(key)
  }

  set(key: string, value: StoreEntry) {
    this.store.set(key, value)
  }
}
