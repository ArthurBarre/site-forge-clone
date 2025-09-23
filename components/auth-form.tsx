'use client'

import { useActionState } from 'react'
import { signInAction, signUpAction } from '@/app/(auth)/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'

interface AuthFormProps {
  type: 'signin' | 'signup'
}

export function AuthForm({ type }: AuthFormProps) {
  const [state, formAction, isPending] = useActionState(
    type === 'signin' ? signInAction : signUpAction,
    undefined,
  )

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="Email"
          required
          autoFocus
          className="w-full"
        />
      </div>
      <div>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Mot de passe"
          required
          className="w-full"
          minLength={type === 'signup' ? 6 : 1}
        />
      </div>

      {state?.type === 'error' && (
        <div className="text-sm text-red-500">{state.message}</div>
      )}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending
          ? type === 'signin'
            ? 'Connexion en cours...'
            : 'Création du compte...'
          : type === 'signin'
            ? 'Se connecter'
            : 'Créer un compte'}
      </Button>

      <div className="text-center text-sm text-muted-foreground">
        {type === 'signin' ? (
          <>
            Vous n&apos;avez pas de compte ?{' '}
            <Link href="/register" className="text-primary hover:underline">
              S&apos;inscrire
            </Link>
          </>
        ) : (
          <>
            Vous avez déjà un compte ?{' '}
            <Link href="/login" className="text-primary hover:underline">
              Se connecter
            </Link>
          </>
        )}
      </div>
    </form>
  )
}
