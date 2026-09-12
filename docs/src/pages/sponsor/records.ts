export interface SponsorRecord {
  name: string
  date: string
  amount?: number
  message?: string
}

// Add only records the donor has agreed to make public.
export const sponsorRecords: SponsorRecord[] = [{
  name: '素衣拂袖',
  date: '2026-09-12',
  amount: 20,
  message: '感谢****无私开源',
}]
