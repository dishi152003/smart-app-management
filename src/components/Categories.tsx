import {
  Trash2,
  Lightbulb,
  Droplets,
  Bus,
  TrafficCone,
  Building,
  Dog,
  PlusCircle,
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const categories = [
  { name: 'Waste Management', icon: Trash2 },
  { name: 'Electricity', icon: Lightbulb },
  { name: 'Water Supply', icon: Droplets },
  { name: 'Public Transport', icon: Bus },
  { name: 'Traffic & Roads', icon: TrafficCone },
  { name: 'Infrastructure', icon: Building },
  { name: 'Street Animals', icon: Dog },
  { name: 'Other Issues', icon: PlusCircle },
];

export function Categories() {
  return (
    <section className="bg-secondary/50 py-12 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">Report an Issue</h2>
          <p className="max-w-[700px] mx-auto text-muted-foreground md:text-xl">
            Select a category to report a problem in your area. Your feedback helps us improve our city.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => (
            <Link href="/report" key={category.name}>
              <Card className="flex flex-col items-center justify-center p-6 text-center h-full transition-all duration-300 ease-in-out hover:bg-primary/5 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
                <category.icon className="h-10 w-10 mb-4 text-primary" />
                <CardHeader className="p-0">
                  <CardTitle className="text-base font-semibold">{category.name}</CardTitle>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
        <div className="mt-12 text-center">
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="/report">
                    <PlusCircle className="mr-2 h-5 w-5" /> Report an Issue
                </Link>
            </Button>
        </div>
      </div>
    </section>
  );
}
