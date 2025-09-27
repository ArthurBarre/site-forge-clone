import { NextRequest, NextResponse } from 'next/server'
import { createClient } from 'v0-sdk'
import { auth } from '@/app/(auth)/auth'
import { getChatOwnership } from '@/lib/db/queries'
import db from '@/lib/db/connection'
import { vercel_projects } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

// Create v0 client with custom baseUrl if V0_API_URL is set
const v0 = createClient(
  process.env.V0_API_URL ? { baseUrl: process.env.V0_API_URL } : {},
)

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ chatId: string }> },
) {
  try {
    const session = await auth()
    const { chatId } = await params

    console.log('Fetching chat details for ID:', chatId)

    if (!chatId) {
      return NextResponse.json(
        { error: 'Chat ID is required' },
        { status: 400 },
      )
    }

    if (session?.user?.id) {
      // Authenticated user - check ownership
      const ownership = await getChatOwnership({ v0ChatId: chatId })

      if (!ownership) {
        return NextResponse.json({ error: 'Chat not found' }, { status: 404 })
      }

      if (ownership.user_id !== session.user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    } else {
      // Anonymous user - allow access to any chat (they can only access via direct URL)
      console.log('Anonymous access to chat:', chatId)
    }

    // Fetch chat details using v0 SDK
    const chatDetails = await v0.chats.getById({ chatId })

    // Get deployment URL from Vercel projects table
    let deployUrl = null
    let deploymentStatus = null
    let lastDeployedAt = null
    
    console.log('Looking for Vercel project for chatId:', chatId)
    
    try {
      const [vercelProject] = await db.select()
        .from(vercel_projects)
        .where(eq(vercel_projects.v0_chat_id, chatId))
        .limit(1)
      
      console.log('Vercel project query result:', vercelProject)
      
      if (vercelProject) {
        deployUrl = vercelProject.deploy_url
        deploymentStatus = vercelProject.status
        lastDeployedAt = vercelProject.last_deployed_at
        console.log('Retrieved Vercel project from database:', {
          deployUrl,
          status: deploymentStatus,
          lastDeployedAt
        })
      } else {
        console.log('No Vercel project found for chat:', chatId)
      }
    } catch (dbError) {
      console.warn('Could not retrieve Vercel project:', dbError)
    }

    console.log('Chat details fetched:', chatDetails)

    // Extract latestVersionId from the chat details
    const latestVersionId = chatDetails?.latestVersion?.id || null
    console.log('Extracted latestVersionId:', latestVersionId)

    return NextResponse.json({
      ...chatDetails,
      latestVersionId,
      deployUrl,
      deploymentStatus,
      lastDeployedAt
    })
  } catch (error) {
    console.error('Error fetching chat details:', error)

    // Log more detailed error information
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }

    return NextResponse.json(
      {
        error: 'Failed to fetch chat details',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}
