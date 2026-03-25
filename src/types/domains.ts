export type DomainStatus = 'active' | 'clientHold' | 'pendingTransfer'

export interface Domain {
  domain: string
  registrar: string
  status: DomainStatus
  created_at: string
  expires_at: string
  nameservers: Array<string>
  updated_at: string
}
