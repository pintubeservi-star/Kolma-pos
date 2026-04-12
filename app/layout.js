/**
 * Ubicación: /app/layout.js
 */
export const metadata = {
  title: "Kolma POS | Administrador",
  description: "Sistema de ventas para Kolma RD",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body style={{ margin: 0, padding: 0, backgroundColor: '#f1f5f9' }}>
        {children}
      </body>
    </html>
  );
}
