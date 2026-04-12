import "./globals.css";

export const metadata = {
  title: "Kolma POS | Administrador",
  description: "Sistema de ventas para Kolma RD",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
