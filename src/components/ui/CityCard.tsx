export default function CityCard({ city }: any) {
  return (
    <a href={`/${city.slug}`}>
      <div className='m-2 rounded-md border-2 border-gray-100 bg-[#D7E86C] p-4 text-lg font-bold'>
        {city.name}
      </div>
    </a>
  );
}
