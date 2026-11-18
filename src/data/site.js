export const site = {
  name: 'Heron Accountancy Solutions',
  phone: '028 9094 1680',
  phoneHref: 'tel:+442890941680',
  email: 'accounts@hasni.co.uk',
  address: ['301 City East Business Centre', '68–72 Newtownards Road', 'Belfast BT4 1GW'],
  hours: { short: 'Mon–Fri, 9am–5pm' },
  // Contact form: paste the form service's endpoint here (e.g. https://formspree.io/f/xxxxxxx)
  // to deliver messages. While it's empty, Send opens the visitor's email app with the
  // message filled in, addressed to the email above.
  formEndpoint: '',
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=City+East+Business+Centre+68-72+Newtownards+Road+Belfast+BT4+1GW',
  social: {
    facebook: 'https://www.facebook.com/Heronaccountancysolutions',
    x: 'https://twitter.com/HeronAccountsNI',
  },
};

export const services = [
  {
    num: '01',
    slug: 'business-start-up-advice',
    title: 'Business start-up advice',
    summary: 'Set up right from day one.',
  },
  {
    num: '02',
    slug: 'accounts-preparation',
    title: 'Accounts preparation',
    summary: 'Annual accounts prepared and filed.',
  },
  {
    num: '03',
    slug: 'tax-returns',
    title: 'Tax returns',
    summary: 'Self-assessment to corporation tax.',
  },
  {
    num: '04',
    slug: 'vat',
    title: 'VAT',
    summary: 'Registration, returns and advice.',
  },
  {
    num: '05',
    slug: 'payroll',
    title: 'Payroll',
    summary: 'Payslips, PAYE and year-end returns.',
  },
  {
    num: '06',
    slug: 'bookkeeping',
    title: 'Bookkeeping',
    summary: 'Records kept current, no late fines.',
  },
  {
    num: '07',
    slug: 'company-secretarial',
    title: 'Company secretarial',
    summary: 'Statutory filings and company admin.',
  },
  {
    num: '08',
    slug: 'accounting-software-training',
    title: 'Accounting software training',
    summary: 'The right software, and how to use it.',
  },
];

// Pages listed in "Other services" on each sub-page
export const relatedPages = [
  ...services.map((s) => ({ slug: s.slug, title: s.title })),
  { slug: 'cloud-accounting', title: 'Cloud accounting' },
];
