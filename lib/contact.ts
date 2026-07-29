export const contactInquiryTypes = [
  "新規楽曲制作について",
  "継続制作について",
  "その他",
] as const;

export type ContactInquiryType = (typeof contactInquiryTypes)[number];

export const contactLimits = {
  teamName: 100,
  contactName: 100,
  email: 254,
  location: 120,
  role: 100,
  performanceYear: 20,
  audioDeadline: 100,
  message: 5000,
  messageMinimum: 20,
  notes: 2000,
} as const;

export type ContactFieldName =
  | "teamName"
  | "contactName"
  | "email"
  | "location"
  | "role"
  | "performanceYear"
  | "audioDeadline"
  | "inquiryType"
  | "message"
  | "notes";

export type ContactFieldErrors = Partial<Record<ContactFieldName, string>>;

export function isContactInquiryType(
  value: string,
): value is ContactInquiryType {
  return contactInquiryTypes.some((type) => type === value);
}

export function isContactEmail(value: string): boolean {
  return (
    value.length <= contactLimits.email &&
    !/[\r\n]/.test(value) &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  );
}
