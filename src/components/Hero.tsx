import Image from 'next/image';

export function Hero() {
  return (
    <section className="container mx-auto px-4 md:px-6 py-12 md:py-24 lg:py-32">
      <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-12">
        <div className="space-y-4 text-center lg:text-left">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl font-headline text-primary">
            Welcome to SmartSphere
          </h1>
          <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto lg:mx-0">
            Your voice in building a smarter, more responsive city. Report issues, track progress, and be part of the change.
          </p>
        </div>
        <div className="relative mx-auto aspect-video overflow-hidden rounded-xl w-full">
            <Image
              src="https://images.unsplash.com/photo-1502780436228-d18385e04a75?q=80&w=1200&auto=format&fit=crop"
              alt="A modern metro train in a smart city"
              data-ai-hint="smart city metro"
              fill
              className="object-cover"
            />
        </div>
      </div>
    </section>
  );
}
