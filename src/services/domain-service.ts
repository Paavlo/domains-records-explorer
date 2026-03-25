import type { Domain } from '@/types/domains.ts'
import { mockDomains } from '@/mocks/domains.ts'

const domainsList: Domain[] = mockDomains

export const domainService = {
  async fetchDomains(): Promise<Domain[]> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() < 0.9) {
          resolve(domainsList)
        } else {
          reject(new Error('Failed to fetch domains. Please try again.'))
        }
      }, 1000)
    })
  },
}
