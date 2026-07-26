import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  metadataBase: new URL("https://thefinancialbuddy.com"),
  title: {
    default: "The Financial Buddy — Practical Money Guides & Free Calculators",
    template: "%s | The Financial Buddy",
  },
  description:
    "Free budgeting, debt payoff, and savings calculators paired with plain-English guides to help you take control of your money.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
