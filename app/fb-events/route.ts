import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  const pixelId = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || process.env.FACEBOOK_PIXEL_ID;
  const token = process.env.FB_ACCESS_TOKEN;

  if (!pixelId || !token) {
    return NextResponse.json(
      { error: 'Missing FB_ACCESS_TOKEN or FACEBOOK_PIXEL_ID' },
      { status: 500 }
    );
  }

  const { eventName, eventId, userData, customData, url } = await body(req);

  if (!eventName || !eventId) {
    return NextResponse.json(
      { error: 'eventName and eventId are required' },
      { status: 400 }
    );
  }

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

  const data = await response.json();

  if (!response.ok) {
    return NextResponse.json(data, { status: response.status });
  }

  return NextResponse.json(data);
}

async function body(req: NextRequest) {
  try {
    return await req.json();
  } catch {
    return {};
  }
}