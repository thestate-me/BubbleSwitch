export default function CityCard({ city }: any) {
  return (
    <a href={`/${city.slug}`}>
      <div
        style={{
          backgroundImage: `url(${city.cover})`,
        }}
        className={`relative m-2 rounded-md border-2 border-gray-100 bg-[#D7E86C] p-4  py-20 text-center text-2xl font-bold ${
          city.cover ? 'text-white' : 'text-black'
        }`}
      >
        {city.name}
        {city.communities && (
          <div className='absolute bottom-0 left-0 p-4 text-center  text-xl font-bold'>
            {city.communities.length}{' '}
            <span className='text-sm'>
              communit{city.communities.length > 1 ? 'ies' : 'y'}
            </span>
          </div>
        )}
        {city.guides && (
          <div className='absolute bottom-0 right-0 p-4 text-center  text-xl font-bold'>
            {city.guides.length}{' '}
            <span className='text-sm'>
              guid{city.guides.length > 1 ? 'es' : 'e'}
            </span>
          </div>
        )}
      </div>
    </a>
  );
}
