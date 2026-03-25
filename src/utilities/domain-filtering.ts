import type { Domain } from '@/types/domains.ts'

export const filterDomains = (
  domains: Domain[],
  filter: {
    domain: string
    registrar: string
    status: string | null
  },
): Domain[] => {
  return domains.filter((d) => {
    const matchesDomain = d.domain.toLowerCase().includes(filter.domain.toLowerCase())
    const matchesRegistrar = d.registrar.toLowerCase().includes(filter.registrar.toLowerCase())
    const matchesStatus = filter.status ? d.status === filter.status : true

    return matchesDomain && matchesRegistrar && matchesStatus
  })
}
