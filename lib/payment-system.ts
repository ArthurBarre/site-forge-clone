// Système de paiement pour les domaines
export interface PaymentRequest {
  amount: number
  currency: string
  domain: string
  customerId: string
  customerEmail: string
  description: string
  metadata?: {
    [key: string]: string
  }
}

export interface PaymentResult {
  success: boolean
  paymentId?: string
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  error?: string
  receiptUrl?: string
}

export interface CustomerInfo {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  address: {
    street: string
    city: string
    state: string
    zip: string
    country: string
  }
}

// Configuration des providers de paiement
export const PAYMENT_PROVIDERS = {
  stripe: {
    enabled: !!process.env.STRIPE_SECRET_KEY,
    publicKey: process.env.STRIPE_PUBLIC_KEY,
    secretKey: process.env.STRIPE_SECRET_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET
  },
  paypal: {
    enabled: !!process.env.PAYPAL_CLIENT_ID,
    clientId: process.env.PAYPAL_CLIENT_ID,
    clientSecret: process.env.PAYPAL_CLIENT_SECRET,
    environment: process.env.PAYPAL_ENVIRONMENT || 'sandbox'
  }
}

// Fonction pour créer un paiement
export async function createPayment(request: PaymentRequest): Promise<PaymentResult> {
  try {
    // Vérifier les providers disponibles
    const availableProviders = getAvailablePaymentProviders()
    
    if (availableProviders.length === 0) {
      return {
        success: false,
        amount: request.amount,
        currency: request.currency,
        status: 'failed',
        error: 'No payment providers configured'
      }
    }

    // Utiliser Stripe par défaut si disponible
    if (availableProviders.includes('stripe')) {
      return await createStripePayment(request)
    } else if (availableProviders.includes('paypal')) {
      return await createPayPalPayment(request)
    } else {
      throw new Error('No payment providers available')
    }
  } catch (error) {
    console.error('Error creating payment:', error)
    return {
      success: false,
      amount: request.amount,
      currency: request.currency,
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Fonction pour obtenir les providers de paiement disponibles
function getAvailablePaymentProviders(): string[] {
  const providers: string[] = []
  
  if (PAYMENT_PROVIDERS.stripe.enabled) {
    providers.push('stripe')
  }
  
  if (PAYMENT_PROVIDERS.paypal.enabled) {
    providers.push('paypal')
  }
  
  return providers
}

// Fonction pour créer un paiement Stripe
async function createStripePayment(request: PaymentRequest): Promise<PaymentResult> {
  try {
    const stripe = require('stripe')(PAYMENT_PROVIDERS.stripe.secretKey)
    
    // Créer un PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(request.amount * 100), // Convertir en centimes
      currency: request.currency.toLowerCase(),
      metadata: {
        domain: request.domain,
        customerId: request.customerId,
        ...request.metadata
      },
      description: request.description,
      receipt_email: request.customerEmail
    })

    return {
      success: true,
      paymentId: paymentIntent.id,
      amount: request.amount,
      currency: request.currency,
      status: 'pending',
      receiptUrl: paymentIntent.receipt_url
    }
  } catch (error) {
    console.error('Stripe payment error:', error)
    return {
      success: false,
      amount: request.amount,
      currency: request.currency,
      status: 'failed',
      error: error instanceof Error ? error.message : 'Stripe payment failed'
    }
  }
}

// Fonction pour créer un paiement PayPal
async function createPayPalPayment(request: PaymentRequest): Promise<PaymentResult> {
  try {
    const paypal = require('@paypal/checkout-server-sdk')
    
    const environment = new paypal.core.SandboxEnvironment(
      PAYMENT_PROVIDERS.paypal.clientId,
      PAYMENT_PROVIDERS.paypal.clientSecret
    )
    
    const client = new paypal.core.PayPalHttpClient(environment)
    
    const orderRequest = {
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: request.currency,
          value: request.amount.toString()
        },
        description: request.description
      }],
      metadata: {
        domain: request.domain,
        customerId: request.customerId
      }
    }
    
    const request_paypal = new paypal.orders.OrdersCreateRequest()
    request_paypal.prefer('return=representation')
    request_paypal.requestBody(orderRequest)
    
    const response = await client.execute(request_paypal)
    
    return {
      success: true,
      paymentId: response.result.id,
      amount: request.amount,
      currency: request.currency,
      status: 'pending'
    }
  } catch (error) {
    console.error('PayPal payment error:', error)
    return {
      success: false,
      amount: request.amount,
      currency: request.currency,
      status: 'failed',
      error: error instanceof Error ? error.message : 'PayPal payment failed'
    }
  }
}

