import { NextRequest, NextResponse } from 'next/server'
import { handlePaymentWebhook } from '@/lib/payment-system'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('paypal-transmission-id')

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing PayPal signature' },
        { status: 400 }
      )
    }

    // Traiter le webhook PayPal
    const success = await handlePaymentWebhook(body, signature, 'paypal')

    if (success) {
      return NextResponse.json({ received: true })
    } else {
      return NextResponse.json(
        { error: 'Webhook processing failed' },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('PayPal webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
