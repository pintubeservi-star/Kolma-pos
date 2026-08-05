import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="bg-black text-white">{children}</body>
    </html>
  );
}
