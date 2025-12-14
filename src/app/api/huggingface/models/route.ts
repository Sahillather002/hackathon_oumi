import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter "q" is required' },
        { status: 400 }
      );
    }

    const response = await fetch(
      `https://huggingface.co/api/models?search=${encodeURIComponent(query)}&limit=${limit}`,
      {
        headers: {
          'Accept': 'application/json',
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch from Hugging Face');
    }

    const data = await response.json();
    
    // Transform to our format
    const models = data.map((model: any) => ({
      id: model.id,
      name: model.id,
      author: model.author || 'Unknown',
      downloads: model.downloads || 0,
      likes: model.likes || 0,
      tags: model.tags || [],
      pipeline_tag: model.pipeline_tag,
      library_name: model.library_name,
      model_type: model.model_type,
      card_data: model.card_data,
    }));

    return NextResponse.json(models);
  } catch (error) {
    console.error('Hugging Face API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch models from Hugging Face' },
      { status: 500 }
    );
  }
}

