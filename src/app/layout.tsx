import "./globals.css";
import Providers from "./providers"
import Navbar from "@/components/Navbar";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: [
    "100",
    "200",
    "300",
    "400",
    "500",
    "600",
    "700",
    "800",
    "900",
  ],
  style: ["normal", "italic"],
  display: "swap",
});
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body>
        <Providers>
          {/* <Navbar /> */}
          {children}
        </Providers>
      </body>
    </html>
  );
}
