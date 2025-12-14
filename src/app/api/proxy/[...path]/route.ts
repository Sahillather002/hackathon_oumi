import { NextRequest, NextResponse } from 'next/server';

// API proxy to route requests to backend service
const BACKEND_URL = process.env.NODE_ENV === 'production' 
  ? 'http://localhost:3001' 
  : 'http://localhost:3001';

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  const path = '/' + (params.path?.join('/') || '');
  const searchParams = request.nextUrl.searchParams;
  
  try {
    const response = await fetch(`${BACKEND_URL}/api${path}?${searchParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Proxy GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch from backend' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest, { params }: { params: { path: string[] } }) {
  const path = '/' + (params.path?.join('/') || '');
  
  try {
    const body = await request.json();
    
    const response = await fetch(`${BACKEND_URL}/api${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Proxy POST error:', error);
    return NextResponse.json(
      { error: 'Failed to post to backend' },
      { status: 500 }
    );
  }
}