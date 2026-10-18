import { CircleCheck, Heart } from 'lucide-react';
import { APP_CLIENT, APP_FULL_NAME, APP_NAME } from '@love/shared';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Placeholder page proving the web toolchain works end to end
// (Next.js, Tailwind, shared UI, shared packages, Lucide).
// No application features belong here yet.
export default function Home() {
  return (
    <main
      id="main-content"
      className="flex min-h-dvh flex-col items-center justify-center gap-8 px-6 py-16 text-center"
    >
      <Heart aria-hidden="true" className="size-16 text-primary" strokeWidth={2.5} />

      <div className="space-y-3">
        <h1 className="text-6xl font-bold tracking-tight text-primary">{APP_NAME}</h1>
        <p className="text-2xl font-medium">{APP_FULL_NAME}</p>
      </div>

      <Card className="w-full max-w-md font-sans">
        <CardHeader className="justify-items-center">
          <Badge variant="secondary">
            <CircleCheck aria-hidden="true" />
            Setup complete
          </Badge>
          <CardTitle className="font-sans">Repository Successfully Initialized</CardTitle>
          <CardDescription>{APP_CLIENT}</CardDescription>
        </CardHeader>
        <CardContent className="font-sans text-muted-foreground">
          The platform foundation is in place. Application features have not been built yet.
        </CardContent>
      </Card>
    </main>
  );
}
