import { MantineProvider } from '@mantine/core';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <MantineProvider
        // withGlobalStyles={true as any}
        // withNormalizeCSS={true as any}
        >
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
