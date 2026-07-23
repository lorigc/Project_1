import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Fragment } from "react";

export type Crumb = { label: string; href?: string };

/** Lightweight workflow breadcrumb: links for ancestors, plain text for the
 *  current location. */
export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[12.5px]">
      {crumbs.map((c, i) => (
        <Fragment key={c.label + i}>
          {i > 0 && <ChevronRight className="size-3 text-muted-foreground/60" aria-hidden />}
          {c.href ? (
            <Link
              href={c.href}
              className="rounded-md font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              {c.label}
            </Link>
          ) : (
            <span aria-current="page" className="font-medium text-foreground">
              {c.label}
            </span>
          )}
        </Fragment>
      ))}
    </nav>
  );
}
