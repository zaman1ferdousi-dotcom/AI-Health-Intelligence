import "./globals.css";

export const metadata = {
  title: "AI Health Intelligence",
  description: "An independent healthcare AI publication covering AI, digital health, health informatics, hospital finance, and health policy.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
