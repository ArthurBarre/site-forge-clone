#!/usr/bin/env node

import { Vercel } from '@vercel/sdk'
import inquirer from 'inquirer'
import chalk from 'chalk'
import dotenv from 'dotenv'
dotenv.config()

// Initialize Vercel client
const vercel = new Vercel({
  bearerToken: "P6EFkItCI4x5tYl9rZQjf9jQ",
})

async function listProjects() {
  try {
    console.log(chalk.blue('🔍 Fetching Vercel projects...'))
    const projects = await vercel.projects.listProjects()
    return projects.projects || []
  } catch (error) {
    console.error(chalk.red('❌ Error fetching projects:'), error.message)
    return []
  }
}

async function deleteProject(projectId) {
  try {
    console.log(chalk.yellow(`🗑️  Deleting project ${projectId}...`))
    await vercel.projects.deleteProject({ projectId })
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

  console.log(chalk.green(`📦 Found ${projects.length} project(s)\n`))

  // Display projects
  projects.forEach((project, index) => {
    console.log(chalk.cyan(`${index + 1}. ${project.name}`))
    console.log(chalk.gray(`   ID: ${project.id}`))
    console.log(chalk.gray(`   Framework: ${project.framework || 'Unknown'}`))
    console.log(chalk.gray(`   Created: ${new Date(project.createdAt).toLocaleDateString()}`))
    if (project.updatedAt) {
      console.log(chalk.gray(`   Updated: ${new Date(project.updatedAt).toLocaleDateString()}`))
    }
    console.log('')
  })

  // Ask user to select projects to delete
  const { selectedProjects } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'selectedProjects',
      message: 'Select projects to delete:',
      choices: projects.map(project => ({
        name: `${project.name} (${project.id})`,
        value: project.id,
        short: project.name
      })),
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
