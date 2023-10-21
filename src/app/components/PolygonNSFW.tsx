import { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';

export default function QrNSFW({ userAddr }: { userAddr: string }) {
  const [request, setRequest] = useState('');
  const [error, setError] = useState();

  useEffect(() => {
    fetch('/api/polygon/nsfw/qr', {
      method: 'POST',
      body: JSON.stringify({
        userAddr,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.result != 'success') setError(data.result);
        else setRequest(JSON.stringify(data.qr));
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) return <p>{error}</p>;
  if (!request) return <p>Waiting...</p>;

  return <QRCode value={request} />;
}
