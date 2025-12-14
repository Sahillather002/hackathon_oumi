import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const response = await fetch(
      `https://huggingface.co/api/models/${id}`,
      {
        headers: {
          'Accept': 'application/json',
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Model not found' },
          { status: 404 }
        );
      }
      throw new Error('Failed to fetch model info');
    }

    const data = await response.json();
    
    // Transform to our format
    const model = {
      id: data.id,
      name: data.id,
      author: data.author || 'Unknown',
      downloads: data.downloads || 0,
      likes: data.likes || 0,
      tags: data.tags || [],
      pipeline_tag: data.pipeline_tag,
      library_name: data.library_name,
      model_type: data.model_type,
      config: data.config,
      siblings: data.siblings || [],
      card_data: data.card_data,
    };

    return NextResponse.json(model);
  } catch (error) {
    console.error('Hugging Face API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch model from Hugging Face' },
      { status: 500 }
    );
  }
}

