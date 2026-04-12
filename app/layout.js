import "./globals.css";
export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="antialiased bg-slate-50">{children}</body>
    </html>
  );
}
