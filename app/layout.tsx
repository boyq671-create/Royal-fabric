export const metadata = {
  title: 'Royal Fabric',
  description: 'Welcome to Royal Fabric',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'sans-serif' }}>{children}</body>
    </html>
  )
}
