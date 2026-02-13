import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  const { eventName, eventId, userData, customData, url } = await body(req);
  
  const pixelId = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;
  const token = process.env.FB_ACCESS_TOKEN;

  // Função para Hash SHA256 (Exigência da Meta)
  const hash = (data: string) => data ? crypto.createHash('sha256').update(data.trim().toLowerCase()).digest('hex') : null;

  const payload = {
    data: [{
      event_name: eventName,
      event_time: Math.floor(Date.now() / 1000),
      action_source: "website",
      event_source_url: url,
      event_id: eventId, // ID para desduplicação
      user_data: {
        client_ip_address: req.headers.get('x-forwarded-for') || '0.0.0.0',
        client_user_agent: req.headers.get('user-agent') || '',
        em: userData?.email ? [hash(userData.email)] : undefined,
        fbp: userData?.fbp,
        fbc: userData?.fbc,
      },
      custom_data: customData,
    }]
  };

  const response = await fetch(`https://graph.facebook.com/v18.0/${pixelId}/events?access_token=${token}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  return NextResponse.json(await response.json());
}

async function body(req: NextRequest) { return await req.json(); }