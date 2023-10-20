'use client';

export default function Ticket({ url }: any) {
  function getCurrentDate() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    return `${month}/${day}/${year}`;
  }
  function getCurrentTime() {
    const currentDate = new Date();
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }
  return (
    <a href={url} target='_blank' rel='noreferrer'>
      <section className='flex w-full flex-grow items-center justify-center bg-gray-100 p-4'>
        <div className='flex h-64 w-full max-w-3xl text-zinc-50'>
          <div className='flex h-full flex-col items-center justify-center rounded-l-3xl bg-zinc-900 px-8'>
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${url}`}
            />
            <div
              className='mt-2 font-mono text-xs text-zinc-400'
              // style={{ writingMode: 'vertical-rl' }}
            >
              Click or scan
            </div>
          </div>
          <div className='relative flex h-full flex-col items-center justify-between border-2 border-dashed border-zinc-50 bg-zinc-900'>
            <div className='absolute -top-5 h-8 w-8 rounded-full bg-gray-100'></div>
            <div className='absolute -bottom-5 h-8 w-8 rounded-full bg-gray-100'></div>
          </div>
          <div className='flex h-full flex-grow flex-col rounded-r-3xl bg-zinc-900 px-10 py-8'>
            <div className='flex w-full items-center justify-between'>
              <div className='flex flex-col items-center'>
                <span className='text-4xl font-bold'>YOU</span>
                <span className='text-sm text-zinc-500'>Human</span>
              </div>
              <div className='flex flex-grow flex-col items-center px-10'>
                {/* <span className='text-xs font-bold'>RS 11</span> */}
                <div className='mt-2 flex w-full items-center'>
                  <div className='h-3 w-3 rounded-full border-2 border-zinc-900'></div>
                  <div className='h-px flex-grow border-t-2 border-dotted border-zinc-400'></div>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 20 20'
                    fill='currentColor'
                    className='mx-2 h-5 w-5'
                  >
                    <path d='M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z' />
                  </svg>
                  <div className='h-px flex-grow border-t-2 border-dotted border-zinc-400'></div>
                  <div className='h-3 w-3 rounded-full border-2 border-zinc-900'></div>
                </div>
                <div className='mt-2 flex h-8 items-center rounded-full bg-lime-400 px-3'>
                  <span className='text-sm text-zinc-900'>NOW</span>
                </div>
              </div>
              <div className='flex flex-col items-center'>
                <span className='text-4xl font-bold'>CHAT</span>
                <span className='text-sm text-zinc-500'>WWW</span>
              </div>
            </div>
            <div className='mt-auto flex w-full justify-between'>
              <div className='flex flex-col'>
                <span className='text-xs text-zinc-400'>Date</span>
                <span className='font-mono'>{getCurrentDate()}</span>
              </div>
              <div className='flex flex-col'>
                <span className='text-xs text-zinc-400'>Departure</span>
                <span className='font-mono'>{getCurrentTime()}</span>
              </div>
              <div className='flex flex-col'>
                <span className='text-xs text-zinc-400'>Passenger</span>
                <span className='font-mono'>YOU</span>
              </div>
              {/* <div className='flex flex-col'>
                <span className='text-xs text-zinc-400'>Gate/Seat</span>
                <span className='font-mono'>A11/21C</span>
              </div> */}
            </div>
          </div>
        </div>
      </section>
    </a>
  );
}
