import type { VercelRequest, VercelResponse } from '@vercel/node';

// Proxies Mercado Pago payments search with server-side token
// Forwards all query params to MP API
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const token = process.env.MP_ACCESS_TOKEN || process.env.MERCADO_PAGO_ACCESS_TOKEN || '';
  if (!token) {
    res.status(500).json({ error: 'Missing MP access token on server' });
    return;
  }

  const query = new URLSearchParams(req.query as any).toString();
  const url = `https://api.mercadopago.com/v1/payments/search${query ? `?${query}` : ''}`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const text = await response.text();
    res.status(response.status).send(text);
  } catch (e: any) {
    res.status(500).json({ error: e?.message || 'Unknown error' });
  }
}


