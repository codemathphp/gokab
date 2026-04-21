import './globals.css'
import ClientLayout from './ClientLayout'

export const metadata = {
  title: 'GoKab - Travel in Smart Style',
  description: 'Premium taxi service - Travel in Smart Style',
  viewport: 'width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no',
  themeColor: '#FF7A3D',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'GoKab',
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/app_icon.png' },
      { url: '/app_icon.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: '/app_icon.png',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="GoKab" />
      </head>
      <body className="bg-white text-secondary">
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}
