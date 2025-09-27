import { NextRequest, NextResponse } from 'next/server'
import { createClient } from 'v0-sdk'
import { Vercel } from '@vercel/sdk'
import db from '@/lib/db/connection'
import { chat_ownerships, vercel_projects } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

// Create v0 client with custom baseUrl if V0_API_URL is set
const v0 = createClient(
  process.env.V0_API_URL ? { baseUrl: process.env.V0_API_URL } : {},
)

// Create Vercel client
const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN,
})

export async function POST(request: NextRequest) {
  const { projectId, chatId, name, latestVersionId } = await request.json()

  // Use a default project ID if none provided or if it's a chat ID
  const actualProjectId = projectId || 'default-project'
  const actualChatId = chatId || 'default-chat'
console.log('latestVersionId:', latestVersionId)
  // Validate that we have a versionId
  if (!latestVersionId) {
    console.error('No versionId provided for deployment')
    return NextResponse.json(
      { 
        error: 'Version ID is required for deployment',
        details: 'latestVersionId is missing from the request'
      },
      { status: 400 },
    )
  }

  try {
    console.log('Creating deployment for project:', actualProjectId)
    console.log('Using versionId:', latestVersionId)

    // Check if we already have a Vercel project for this chat
    let existingVercelProject = null
    try {
      const [project] = await db.select()
        .from(vercel_projects)
        .where(eq(vercel_projects.v0_chat_id, actualChatId))
        .limit(1)
      
      if (project) {
        existingVercelProject = project
        console.log('Found existing Vercel project:', project.vercel_project_id)
      }
    } catch (dbError) {
      console.warn('Could not check for existing Vercel project:', dbError)
    }

    let vercelProjectId = null
    let vercelProjectName = null
    let isNewProject = false

    if (existingVercelProject) {
      // Use existing project
      vercelProjectId = existingVercelProject.vercel_project_id
      vercelProjectName = existingVercelProject.vercel_project_name
      console.log('Using existing Vercel project:', vercelProjectId)
    } else {
      // Create a new Vercel project
      try {
        console.log('Creating new Vercel project...')
        // Ensure project name is lowercase and valid for Vercel
        const timestamp = Date.now().toString().slice(-6) // Last 6 digits of timestamp
        const cleanName = name
          .toLowerCase()
          .replace(/[^a-z0-9._-]/g, '-')  // Replace invalid chars with single dash
          .replace(/-+/g, '-')            // Replace multiple dashes with single dash
          .replace(/^-+|-+$/g, '')       // Remove leading/trailing dashes
          .substring(0, 50)              // Limit length to avoid issues
        vercelProjectName = `${timestamp}-${cleanName}`
        
        // Final validation to ensure no --- sequences
        if (vercelProjectName.includes('---')) {
          vercelProjectName = vercelProjectName.replace(/---+/g, '--')
        }
        
        const newProject = await vercel.projects.createProject({
          requestBody: {
            name: vercelProjectName,
            framework: 'nextjs',
          }
        })
        vercelProjectId = newProject.id
        isNewProject = true
        console.log('Created new Vercel project:', vercelProjectId)
        
        // Save the new project to database
        try {
          await db.insert(vercel_projects).values({
            v0_chat_id: actualChatId,
            vercel_project_id: vercelProjectId,
            vercel_project_name: vercelProjectName,
            status: 'draft',
            last_deployed_at: new Date(),
          })
          console.log('Vercel project saved to database')
        } catch (dbError) {
          console.warn('Could not save Vercel project to database:', dbError)
        }
        
        // Associate the Vercel project with the v0 project
        try {
          console.log('Associating Vercel project with v0 project...')
          await v0.integrations.vercel.projects.create({
            projectId: actualProjectId,
            name: vercelProjectName
          })
          console.log('Vercel project associated successfully')
        } catch (associationError) {
          console.warn('Could not associate Vercel project:', associationError)
        }
      } catch (vercelError) {
        console.warn('Could not create Vercel project:', vercelError)
        // Continue without Vercel project for now
      }
    }

    // Create a deployment
    // For now, use the original v0 project ID
    const deployment = await v0.deployments.create({
      projectId: actualProjectId,
      chatId: actualChatId,
      versionId: latestVersionId
    })

    console.log('Deployment created:', deployment)

    // Get deployment status
    const deploymentData = await v0.deployments.getById({ deploymentId: deployment.id })
    console.log('Deployment data:', deploymentData)

    // Get deployment logs
    const logs = await v0.deployments.findLogs({ deploymentId: deployment.id })
    console.log('Deployment logs:', logs)

    // Save deployment URL to database
    let deploymentUrl = null
    // Use webUrl from Vercel deployment
    if (deploymentData && typeof deploymentData === 'object') {
      deploymentUrl = (deploymentData as any).webUrl || null
    }
    
    // Update the Vercel project with the deployment URL and status
    if (deploymentUrl) {
      console.log('Saving deployment URL to database:', deploymentUrl)
      try {
        await db.update(vercel_projects)
          .set({ 
            deploy_url: deploymentUrl,
            status: 'deployed',
            last_deployed_at: new Date(),
            updated_at: new Date()
          })
          .where(eq(vercel_projects.v0_chat_id, actualChatId))
        console.log('Deployment URL and status saved successfully')
      } catch (dbError) {
        console.warn('Could not save deployment URL to database:', dbError)
      }
    } else {
      console.log('No deployment URL to save')
    }

    return NextResponse.json({
      deployment,
      deploymentData,
      logs,
      vercelProjectId,
      vercelProjectName: vercelProjectId ? vercelProjectName : null,
      deploymentUrl,
      message: vercelProjectId ? 'Vercel project created/used successfully' : 'Deployment created without Vercel project'
    })
  } catch (error) {
    console.error('Error creating deployment:', error)
    
    // Return more detailed error information
    return NextResponse.json(
      { 
        error: 'Failed to create deployment',
        details: error instanceof Error ? error.message : 'Unknown error',
        projectId: actualProjectId,
        chatId: actualChatId
      },
      { status: 500 },
    )
  }
}
