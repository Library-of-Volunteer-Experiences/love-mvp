import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

export type NonprofitLink = { slug: string; name: string };

type NonprofitSidebarProps = {
  memberOf: NonprofitLink[];
  volunteeringWith: NonprofitLink[];
};

export function NonprofitSidebar({ memberOf, volunteeringWith }: NonprofitSidebarProps) {
  return (
    <div className="space-y-6">
      {memberOf.length > 0 && (
        <>
          <NonprofitGroup
            heading="Your nonprofits"
            items={memberOf}
            href={(slug) => `/nonprofits/${slug}/manage`}
          />
          <Separator />
        </>
      )}
      <NonprofitGroup
        heading="Volunteering with"
        items={volunteeringWith}
        href={(slug) => `/nonprofits/${slug}`}
        emptyText="When you sign up for an event, the nonprofit shows up here."
      />
    </div>
  );
}

function NonprofitGroup({
  heading,
  items,
  href,
  emptyText,
}: {
  heading: string;
  items: NonprofitLink[];
  href: (slug: string) => string;
  emptyText?: string;
}) {
  return (
    <section>
      <h2 className="mb-3 text-base font-semibold">{heading}</h2>
      {items.length === 0 ? (
        <p className="text-muted-foreground">{emptyText}</p>
      ) : (
        <ul className="space-y-1">
          {items.map(({ slug, name }) => (
            <li key={slug}>
              <Link
                href={href(slug)}
                className="flex min-h-11 items-center rounded-md px-3 hover:bg-accent"
              >
                {name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
