export default function CommunityCard({ community, city }: any) {
  return (
    <a href={`/${city.slug}/community/${community.slug}`}>
      <div className='relative m-2 h-full rounded-md border-2 border-gray-100 bg-[#D7E86C] p-4  py-20 text-center text-2xl font-bold'>
        {community.name}
        {/* {guide.communities && (
          <div className='absolute bottom-0 left-0 p-4 text-center  text-xl font-bold text-black'>
            {guide.communities.length}{' '}
            <span className='text-sm'>
              communit{guide.communities.length > 1 ? 'ies' : 'y'}
            </span>
          </div>
        )} */}
        <div className='absolute right-0 top-0 p-4 text-center  text-xl font-bold text-black'>
          {community.nsfw ? '18+' : ''}
        </div>
        <div className='absolute bottom-0 right-0 p-4 text-center  text-xl font-bold text-black'>
          {community.isPaid ? '$$$' : ''}
        </div>
      </div>
    </a>
  );
}
