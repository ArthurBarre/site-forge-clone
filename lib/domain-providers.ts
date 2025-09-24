// Configuration des providers de domaines
export interface DomainProvider {
  name: string
  apiUrl: string
  apiKey: string
  username?: string
  enabled: boolean
  supportedTlds: string[]
  pricing: {
    [tld: string]: {
      registration: number
      renewal: number
      currency: string
    }
  }
}

export interface DomainSearchResult {
  domain: string
  available: boolean
  price?: {
    registration: number
    renewal: number
    currency: string
  }
  tld: string
  provider: string
  registrationPeriod: number // en années
}

export interface DomainPurchaseRequest {
  domain: string
  period: number // en années
  contactInfo: {
    firstName: string
    lastName: string
    email: string
    phone: string
    address: {
      street: string
      city: string
      state: string
      zip: string
      country: string
    }
  }
  nameservers?: string[]
  autoRenew?: boolean
}

export interface DomainPurchaseResult {
  success: boolean
  orderId?: string
  domain: string
  price: number
  currency: string
  expiresAt: Date
  nameservers: string[]
  error?: string
}

// Configuration des providers
export const DOMAIN_PROVIDERS: DomainProvider[] = [
  {
    name: 'Namecheap',
    apiUrl: 'https://api.namecheap.com',
    apiKey: process.env.NAMECHEAP_API_KEY || '',
    username: process.env.NAMECHEAP_USER || '',
    enabled: !!(process.env.NAMECHEAP_API_KEY && process.env.NAMECHEAP_USER),
    supportedTlds: ['.com', '.net', '.org', '.info', '.biz', '.co', '.io', '.me', '.us', '.ca', '.uk', '.de', '.fr'],
    pricing: {
      '.com': { registration: 12.99, renewal: 14.99, currency: 'USD' },
      '.net': { registration: 14.99, renewal: 16.99, currency: 'USD' },
      '.org': { registration: 12.99, renewal: 14.99, currency: 'USD' },
      '.info': { registration: 2.99, renewal: 14.99, currency: 'USD' },
      '.biz': { registration: 19.99, renewal: 19.99, currency: 'USD' },
      '.co': { registration: 29.99, renewal: 29.99, currency: 'USD' },
      '.io': { registration: 39.99, renewal: 39.99, currency: 'USD' },
      '.me': { registration: 19.99, renewal: 19.99, currency: 'USD' },
    }
  },
  {
    name: 'GoDaddy',
    apiUrl: 'https://api.godaddy.com',
    apiKey: process.env.GODADDY_API_KEY || '',
    enabled: !!process.env.GODADDY_API_KEY,
    supportedTlds: ['.com', '.net', '.org', '.info', '.biz', '.co', '.io', '.me', '.us', '.ca', '.uk', '.de', '.fr'],
    pricing: {
      '.com': { registration: 12.99, renewal: 14.99, currency: 'USD' },
      '.net': { registration: 14.99, renewal: 16.99, currency: 'USD' },
      '.org': { registration: 12.99, renewal: 14.99, currency: 'USD' },
    }
  },
  {
    name: 'Cloudflare',
    apiUrl: 'https://api.cloudflare.com',
    apiKey: process.env.CLOUDFLARE_API_KEY || '',
    enabled: !!process.env.CLOUDFLARE_API_KEY,
    supportedTlds: ['.com', '.net', '.org', '.info', '.biz', '.co', '.io', '.me'],
    pricing: {
      '.com': { registration: 9.15, renewal: 9.15, currency: 'USD' },
      '.net': { registration: 12.98, renewal: 12.98, currency: 'USD' },
      '.org': { registration: 8.57, renewal: 8.57, currency: 'USD' },
    }
  }
]

