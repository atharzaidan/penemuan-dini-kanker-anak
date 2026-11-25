export const metadata = {
  title: "Workshop Penemuan Dini Kanker Anak - RSHS Bandung",
  description: "Simulasi edukasi klinis penemuan dini kanker anak bagi tenaga kesehatan.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body style={{ margin: 0, backgroundColor: "#ffffff" }}>{children}</body>
    </html>
  );
}
