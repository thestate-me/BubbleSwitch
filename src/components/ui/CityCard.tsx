import { Button } from '@/components/ui/button';
export default function CityCard({ city }: any) {
  return (
    <div>
      {city.name}
      <Button variant='outline'>Button</Button>
    </div>
  );
}
