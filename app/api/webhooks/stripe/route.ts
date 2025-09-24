import { NextRequest, NextResponse } from 'next/server'
import { handlePaymentWebhook } from '@/lib/payment-system'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe signature' },
        { status: 400 }
      )
    }

    // Traiter le webhook Stripe
    const success = await handlePaymentWebhook(body, signature, 'stripe')

    if (success) {
      return NextResponse.json({ received: true })
    } else {
      return NextResponse.json(
        { error: 'Webhook processing failed' },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Stripe webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
