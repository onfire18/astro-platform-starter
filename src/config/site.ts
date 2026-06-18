export const SITE = {
  name: 'MediaDrift',
  tagline: 'Websites, die nicht nur gut aussehen. Sondern Kunden gewinnen.',
  url: 'https://mediadrift.de',
  contact: {
    name: 'Paul Dunker',
    company: 'MediaDrift',
    street: 'Balanstraße 102',
    city: '81539 München',
    country: 'Deutschland',
    phone: '+49 159 05405185',
    phoneClean: '4915905405185',
    email: 'info@mediadrift.org',
  },
  whatsapp: {
    number: '4915905405185',
    customerText: 'Hallo Paul, ich interessiere mich für eine neue Website und würde gerne mehr über einen ersten Entwurf erfahren.',
    salesText: 'Hallo Paul, ich interessiere mich für eine Zusammenarbeit als Vertriebspartner bei MediaDrift und würde gerne ein Kennenlerngespräch vereinbaren.',
  },
  booking: '[TERMINBUCHUNGSLINK EINFÜGEN]',
  ga4Id: '[GA4-MESS-ID EINFÜGEN]',
  social: {} as Record<string, string>,
} as const;

export function whatsappUrl(type: 'customer' | 'sales' = 'customer'): string {
  const text = type === 'customer' ? SITE.whatsapp.customerText : SITE.whatsapp.salesText;
  return `https://wa.me/${SITE.whatsapp.number}?text=${encodeURIComponent(text)}`;
}
