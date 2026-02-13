import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  const pixelId = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;
  const token = process.env.FB_ACCESS_TOKEN;

  try {
    const body = await req.json();
    const { eventName, eventId, userData, customData, url } = body;

    const hash = (data: string) => data ? crypto.createHash('sha256').update(data.trim().toLowerCase()).digest('hex') : null;

    const payload = {
      data: [{
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        event_source_url: url,
        event_id: eventId,
        user_data: {
          client_ip_address: req.headers.get('x-forwarded-for') || '127.0.0.1',
          client_user_agent: req.headers.get('user-agent') || '',
          fbp: userData?.fbp || null,
          fbc: userData?.fbc || null,
        },
        custom_data: {
          ...customData,
          value: customData?.value ? parseFloat(customData.value) : undefined,
          currency: customData?.currency || 'BRL'
        },
      }],
      // DESCOMENTE A LINHA ABAIXO PARA TESTAR E VER NO PAINEL DA META
      // test_event_code: TEST_CODE 
    };

    const response = await fetch(`https://graph.facebook.com/v18.0/${pixelId}/events?access_token=${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const fbRes = await response.json();

    if (!response.ok) {
      console.error("ERRO DA META:", fbRes); // Isso vai te dizer o erro real no terminal
      return NextResponse.json(fbRes, { status: 400 });
    }

    return NextResponse.json(fbRes);

  } catch (error) {
    console.error("Erro na rota:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}