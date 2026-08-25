import './globals.css';

export const metadata = {
  title: 'PreCall AI - Sales Meeting Prep Agent',
  description: 'Autonomous pre-meeting intelligence for B2B sales teams',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