// Fonction pour confirmer un paiement
export async function confirmPayment(paymentId: string, provider: string): Promise<PaymentResult> {
  try {
    if (provider === 'stripe') {
      return await confirmStripePayment(paymentId)
    } else if (provider === 'paypal') {
      return await confirmPayPalPayment(paymentId)
    } else {
      throw new Error('Unsupported payment provider')
    }
  } catch (error) {
    console.error('Error confirming payment:', error)
    return {
      success: false,
      amount: 0,
      currency: 'USD',
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Fonction pour confirmer un paiement Stripe
async function confirmStripePayment(paymentId: string): Promise<PaymentResult> {
  try {
    const stripe = require('stripe')(PAYMENT_PROVIDERS.stripe.secretKey)
    
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentId)
    
    return {
      success: paymentIntent.status === 'succeeded',
      paymentId: paymentIntent.id,
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency.toUpperCase(),
      status: paymentIntent.status === 'succeeded' ? 'completed' : 'failed'
    }
  } catch (error) {
    console.error('Error confirming Stripe payment:', error)
    return {
      success: false,
      amount: 0,
      currency: 'USD',
      status: 'failed',
      error: error instanceof Error ? error.message : 'Stripe confirmation failed'
    }
  }
}

// Fonction pour confirmer un paiement PayPal
async function confirmPayPalPayment(paymentId: string): Promise<PaymentResult> {
  try {
    const paypal = require('@paypal/checkout-server-sdk')
    
    const environment = new paypal.core.SandboxEnvironment(
      PAYMENT_PROVIDERS.paypal.clientId,
      PAYMENT_PROVIDERS.paypal.clientSecret
    )
    
    const client = new paypal.core.PayPalHttpClient(environment)
    
    const request = new paypal.orders.OrdersCaptureRequest(paymentId)
    request.requestBody({})
    
    const response = await client.execute(request)
    
    return {
      success: response.result.status === 'COMPLETED',
      paymentId: response.result.id,
      amount: parseFloat(response.result.purchase_units[0].amount.value),
      currency: response.result.purchase_units[0].amount.currency_code,
      status: response.result.status === 'COMPLETED' ? 'completed' : 'failed'
    }
  } catch (error) {
    console.error('Error confirming PayPal payment:', error)
    return {
      success: false,
      amount: 0,
      currency: 'USD',
      status: 'failed',
      error: error instanceof Error ? error.message : 'PayPal confirmation failed'
    }
  }
}

// Fonction pour créer un client
export async function createCustomer(customerInfo: CustomerInfo): Promise<string> {
  try {
    // Créer le client dans Stripe
    if (PAYMENT_PROVIDERS.stripe.enabled) {
      const stripe = require('stripe')(PAYMENT_PROVIDERS.stripe.secretKey)
      
      const customer = await stripe.customers.create({
        email: customerInfo.email,
        name: `${customerInfo.firstName} ${customerInfo.lastName}`,
        phone: customerInfo.phone,
        address: {
          line1: customerInfo.address.street,
          city: customerInfo.address.city,
          state: customerInfo.address.state,
          postal_code: customerInfo.address.zip,
          country: customerInfo.address.country
        }
      })
      
      return customer.id
    }
    
    // Fallback: générer un ID client local
    return `cust_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  } catch (error) {
    console.error('Error creating customer:', error)
    throw error
  }
}

// Fonction pour obtenir les informations d'un client
export async function getCustomer(customerId: string): Promise<CustomerInfo | null> {
  try {
    if (PAYMENT_PROVIDERS.stripe.enabled) {
      const stripe = require('stripe')(PAYMENT_PROVIDERS.stripe.secretKey)
      
      const customer = await stripe.customers.retrieve(customerId)
      
      return {
        id: customer.id,
        email: customer.email,
        firstName: customer.name?.split(' ')[0] || '',
        lastName: customer.name?.split(' ').slice(1).join(' ') || '',
        phone: customer.phone,
        address: {
          street: customer.address?.line1 || '',
          city: customer.address?.city || '',
          state: customer.address?.state || '',
          zip: customer.address?.postal_code || '',
          country: customer.address?.country || ''
        }
      }
    }
    
    return null
  } catch (error) {
    console.error('Error getting customer:', error)
    return null
  }
}

// Fonction pour traiter un webhook de paiement
export async function handlePaymentWebhook(payload: any, signature: string, provider: string): Promise<boolean> {
  try {
    if (provider === 'stripe') {
      return await handleStripeWebhook(payload, signature)
    } else if (provider === 'paypal') {
      return await handlePayPalWebhook(payload)
    } else {
      throw new Error('Unsupported payment provider')
    }
  } catch (error) {
    console.error('Error handling payment webhook:', error)
    return false
  }
}

// Fonction pour traiter un webhook Stripe
async function handleStripeWebhook(payload: any, signature: string): Promise<boolean> {
  try {
    const stripe = require('stripe')(PAYMENT_PROVIDERS.stripe.secretKey)
    
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      PAYMENT_PROVIDERS.stripe.webhookSecret
    )
    
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object
      console.log('Payment succeeded:', paymentIntent.id)
      
      // Traiter le paiement réussi
      await processSuccessfulPayment(paymentIntent)
      
      return true
    }
    
    return false
  } catch (error) {
    console.error('Error handling Stripe webhook:', error)
    return false
  }
}

// Fonction pour traiter un webhook PayPal
async function handlePayPalWebhook(payload: any): Promise<boolean> {
  try {
    // Vérifier la signature PayPal
    // Implémentation simplifiée pour l'instant
    
    if (payload.event_type === 'PAYMENT.CAPTURE.COMPLETED') {
      console.log('PayPal payment completed:', payload.resource.id)
      
      // Traiter le paiement réussi
      await processSuccessfulPayment(payload.resource)
      
      return true
    }
    
    return false
  } catch (error) {
    console.error('Error handling PayPal webhook:', error)
    return false
  }
}

// Fonction pour traiter un paiement réussi
async function processSuccessfulPayment(paymentData: any): Promise<void> {
  try {
    // Extraire les informations du paiement
    const domain = paymentData.metadata?.domain
    const customerId = paymentData.metadata?.customerId
    
    if (!domain || !customerId) {
      console.error('Missing domain or customer ID in payment data')
      return
    }
    
    // Déclencher le processus d'achat du domaine
    console.log(`Processing successful payment for domain: ${domain}`)
    
    // Ici, vous pouvez déclencher le processus d'achat du domaine
    // et la configuration DNS
    
  } catch (error) {
    console.error('Error processing successful payment:', error)
  }
}
