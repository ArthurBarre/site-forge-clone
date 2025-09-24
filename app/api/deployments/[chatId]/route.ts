import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { chatId: string } }
) {
  try {
    const { chatId } = params

    if (!chatId) {
      return NextResponse.json(
        { error: 'Chat ID is required' },
        { status: 400 }
      )
    }

    // Dans un vrai projet, récupérer depuis la base de données
    // Pour l'instant, simuler des données
    const deploymentInfo = {
      chatId,
      domain: 'example.com', // Remplacer par la vraie donnée
      url: 'https://example.com',
      status: 'deployed',
      deployedAt: new Date().toISOString(),
      vercelUrl: 'https://example.vercel.app',
      deploymentId: 'dpl_123456789',
    }

    return NextResponse.json(deploymentInfo)

  } catch (error) {
    console.error('Error fetching deployment info:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { chatId: string } }
) {
  try {
    const { chatId } = params
    const { domain, url, status, deploymentId } = await request.json()

    if (!chatId || !domain) {
      return NextResponse.json(
        { error: 'Chat ID and domain are required' },
        { status: 400 }
      )
    }

    // Dans un vrai projet, sauvegarder dans la base de données
    const deploymentInfo = {
      chatId,
      domain,
      url: url || `https://${domain}`,
      status: status || 'deployed',
      deployedAt: new Date().toISOString(),
      deploymentId,
    }

    // Simuler la sauvegarde
    console.log('Saving deployment info:', deploymentInfo)

    return NextResponse.json({
      success: true,
      deployment: deploymentInfo,
    })

  } catch (error) {
    console.error('Error saving deployment info:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
