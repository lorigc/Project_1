import Link from "next/link";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ArrowLeft } from "lucide-react";
import { valeOpportunities } from "@/lib/vale";
import { valeDetailPages } from "@/lib/vale-details";
import { ValeThumb } from "@/components/vale/thumbnails";

const inter = Inter({ subsets: ["latin"], variable: "--font-vale" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-vale-mono" });

// One breakdown page per reference video, rendered from the shared dataset.
export function generateStaticParams() {
  return valeOpportunities.flatMap(o =>
    (valeDetailPages[o.slug]?.videos ?? []).map((_, i) => ({ slug: o.slug, example: String(i + 1) }))
  );
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; example: string }> }) {
  const { slug, example } = await params;
  const video = valeDetailPages[slug]?.videos[Number(example) - 1];
  return { title: `${video?.title ?? "Breakdown"} — Vale` };
}

export default async function ExampleBreakdownPage({
  params,
}: {
  params: Promise<{ slug: string; example: string }>;
}) {
  const { slug, example } = await params;
  const opportunity = valeOpportunities.find(o => o.slug === slug);
  const video = valeDetailPages[slug]?.videos[Number(example) - 1];
  if (!opportunity || !video) return null;

  return (
    <div className={`${inter.variable} ${jetbrainsMono.variable} font-[family-name:var(--font-vale)] antialiased`}>
      <div className="min-h-screen w-full bg-[#09090b] text-[#fafafa]">
        <div className="mx-auto flex w-full max-w-[720px] flex-col gap-[24px] px-[24px] py-[48px]">
          <Link
            href={`/opportunities/${slug}`}
            className="inline-flex w-fit items-center gap-[8px] rounded-md text-[13px] font-medium leading-[16px] text-[#71717a] transition-colors hover:text-[#fafafa] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4ade80]"
          >
            <ArrowLeft className="size-[14px]" aria-hidden />
            Back to {opportunity.title}
          </Link>

          <article className="overflow-hidden rounded-[16px] border border-[#222226] bg-[#121214]">
            <div className="aspect-video w-full" aria-hidden>
              <ValeThumb kind={video.thumb} className="size-full" />
            </div>
            <div className="flex flex-col gap-[16px] p-[28px]">
              <p className="flex items-center gap-[8px] text-[13px] leading-[16px]">
                <span className="font-semibold text-white">{video.creator}</span>
                <span className="text-[#71717a]" aria-hidden>•</span>
                <span className="text-[#71717a]">{video.uploaded}</span>
              </p>
              <h1 className="font-[family-name:var(--font-sans)] text-[22px] font-semibold leading-[28px] text-white">
                {video.title}
              </h1>
              <dl className="flex items-start gap-[32px] border-y border-[#222226] py-[14px]">
                <div>
                  <dt className="text-[11px] uppercase leading-[13px] text-[#71717a]">Views</dt>
                  <dd className="mt-[4px] text-[15px] font-semibold leading-[18px] text-white">{video.views}</dd>
                </div>
                <div>
                  <dt className="text-[11px] uppercase leading-[13px] text-[#71717a]">AVD Retention</dt>
                  <dd className="mt-[4px] text-[15px] font-semibold leading-[18px] text-[#4ade80]">{video.retention}</dd>
                </div>
                <div>
                  <dt className="text-[11px] uppercase leading-[13px] text-[#71717a]">Engagement</dt>
                  <dd className="mt-[4px] text-[15px] font-semibold leading-[18px] text-white">{video.engagement}</dd>
                </div>
              </dl>
              <div>
                <h2 className="text-[11px] font-semibold uppercase leading-[13px] tracking-wide text-[#4ade80]">
                  Why it worked
                </h2>
                <p className="mt-[6px] text-[14px] leading-[22px] text-[#a1a1aa]">{video.insight}</p>
              </div>
              <div>
                <h2 className="text-[11px] font-semibold uppercase leading-[13px] tracking-wide text-[#4ade80]">
                  Pattern to adapt
                </h2>
                <p className="mt-[6px] text-[14px] leading-[22px] text-[#a1a1aa]">{video.pattern}</p>
              </div>
              <p className="text-[11px] leading-[14px] text-[#52525b]">
                Illustrative example from trend tracking — figures are directional. Deeper telemetry
                breakdown coming next.
              </p>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
