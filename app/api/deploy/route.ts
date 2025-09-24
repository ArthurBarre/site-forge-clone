import { NextRequest, NextResponse } from 'next/server'
import { purchaseDomain, DomainPurchaseRequest } from '@/lib/domain-providers'
import { configureDomainDNS } from '@/lib/dns-management'
import { createPayment, createCustomer, CustomerInfo } from '@/lib/payment-system'

export async function POST(request: NextRequest) {
  try {
    const { 
      domain, 
      chatId, 
      demoUrl, 
      customerInfo,
      paymentMethod 
    } = await request.json()

    if (!domain || !chatId || !demoUrl) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    // Vérifier que le domaine est valide
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/
    if (!domainRegex.test(domain)) {
      return NextResponse.json(
        { error: 'Invalid domain format' },
        { status: 400 }
      )
    }

    // Créer ou récupérer le client
    let customerId: string
    if (customerInfo) {
      customerId = await createCustomer(customerInfo as CustomerInfo)
    } else {
      // Utiliser un client par défaut
      customerId = 'default-customer'
    }

    // Calculer le prix du domaine
    const tld = domain.substring(domain.lastIndexOf('.'))
    const domainPrice = getDomainPrice(tld)
    
    // Créer le paiement
    const payment = await createPayment({
      amount: domainPrice,
      currency: 'USD',
      domain,
      customerId,
      customerEmail: customerInfo?.email || 'customer@example.com',
      description: `Domain registration for ${domain}`,
      metadata: {
        chatId,
        demoUrl
      }
    })

    if (!payment.success) {
      return NextResponse.json(
        { error: 'Payment failed', details: payment.error },
        { status: 400 }
      )
    }

    // Acheter le domaine
    const domainPurchase = await purchaseDomain({
      domain,
      period: 1, // 1 an
      contactInfo: {
        firstName: customerInfo?.firstName || 'John',
        lastName: customerInfo?.lastName || 'Doe',
        email: customerInfo?.email || 'customer@example.com',
        phone: customerInfo?.phone || '+1234567890',
        address: {
          street: customerInfo?.address?.street || '123 Main St',
          city: customerInfo?.address?.city || 'City',
          state: customerInfo?.address?.state || 'State',
          zip: customerInfo?.address?.zip || '12345',
          country: customerInfo?.address?.country || 'US'
        }
      },
      nameservers: ['ns1.vercel-dns.com', 'ns2.vercel-dns.com'],
      autoRenew: true
    })

    if (!domainPurchase.success) {
      return NextResponse.json(
        { error: 'Domain purchase failed', details: domainPurchase.error },
        { status: 400 }
      )
    }

    // Déployer sur Vercel
    const deployment = await deployToVercel({
      domain,
      chatId,
      demoUrl,
      projectName: `siteforge-${chatId}`,
    })

    if (!deployment.success) {
      return NextResponse.json(
        { error: 'Deployment failed', details: deployment.error },
        { status: 500 }
      )
    }

    // Configurer les DNS
    try {
      await configureDomainDNS(domain, deployment.url)
    } catch (dnsError) {
      console.warn('DNS configuration failed:', dnsError)
      // Continuer même si la configuration DNS échoue
    }

    // Sauvegarder les informations de déploiement
    await saveDeploymentInfo({
      chatId,
      domain,
      vercelUrl: deployment.url,
      deploymentId: deployment.id,
      status: 'deployed',
      paymentId: payment.paymentId,
      domainPurchaseId: domainPurchase.orderId,
      expiresAt: domainPurchase.expiresAt
    })

    return NextResponse.json({
      success: true,
      domain,
      url: `https://${domain}`,
      vercelUrl: deployment.url,
      deploymentId: deployment.id,
      paymentId: payment.paymentId,
      domainPurchaseId: domainPurchase.orderId,
      expiresAt: domainPurchase.expiresAt
    })

  } catch (error) {
    console.error('Deployment error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Fonction pour obtenir le prix d'un domaine
function getDomainPrice(tld: string): number {
  const prices: Record<string, number> = {
    '.com': 12.99,
    '.fr': 8.99,
    '.net': 14.99,
    '.org': 12.99,
    '.io': 39.99,
    '.co': 29.99,
    '.app': 19.99,
    '.dev': 12.99,
    '.tech': 24.99,
    '.online': 9.99,
    '.site': 4.99,
    '.store': 19.99,
    '.blog': 14.99,
    '.me': 19.99,
    '.info': 2.99,
  }
  
  return prices[tld] || 12.99
}


// Fonction pour déployer sur Vercel
async function deployToVercel({
  domain,
  chatId,
  demoUrl,
  projectName,
}: {
  domain: string
  chatId: string
  demoUrl: string
  projectName: string
}) {
  try {
    // Utiliser l'API Vercel pour créer un projet et le déployer
    const vercelToken = process.env.VERCEL_TOKEN
    if (!vercelToken) {
      throw new Error('Vercel token not configured')
    }

    // 1. Créer un nouveau projet Vercel
    const projectResponse = await fetch('https://api.vercel.com/v1/projects', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${vercelToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: projectName,
        framework: 'nextjs',
        gitRepository: null, // Pas de repo Git, déploiement direct
      }),
    })

    if (!projectResponse.ok) {
      throw new Error('Failed to create Vercel project')
    }

    const project = await projectResponse.json()

    // 2. Déployer le code depuis l'URL de démo
    const deploymentResponse = await fetch(`https://api.vercel.com/v1/deployments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${vercelToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: projectName,
        project: project.id,
        source: 'import',
        target: 'production',
        // Utiliser l'URL de démo comme source
        gitSource: {
          type: 'github',
          repo: demoUrl,
          ref: 'main',
        },
        // Configuration du domaine personnalisé
        domains: [domain],
      }),
    })

    if (!deploymentResponse.ok) {
      throw new Error('Failed to deploy to Vercel')
    }

    const deployment = await deploymentResponse.json()

    // 3. Configurer le domaine personnalisé
    const domainResponse = await fetch(`https://api.vercel.com/v1/projects/${project.id}/domains`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${vercelToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: domain,
      }),
    })

    if (!domainResponse.ok) {
      console.warn('Failed to configure custom domain, but deployment succeeded')
    }

    return {
      success: true,
      id: deployment.id,
      url: deployment.url,
      domain,
    }

  } catch (error) {
    console.error('Vercel deployment error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Deployment failed',
    }
  }
}

// Fonction pour sauvegarder les informations de déploiement
async function saveDeploymentInfo({
  chatId,
  domain,
  vercelUrl,
  deploymentId,
  status,
}: {
  chatId: string
  domain: string
  vercelUrl: string
  deploymentId: string
  status: string
}) {
  try {
    // Sauvegarder dans la base de données
    // Ici, vous pouvez utiliser votre ORM ou client de base de données
    console.log('Saving deployment info:', {
      chatId,
      domain,
      vercelUrl,
      deploymentId,
      status,
    })

    // Dans un vrai projet, sauvegarder dans la DB
    // await db.deployments.create({
    //   chatId,
    //   domain,
    //   vercelUrl,
    //   deploymentId,
    //   status,
    //   createdAt: new Date(),
    // })

    return { success: true }
  } catch (error) {
    console.error('Error saving deployment info:', error)
    return { success: false, error }
  }
}
