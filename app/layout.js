import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="antialiased bg-gray-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}
