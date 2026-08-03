import { valeUploads } from "@/lib/vale";
import { ValeThumb } from "@/components/vale/thumbnails";

/** Figma recent-uploads-card: flex-1 table with fixed metric columns. */
export function ValeUploads() {
  return (
    <section
      aria-labelledby="vale-uploads-title"
      className="flex w-full min-w-0 flex-1 flex-col gap-[16px] rounded-[12px] border border-[#222226] bg-[#121214] p-[24px]"
    >
      <div className="flex w-full items-center justify-between gap-4">
        <h2 id="vale-uploads-title" className="text-[15px] font-semibold leading-[18px] text-[#fafafa]">
          Recent Channel Uploads
        </h2>
        <a
          href="#"
          className="whitespace-nowrap rounded-md text-[12px] font-semibold leading-[15px] text-[#3e9300] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3e9300]"
        >
          View Studio Details
        </a>
      </div>
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[520px] border-collapse text-left">
          <thead>
            <tr className="border-b border-[#222226] text-[11px] font-semibold uppercase leading-[13px] text-[#71717a]">
              <th scope="col" className="pb-[7px] pr-[16px] font-semibold">Video Title</th>
              <th scope="col" className="w-[80px] pb-[7px] pr-[16px] font-semibold">Views</th>
              <th scope="col" className="w-[60px] pb-[7px] pr-[16px] font-semibold">CTR</th>
              <th scope="col" className="w-[60px] pb-[7px] font-semibold">AVD</th>
            </tr>
          </thead>
          <tbody>
            {valeUploads.map(u => (
              <tr key={u.id} className="border-b border-[#222226]">
                <td className="py-[11.5px] pr-[16px]">
                  <div className="flex items-center gap-[12px]">
                    <ValeThumb kind={u.thumb} className="h-[40px] w-[72px] shrink-0 rounded-[6px]" />
                    <div className="min-w-0 max-w-[256px]">
                      <p className="truncate text-[13px] font-semibold leading-[16px] text-[#fafafa]">{u.title}</p>
                      <p className="mt-[2px] text-[11px] font-normal leading-[13px] text-[#71717a]">{u.uploaded}</p>
                    </div>
                  </div>
                </td>
                <td className="py-[11.5px] pr-[16px] align-middle font-[family-name:var(--font-vale-mono)] text-[13px] font-medium leading-[17px] text-[#fafafa]">
                  {u.views}
                </td>
                <td className="py-[11.5px] pr-[16px] align-middle font-[family-name:var(--font-vale-mono)] text-[13px] font-medium leading-[17px] text-[#10b981]">
                  {u.ctr}
                </td>
                <td className="py-[11.5px] align-middle font-[family-name:var(--font-vale-mono)] text-[13px] font-medium leading-[17px] text-[#a1a1aa]">
                  {u.avd}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
