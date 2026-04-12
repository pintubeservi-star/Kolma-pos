export const metadata = {
  title: "Kolma POS | Administrador",
  description: "Sistema de ventas para Kolma RD",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
        }
