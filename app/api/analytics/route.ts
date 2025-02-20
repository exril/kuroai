import { NextRequest, NextResponse } from 'next/server';
import moment, { now } from 'moment';

if (!process.env.BACKEND_URL) {
  throw new Error('Backend URL is not defined!');
}

const apiUrl = process.env.BACKEND_URL;

export async function POST(req: NextRequest) {
  try {
    const response = await fetch(apiUrl + 'analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        start_time: moment(new Date(new Date(2025, 1, 6, new Date().getHours(), new Date().getMinutes()).getTime() - 10 * 60 * 60000)).format("YYYY-MM-DD HH:mm"),
        end_time: "2025-02-06 " + moment(new Date()).format("HH:mm")
      }),
    });

    const externalData = await response.json();
    console.log(externalData)
    
    return NextResponse.json({ 
      success: externalData ? true : false,
      data: externalData
    });
  } catch (error) {
    console.error('Error processing audio:', error);
    return NextResponse.error();
  }
}
