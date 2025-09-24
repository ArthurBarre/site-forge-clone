    import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { deploymentId: string } }
) {
  try {
    const { deploymentId } = params

    if (!deploymentId) {
      return NextResponse.json(
        { error: 'Deployment ID is required' },
        { status: 400 }
      )
    }

    // Dans un vrai projet, supprimer de la base de données
    // et potentiellement annuler le déploiement Vercel
    console.log('Deleting deployment:', deploymentId)

    // Optionnel: Annuler le déploiement sur Vercel
    // const vercelToken = process.env.VERCEL_TOKEN
    // if (vercelToken) {
    //   await fetch(`https://api.vercel.com/v1/deployments/${deploymentId}`, {
    //     method: 'DELETE',
    //     headers: {
    //       'Authorization': `Bearer ${vercelToken}`,
    //     },
    //   })
    // }

    return NextResponse.json({
      success: true,
      message: 'Deployment deleted successfully',
    })

  } catch (error) {
    console.error('Error deleting deployment:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { deploymentId: string } }
) {
  try {
    const { deploymentId } = params

    if (!deploymentId) {
      return NextResponse.json(
        { error: 'Deployment ID is required' },
        { status: 400 }
      )
    }

    // Dans un vrai projet, récupérer depuis la base de données
    const deployment = {
      id: deploymentId,
      domain: 'example.com',
      url: 'https://example.com',
      status: 'deployed',
      deployedAt: new Date().toISOString(),
      chatId: 'chat_123',
    }

    return NextResponse.json(deployment)

  } catch (error) {
    console.error('Error fetching deployment:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