// Fonction pour obtenir le meilleur prix pour un domaine
export function getBestPriceForDomain(domain: string): DomainSearchResult | null {
  const tld = domain.substring(domain.lastIndexOf('.'))
  const name = domain.substring(0, domain.lastIndexOf('.'))
  
  let bestResult: DomainSearchResult | null = null
  let bestPrice = Infinity

  for (const provider of DOMAIN_PROVIDERS) {
    if (!provider.enabled || !provider.supportedTlds.includes(tld)) {
      continue
    }

    const pricing = provider.pricing[tld]
    if (!pricing) continue

    if (pricing.registration < bestPrice) {
      bestPrice = pricing.registration
      bestResult = {
        domain,
        available: true, // On assume disponible pour l'instant
        price: {
          registration: pricing.registration,
          renewal: pricing.renewal,
          currency: pricing.currency
        },
        tld,
        provider: provider.name,
        registrationPeriod: 1
      }
    }
  }

  return bestResult
}

// Fonction pour vérifier la disponibilité d'un domaine
export async function checkDomainAvailability(domain: string): Promise<DomainSearchResult[]> {
  const results: DomainSearchResult[] = []
  
  for (const provider of DOMAIN_PROVIDERS) {
    if (!provider.enabled) continue

    try {
      const result = await checkDomainWithProvider(domain, provider)
      if (result) {
        results.push(result)
      }
    } catch (error) {
      console.error(`Error checking domain with ${provider.name}:`, error)
    }
  }

  return results
}

// Fonction pour vérifier un domaine avec un provider spécifique
async function checkDomainWithProvider(domain: string, provider: DomainProvider): Promise<DomainSearchResult | null> {
  const tld = domain.substring(domain.lastIndexOf('.'))
  
  if (!provider.supportedTlds.includes(tld)) {
    return null
  }

  const pricing = provider.pricing[tld]
  if (!pricing) return null

  try {
    let available = false

    if (provider.name === 'Namecheap') {
      available = await checkNamecheapDomain(domain, provider)
    } else if (provider.name === 'GoDaddy') {
      available = await checkGoDaddyDomain(domain, provider)
    } else if (provider.name === 'Cloudflare') {
      available = await checkCloudflareDomain(domain, provider)
    }

    return {
      domain,
      available,
      price: available ? {
        registration: pricing.registration,
        renewal: pricing.renewal,
        currency: pricing.currency
      } : undefined,
      tld,
      provider: provider.name,
      registrationPeriod: 1
    }
  } catch (error) {
    console.error(`Error checking domain with ${provider.name}:`, error)
    return null
  }
}

// Vérification avec Namecheap
async function checkNamecheapDomain(domain: string, provider: DomainProvider): Promise<boolean> {
  const response = await fetch(
    `${provider.apiUrl}/xml.response?ApiUser=${provider.username}&ApiKey=${provider.apiKey}&UserName=${provider.username}&Command=namecheap.domains.check&DomainList=${domain}`,
    {
      method: 'GET',
    }
  )

  if (!response.ok) {
    throw new Error(`Namecheap API error: ${response.status}`)
  }

  const xml = await response.text()
  return xml.includes('Available="true"')
}

// Vérification avec GoDaddy
async function checkGoDaddyDomain(domain: string, provider: DomainProvider): Promise<boolean> {
  const response = await fetch(
    `${provider.apiUrl}/v1/domains/available?domain=${domain}`,
    {
      method: 'GET',
      headers: {
        'Authorization': `sso-key ${provider.apiKey}`,
        'Content-Type': 'application/json',
      },
    }
  )

  if (!response.ok) {
    throw new Error(`GoDaddy API error: ${response.status}`)
  }

  const data = await response.json()
  return data.available === true
}

