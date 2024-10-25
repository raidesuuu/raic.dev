import '@/styles.scss'
import Footer from '@components/Footer'
import Header from '@components/Header'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Rai Website',
    description: 'Rai website is made by :heart:',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <head>
                <link rel="icon" type="image/svg+xml" href="/icon.svg" />
                <title>Vite</title>
                <meta name="description" content="My App is a..." />
            </head>
            <body>
                <div id="root">
                    <Header />
                    {children}
                    <Footer />
                </div>
            </body>
        </html>
    )
}