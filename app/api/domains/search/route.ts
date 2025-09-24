import { NextRequest, NextResponse } from 'next/server'
import { checkDomainAvailability, getBestPriceForDomain } from '@/lib/domain-providers'

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      )
    }

    // Nettoyer la requête
    const cleanQuery = query.toLowerCase().replace(/[^a-z0-9-]/g, '')
    
    if (cleanQuery.length < 2) {
      return NextResponse.json(
        { error: 'Query must be at least 2 characters long' },
        { status: 400 }
      )
    }

    // TLDs populaires à vérifier
    const popularTlds = [
      '.com', '.fr', '.net', '.org', '.io', '.co', '.app', '.dev',
      '.tech', '.online', '.site', '.store', '.blog', '.me', '.info'
    ]

    const results = []

    // Vérifier la disponibilité pour chaque TLD
    for (const tld of popularTlds) {
      const domain = `${cleanQuery}${tld}`
      
      try {
        // Utiliser le vrai système de vérification
        const availabilityResults = await checkDomainAvailability(domain)
        
        if (availabilityResults.length > 0) {
          // Prendre le meilleur prix disponible
          const bestResult = availabilityResults.reduce((best, current) => {
            if (!best || !current.price) return current
            if (!current.price) return best
            return current.price.registration < best.price.registration ? current : best
          })
          
          results.push({
            domain: bestResult.domain,
            available: bestResult.available,
            price: bestResult.price ? `${bestResult.price.currency} ${bestResult.price.registration}` : undefined,
            tld: bestResult.tld,
            provider: bestResult.provider,
            registrationPeriod: bestResult.registrationPeriod
          })
        } else {
          // Fallback: utiliser la simulation
          const isAvailable = await simulateDomainAvailability(domain)
          results.push({
            domain,
            available: isAvailable,
            price: isAvailable ? getDomainPrice(tld) : undefined,
            tld,
            provider: 'Simulation',
            registrationPeriod: 1
          })
        }
      } catch (error) {
        console.error(`Error checking domain ${domain}:`, error)
        // Fallback: simulation locale
        const isAvailable = await simulateDomainAvailability(domain)
        results.push({
          domain,
          available: isAvailable,
          price: isAvailable ? getDomainPrice(tld) : undefined,
          tld,
          provider: 'Fallback',
          registrationPeriod: 1
        })
      }
    }

    // Trier par disponibilité puis par prix
    const sortedResults = results.sort((a, b) => {
      if (a.available && !b.available) return -1
      if (!a.available && b.available) return 1
      if (a.available && b.available) {
        const priceA = parseFloat(a.price?.replace(/[^\d.]/g, '') || '0')
        const priceB = parseFloat(b.price?.replace(/[^\d.]/g, '') || '0')
        return priceA - priceB
      }
      return 0
    })

    return NextResponse.json({
      success: true,
      query: cleanQuery,
      results: sortedResults,
      total: results.length,
      available: results.filter(r => r.available).length,
    })

  } catch (error) {
    console.error('Domain search error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Fonction de simulation de disponibilité (fallback)
async function simulateDomainAvailability(domain: string): Promise<boolean> {
  // Simuler la disponibilité basée sur des patterns
  const unavailablePatterns = [
    'google', 'facebook', 'twitter', 'instagram', 'youtube', 'amazon',
    'microsoft', 'apple', 'netflix', 'spotify', 'uber', 'airbnb'
  ]
  
  const domainName = domain.split('.')[0]
  
  // Si le nom contient des mots très communs, il est probablement indisponible
  if (unavailablePatterns.some(pattern => domainName.includes(pattern))) {
    return Math.random() < 0.1 // 10% de chance d'être disponible
  }
  
  // Pour les autres domaines, 70% de chance d'être disponible
  return Math.random() < 0.7
}

// Fonction pour obtenir le prix d'un domaine selon son TLD
function getDomainPrice(tld: string): string {
  const prices: Record<string, string> = {
    '.com': '$12.99',
    '.fr': '$8.99',
    '.net': '$14.99',
    '.org': '$12.99',
    '.io': '$39.99',
    '.co': '$29.99',
    '.app': '$19.99',
    '.dev': '$12.99',
    '.tech': '$24.99',
    '.online': '$9.99',
    '.site': '$4.99',
    '.store': '$19.99',
    '.blog': '$14.99',
    '.me': '$19.99',
    '.info': '$2.99',
  }
  
  return prices[tld] || '$12.99'
}
