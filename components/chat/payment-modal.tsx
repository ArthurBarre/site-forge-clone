'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CreditCard, User, MapPin, Phone, Mail } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PaymentModalProps {
  domain: string
  price: number
  currency: string
  onPayment: (customerInfo: CustomerInfo) => void
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

interface CustomerInfo {
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

export function PaymentModal({ 
  domain, 
  price, 
  currency, 
  onPayment, 
  isOpen, 
  onOpenChange 
}: PaymentModalProps) {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zip: '',
      country: 'US'
    }
  })
  
  const [isProcessing, setIsProcessing] = useState(false)
  const [errors, setErrors] = useState<Partial<CustomerInfo>>({})

  const validateForm = (): boolean => {
    const newErrors: Partial<CustomerInfo> = {}
    
    if (!customerInfo.firstName.trim()) {
      newErrors.firstName = 'Prénom requis'
    }
    
    if (!customerInfo.lastName.trim()) {
      newErrors.lastName = 'Nom requis'
    }
    
    if (!customerInfo.email.trim()) {
      newErrors.email = 'Email requis'
    } else if (!/\S+@\S+\.\S+/.test(customerInfo.email)) {
      newErrors.email = 'Email invalide'
    }
    
    if (!customerInfo.phone.trim()) {
      newErrors.phone = 'Téléphone requis'
    }
    
    if (!customerInfo.address.street.trim()) {
      newErrors.address = { ...newErrors.address, street: 'Adresse requise' }
    }
    
    if (!customerInfo.address.city.trim()) {
      newErrors.address = { ...newErrors.address, city: 'Ville requise' }
    }
    
    if (!customerInfo.address.state.trim()) {
      newErrors.address = { ...newErrors.address, state: 'État requis' }
    }
    
    if (!customerInfo.address.zip.trim()) {
      newErrors.address = { ...newErrors.address, zip: 'Code postal requis' }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsProcessing(true)
    
    try {
      await onPayment(customerInfo)
      onOpenChange(false)
    } catch (error) {
      console.error('Payment error:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setCustomerInfo(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof CustomerInfo],
          [child]: value
        }
      }))
    } else {
      setCustomerInfo(prev => ({
        ...prev,
        [field]: value
      }))
    }
    
    // Clear error when user starts typing
    if (errors[field as keyof CustomerInfo]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }))
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Paiement pour {domain}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Résumé de la commande</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Domaine :</span>
                  <span className="font-medium">{domain}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Période :</span>
                  <span>1 an</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Prix :</span>
                  <span className="font-bold text-lg">
                    {currency} {price.toFixed(2)}
                  </span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total :</span>
                    <span>{currency} {price.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Information Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <User className="h-4 w-4" />
                Informations personnelles
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">Prénom *</Label>
                  <Input
                    id="firstName"
                    value={customerInfo.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className={cn(errors.firstName && "border-red-500")}
                    placeholder="John"
                  />
                  {errors.firstName && (
                    <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="lastName">Nom *</Label>
                  <Input
                    id="lastName"
                    value={customerInfo.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className={cn(errors.lastName && "border-red-500")}
                    placeholder="Doe"
                  />
                  {errors.lastName && (
                    <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={cn(errors.email && "border-red-500")}
                    placeholder="john@example.com"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Téléphone *
                  </Label>
                  <Input
                    id="phone"
                    value={customerInfo.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={cn(errors.phone && "border-red-500")}
                    placeholder="+1 (555) 123-4567"
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Adresse
              </h3>
              
              <div>
                <Label htmlFor="street">Adresse *</Label>
                <Input
                  id="street"
                  value={customerInfo.address.street}
                  onChange={(e) => handleInputChange('address.street', e.target.value)}
                  className={cn(errors.address?.street && "border-red-500")}
                  placeholder="123 Main Street"
                />
                {errors.address?.street && (
                  <p className="text-sm text-red-500 mt-1">{errors.address.street}</p>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">Ville *</Label>
                  <Input
                    id="city"
                    value={customerInfo.address.city}
                    onChange={(e) => handleInputChange('address.city', e.target.value)}
                    className={cn(errors.address?.city && "border-red-500")}
                    placeholder="New York"
                  />
                  {errors.address?.city && (
                    <p className="text-sm text-red-500 mt-1">{errors.address.city}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="state">État *</Label>
                  <Input
                    id="state"
                    value={customerInfo.address.state}
                    onChange={(e) => handleInputChange('address.state', e.target.value)}
                    className={cn(errors.address?.state && "border-red-500")}
                    placeholder="NY"
                  />
                  {errors.address?.state && (
                    <p className="text-sm text-red-500 mt-1">{errors.address.state}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="zip">Code postal *</Label>
                  <Input
                    id="zip"
                    value={customerInfo.address.zip}
                    onChange={(e) => handleInputChange('address.zip', e.target.value)}
                    className={cn(errors.address?.zip && "border-red-500")}
                    placeholder="10001"
                  />
                  {errors.address?.zip && (
                    <p className="text-sm text-red-500 mt-1">{errors.address.zip}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="country">Pays</Label>
                <select
                  id="country"
                  value={customerInfo.address.country}
                  onChange={(e) => handleInputChange('address.country', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="US">États-Unis</option>
                  <option value="CA">Canada</option>
                  <option value="FR">France</option>
                  <option value="DE">Allemagne</option>
                  <option value="UK">Royaume-Uni</option>
                </select>
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Méthode de paiement</h3>
              <div className="p-4 border rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CreditCard className="h-4 w-4" />
                  <span>Paiement sécurisé via Stripe</span>
                  <Badge variant="secondary">Sécurisé</Badge>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isProcessing}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={isProcessing}
                className="flex items-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Traitement...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4" />
                    Payer {currency} {price.toFixed(2)}
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
