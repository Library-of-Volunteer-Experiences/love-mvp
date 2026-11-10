// Page: shown for unknown URLs and deleted events/nonprofits
// Spec: docs/product/pages.md and docs/product/user-flows.md (Part 13)

import Link from 'next/link';
import { SearchX } from 'lucide-react';
import { EmptyState } from '@/components/global/empty-state';
import { Footer } from '@/components/global/footer';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <>
      <main id="main-content" className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <EmptyState
          icon={SearchX}
          headingLevel="h1"
          title="We couldn’t find that page"
          description="The link may be old, or the event or nonprofit may have been removed."
          action={
            <Button asChild size="lg">
              <Link href="/">Go to the home page</Link>
            </Button>
          }
        />
      </main>
      <Footer />
    </>
  );
}
