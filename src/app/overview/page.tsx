import { Inter, JetBrains_Mono } from "next/font/google";
import { ValeDashboard } from "@/components/vale/dashboard";

const inter = Inter({ subsets: ["latin"], variable: "--font-vale" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-vale-mono" });

export const metadata = { title: "Vale — Creator Dashboard" };

export default function OverviewPage() {
  return (
    <div
      className={`${inter.variable} ${jetbrainsMono.variable} font-[family-name:var(--font-vale)] antialiased`}
    >
      <ValeDashboard />
    </div>
  );
}
