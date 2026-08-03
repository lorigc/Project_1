import { ValeHeader } from "@/components/vale/header";
import { ValeRecommended } from "@/components/vale/recommended";
import { ValeKpis } from "@/components/vale/kpis";
import { ValeTelemetry } from "@/components/vale/telemetry";
import { ValeUploads } from "@/components/vale/uploads";
import { ValeDemographics } from "@/components/vale/demographics";
import { ValeScheduler } from "@/components/vale/scheduler";

/** Figma content-creator-dashboard (124:334), 1440×1349: main panel
 *  (px-40 pt-24 pb-40, 32px section gap) + fixed 360px scheduler column. */
export function ValeDashboard() {
  return (
    <div className="flex min-h-screen w-full flex-col items-start bg-[#09090b] text-[#fafafa] xl:flex-row">
      <main className="flex w-full min-w-0 flex-1 flex-col gap-[32px] px-[24px] pb-[40px] pt-[24px] sm:px-[24px] xl:px-[40px]">
        <ValeHeader />
        <ValeRecommended />
        <ValeKpis />
        <ValeTelemetry />
        <div className="flex w-full flex-col items-start gap-[24px] xl:flex-row">
          <ValeUploads />
          <ValeDemographics />
        </div>
      </main>
      <ValeScheduler />
    </div>
  );
}
