import { NextRequest, NextResponse } from 'next/server'
import { Vercel } from '@vercel/sdk'
import db from '@/lib/db/connection'
import { vercel_projects } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

// Create Vercel client
const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN,
})

export async function POST(request: NextRequest) {
  try {
    const { chatId } = await request.json()

    if (!chatId) {
      return NextResponse.json(
        { error: 'Chat ID is required' },
        { status: 400 }
      )
    }

    console.log('Undeploying project for chatId:', chatId)

    // Find the Vercel project associated with this chat
    const [vercelProject] = await db.select()
      .from(vercel_projects)
      .where(eq(vercel_projects.v0_chat_id, chatId))
      .limit(1)

    if (!vercelProject) {
      return NextResponse.json(
        { error: 'No deployment found for this chat' },
        { status: 404 }
      )
    }

    console.log('Found Vercel project:', vercelProject)

    try {
      // Delete the entire Vercel project (this will remove all deployments and make the site inaccessible)
      console.log('Deleting Vercel project:', vercelProject.vercel_project_id)
      await vercel.projects.deleteProject({
        idOrName: vercelProject.vercel_project_id
      })

      console.log('Vercel project deleted successfully')
      
      // Verify the project is actually deleted by trying to get projects
      try {
        const projects = await vercel.projects.getProjects({})
        const projectStillExists = projects.projects?.some(p => p.id === vercelProject.vercel_project_id)
        if (projectStillExists) {
          console.warn('Project still exists after deletion attempt')
        } else {
          console.log('Project deletion verified - project no longer exists')
        }
      } catch (verifyError) {
        console.log('Could not verify project deletion, but deletion was attempted')
      }
    } catch (vercelError) {
      console.error('Could not delete Vercel project:', vercelError)
      console.error('Error details:', {
        message: vercelError instanceof Error ? vercelError.message : 'Unknown error',
        stack: vercelError instanceof Error ? vercelError.stack : undefined
      })
      // Continue with database update even if Vercel deletion fails
    }

    // Delete the project record from database since the Vercel project is completely deleted
    await db.delete(vercel_projects)
      .where(eq(vercel_projects.v0_chat_id, chatId))

    console.log('Project record deleted from database')

    return NextResponse.json({ 
      success: true,
      message: 'Project undeployed successfully' 
    })

  } catch (error) {
    console.error('Undeploy error:', error)
    return NextResponse.json(
      { error: 'Failed to undeploy project' },
      { status: 500 }
    )
  }
}
