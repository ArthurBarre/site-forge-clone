#!/usr/bin/env node

import { Vercel } from '@vercel/sdk'
import inquirer from 'inquirer'
import chalk from 'chalk'

// Initialize Vercel client
const vercel = new Vercel({
  bearerToken: "P6EFkItCI4x5tYl9rZQjf9jQ",
})

async function listProjects() {
  try {
    console.log(chalk.blue('🔍 Fetching Vercel projects...'))
    const response = await vercel.projects.getProjects({})
    return response.projects || []
  } catch (error) {
    console.error(chalk.red('❌ Error fetching projects:'), error.message)
    return []
  }
}

async function deleteProject(projectId) {
  try {
    console.log(chalk.yellow(`🗑️  Deleting project ${projectId}...`))
    await vercel.projects.deleteProject({ idOrName: projectId })
    console.log(chalk.green(`✅ Project ${projectId} deleted successfully`))
    return true
  } catch (error) {
    console.error(chalk.red(`❌ Error deleting project ${projectId}:`), error.message)
    return false
  }
}

async function main() {
  console.log(chalk.magenta('🚀 Vercel Project Manager'))
  console.log(chalk.gray('This tool helps you manage your Vercel projects\n'))


  // Fetch projects
  const projects = await listProjects()
  
  if (projects.length === 0) {
    console.log(chalk.yellow('📭 No projects found'))
    return
  }

  // Sort projects by creation date (newest first)
  const sortedProjects = projects.sort((a, b) => {
    const dateA = new Date(a.createdAt)
    const dateB = new Date(b.createdAt)
    return dateB - dateA // Descending order (newest first)
  })

  console.log(chalk.green(`📦 Found ${sortedProjects.length} project(s) (sorted by creation date)\n`))

  // Display projects
  sortedProjects.forEach((project, index) => {
    const createdDate = new Date(project.createdAt)
    const isRecent = (Date.now() - createdDate.getTime()) < (7 * 24 * 60 * 60 * 1000) // Less than 7 days
    
    console.log(chalk.cyan(`${index + 1}. ${project.name}`))
    console.log(chalk.gray(`   ID: ${project.id}`))
    console.log(chalk.gray(`   Framework: ${project.framework || 'Unknown'}`))
    console.log(chalk.gray(`   Created: ${createdDate.toLocaleDateString()} ${createdDate.toLocaleTimeString()}`))
    if (project.updatedAt) {
      const updatedDate = new Date(project.updatedAt)
      console.log(chalk.gray(`   Updated: ${updatedDate.toLocaleDateString()} ${updatedDate.toLocaleTimeString()}`))
    }
    if (isRecent) {
      console.log(chalk.yellow(`   ⚠️  Recent project (${Math.ceil((Date.now() - createdDate.getTime()) / (24 * 60 * 60 * 1000))} days old)`))
    }
    console.log('')
  })

  // Ask user to select projects to delete
  const { selectedProjects } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'selectedProjects',
      message: 'Select projects to delete:',
      choices: sortedProjects.map(project => {
        const createdDate = new Date(project.createdAt)
        const isRecent = (Date.now() - createdDate.getTime()) < (7 * 24 * 60 * 60 * 1000)
        const recentWarning = isRecent ? ' ⚠️ RECENT' : ''
        
        return {
          name: `${project.name} (${createdDate.toLocaleDateString()})${recentWarning}`,
          value: project.id,
          short: project.name
        }
      }),
      validate: (answer) => {
        if (answer.length === 0) {
          return 'Please select at least one project'
        }
        return true
      }
    }
  ])

  if (selectedProjects.length === 0) {
    console.log(chalk.yellow('👋 No projects selected. Exiting...'))
    return
  }

  // Show detailed summary of projects to be deleted
  console.log(chalk.red('\n🗑️  PROJECTS TO BE DELETED:'))
  console.log(chalk.red('=' .repeat(50)))
  
  const projectsToDelete = sortedProjects.filter(project => selectedProjects.includes(project.id))
  let recentCount = 0
  
  projectsToDelete.forEach((project, index) => {
    const createdDate = new Date(project.createdAt)
    const isRecent = (Date.now() - createdDate.getTime()) < (7 * 24 * 60 * 60 * 1000)
    if (isRecent) recentCount++
    
    console.log(chalk.red(`${index + 1}. ${project.name}`))
    console.log(chalk.gray(`   ID: ${project.id}`))
    console.log(chalk.gray(`   Framework: ${project.framework || 'Unknown'}`))
    console.log(chalk.gray(`   Created: ${createdDate.toLocaleDateString()} ${createdDate.toLocaleTimeString()}`))
    if (isRecent) {
      console.log(chalk.yellow(`   ⚠️  RECENT PROJECT (${Math.ceil((Date.now() - createdDate.getTime()) / (24 * 60 * 60 * 1000))} days old)`))
    }
    console.log('')
  })
  
  console.log(chalk.red(`Total projects to delete: ${projectsToDelete.length}`))
  if (recentCount > 0) {
    console.log(chalk.yellow(`⚠️  WARNING: ${recentCount} recent project(s) will be deleted!`))
  }
  console.log(chalk.red('=' .repeat(50)))

  // Confirm deletion
  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: `Are you sure you want to delete ${selectedProjects.length} project(s)?`,
      default: false
    }
  ])

  if (!confirm) {
    console.log(chalk.yellow('👋 Deletion cancelled'))
    return
  }

  // Delete selected projects
  console.log(chalk.red(`\n🗑️  Deleting ${selectedProjects.length} project(s)...\n`))
  
  let successCount = 0
  let errorCount = 0

  for (const projectId of selectedProjects) {
    const success = await deleteProject(projectId)
    if (success) {
      successCount++
    } else {
      errorCount++
    }
    console.log('') // Add spacing
  }

  // Summary
  console.log(chalk.magenta('\n📊 Summary:'))
  console.log(chalk.green(`✅ Successfully deleted: ${successCount}`))
  if (errorCount > 0) {
    console.log(chalk.red(`❌ Failed to delete: ${errorCount}`))
  }
}

// Handle errors
process.on('unhandledRejection', (error) => {
  console.error(chalk.red('❌ Unhandled error:'), error.message)
  process.exit(1)
})

// Run the script
main().catch((error) => {
  console.error(chalk.red('❌ Script error:'), error.message)
  process.exit(1)
})
