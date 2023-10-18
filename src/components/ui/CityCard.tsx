export default function CityCard({ city }: any) {
  return (
    <a href={`/${city.slug}`}>
      <div className='m-2 rounded-md border-2 border-gray-100 bg-orange-300 p-2'>
        {city.name}
      </div>
    </a>
  );
}