// Vérification avec Cloudflare
async function checkCloudflareDomain(domain: string, provider: DomainProvider): Promise<boolean> {
  const response = await fetch(
    `${provider.apiUrl}/client/v4/zones`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${provider.apiKey}`,
        'Content-Type': 'application/json',
      },
    }
  )

  if (!response.ok) {
    throw new Error(`Cloudflare API error: ${response.status}`)
  }

  const data = await response.json()
  // Cloudflare ne fournit pas directement l'API de vérification de domaine
  // On utilise une simulation pour l'instant
  return Math.random() > 0.3
}

// Fonction pour acheter un domaine
export async function purchaseDomain(request: DomainPurchaseRequest): Promise<DomainPurchaseResult> {
  const tld = request.domain.substring(request.domain.lastIndexOf('.'))
  
  // Trouver le meilleur provider pour ce TLD
  const bestProvider = DOMAIN_PROVIDERS
    .filter(p => p.enabled && p.supportedTlds.includes(tld))
    .sort((a, b) => (a.pricing[tld]?.registration || Infinity) - (b.pricing[tld]?.registration || Infinity))[0]

  if (!bestProvider) {
    return {
      success: false,
      domain: request.domain,
      price: 0,
      currency: 'USD',
      expiresAt: new Date(),
      nameservers: [],
      error: 'No provider available for this TLD'
    }
  }

  try {
    let result: DomainPurchaseResult

    if (bestProvider.name === 'Namecheap') {
      result = await purchaseWithNamecheap(request, bestProvider)
    } else if (bestProvider.name === 'GoDaddy') {
      result = await purchaseWithGoDaddy(request, bestProvider)
    } else if (bestProvider.name === 'Cloudflare') {
      result = await purchaseWithCloudflare(request, bestProvider)
    } else {
      throw new Error('Unsupported provider')
    }

    return result
  } catch (error) {
    return {
      success: false,
      domain: request.domain,
      price: 0,
      currency: 'USD',
      expiresAt: new Date(),
      nameservers: [],
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Achat avec Namecheap
async function purchaseWithNamecheap(request: DomainPurchaseRequest, provider: DomainProvider): Promise<DomainPurchaseResult> {
  // Implémentation de l'achat avec Namecheap
  // Note: Cette fonction nécessite une implémentation complète de l'API Namecheap
  
  const pricing = provider.pricing[request.domain.substring(request.domain.lastIndexOf('.'))]
  const totalPrice = pricing.registration * request.period

  // Simulation pour l'instant - remplacer par la vraie API
  return {
    success: true,
    orderId: `NC_${Date.now()}`,
    domain: request.domain,
    price: totalPrice,
    currency: pricing.currency,
    expiresAt: new Date(Date.now() + request.period * 365 * 24 * 60 * 60 * 1000),
    nameservers: ['dns1.namecheap.com', 'dns2.namecheap.com']
  }
}

// Achat avec GoDaddy
async function purchaseWithGoDaddy(request: DomainPurchaseRequest, provider: DomainProvider): Promise<DomainPurchaseResult> {
  // Implémentation de l'achat avec GoDaddy
  const pricing = provider.pricing[request.domain.substring(request.domain.lastIndexOf('.'))]
  const totalPrice = pricing.registration * request.period

  // Simulation pour l'instant - remplacer par la vraie API
  return {
    success: true,
    orderId: `GD_${Date.now()}`,
    domain: request.domain,
    price: totalPrice,
    currency: pricing.currency,
    expiresAt: new Date(Date.now() + request.period * 365 * 24 * 60 * 60 * 1000),
    nameservers: ['ns1.godaddy.com', 'ns2.godaddy.com']
  }
}

// Achat avec Cloudflare
async function purchaseWithCloudflare(request: DomainPurchaseRequest, provider: DomainProvider): Promise<DomainPurchaseResult> {
  // Implémentation de l'achat avec Cloudflare
  const pricing = provider.pricing[request.domain.substring(request.domain.lastIndexOf('.'))]
  const totalPrice = pricing.registration * request.period

  // Simulation pour l'instant - remplacer par la vraie API
  return {
    success: true,
    orderId: `CF_${Date.now()}`,
    domain: request.domain,
    price: totalPrice,
    currency: pricing.currency,
    expiresAt: new Date(Date.now() + request.period * 365 * 24 * 60 * 60 * 1000),
    nameservers: ['ns1.cloudflare.com', 'ns2.cloudflare.com']
  }
}
