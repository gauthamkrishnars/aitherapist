import './globals.css';
import { Providers } from './providers';

export const viewport = {
  themeColor: '#10b981',
};

export const metadata = {
  title: 'Clarity AI Therapist | Empathetic Mental Health Support & Reflection',
  description:
    'A private computational sanctuary for emotional reflection, cognitive behavioral grounding, and non-judgmental conversational therapy support.',
  keywords: [
    'AI therapist',
    'mental health AI',
    'cognitive behavioral therapy',
    'emotional grounding',
    'online counseling companion',
    'crisis support 988',
    'anonymous therapy chat',
  ],
  authors: [{ name: 'Clarity Mental Health Labs' }],
  creator: 'Clarity Labs',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://clarity-therapy.app',
    title: 'Clarity AI Therapist | Empathetic Mental Health Support & Reflection',
    description:
      'A private computational sanctuary for emotional reflection, cognitive behavioral grounding, and non-judgmental conversational therapy support.',
    siteName: 'Clarity AI Therapist',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'Clarity AI Therapist Calm Ocean Horizon',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Clarity AI Therapist | Empathetic Mental Health Support & Reflection',
    description:
      'A private computational sanctuary for emotional reflection, cognitive behavioral grounding, and non-judgmental conversational therapy support.',
    images: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'],
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='46' fill='%230f172a'/><text x='50' y='65' font-size='44' text-anchor='middle' fill='white' font-family='sans-serif' font-weight='bold'>C</text></svg>",
  },
};

export default function RootLayout({ children }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HealthApplication',
    name: 'Clarity AI Therapist',
    applicationCategory: 'HealthApplication',
    operatingSystem: 'All Web Browsers',
    offers: {
      '@type': 'Offer',
      price: '0.00',
      priceCurrency: 'USD',
    },
    description:
      'A private computational sanctuary for emotional reflection, cognitive behavioral grounding, and non-judgmental conversational therapy support.',
    featureList: [
      'Empathetic conversational therapy dialogue',
      'Cognitive behavioral grounding techniques',
      'End of session summary synthesis with coping plans',
      'Safety crisis detection middleware linking to 988 Lifeline',
      'Anonymous guest sessions and encrypted local history',
    ],
    creator: {
      '@type': 'Organization',
      name: 'Clarity Labs',
    },
  };

  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-[#FAF9F6] text-[#1A1C20] dark:bg-[#121413] dark:text-[#ECEAE5] font-sans antialiased min-h-screen flex flex-col selection:bg-[#2A4030] selection:text-white transition-colors duration-200">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
