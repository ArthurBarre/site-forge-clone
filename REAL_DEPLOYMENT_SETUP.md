# 🚀 Configuration du déploiement réel - SiteForge

## Vue d'ensemble

Ce guide vous explique comment configurer le système de déploiement réel avec achat de domaines, paiements et configuration DNS automatique.

## 🔧 Configuration requise

### Variables d'environnement

Ajoutez ces variables à votre fichier `.env.local` :

```bash
# === DÉPLOIEMENT VERCEL ===
VERCEL_TOKEN="your-vercel-token"

# === PROVIDERS DE DOMAINES ===
# Namecheap (recommandé)
NAMECHEAP_API_KEY="your-namecheap-api-key"
NAMECHEAP_USER="your-namecheap-username"

# GoDaddy (optionnel)
GODADDY_API_KEY="your-godaddy-api-key"

# Cloudflare (optionnel)
CLOUDFLARE_API_KEY="your-cloudflare-api-key"

# === SYSTÈME DE PAIEMENT ===
# Stripe (recommandé)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLIC_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# PayPal (optionnel)
PAYPAL_CLIENT_ID="your-paypal-client-id"
PAYPAL_CLIENT_SECRET="your-paypal-client-secret"
PAYPAL_ENVIRONMENT="sandbox" # ou "live"

# === GÉNÉRATION DE SITES ===
V0_API_KEY="your-v0-api-key"
```

## 🏪 Configuration des providers de domaines

### 1. Namecheap (Recommandé)

**Avantages :**
- ✅ API complète et fiable
- ✅ Prix compétitifs
- ✅ Support DNS avancé
- ✅ Gestion des domaines .fr, .com, etc.

**Configuration :**
1. Créez un compte sur [Namecheap](https://www.namecheap.com/)
2. Allez dans **Account** > **API Access**
3. Activez l'API et obtenez vos clés
4. Ajoutez les variables d'environnement

**Prix moyens :**
- `.com` : $12.99/an
- `.fr` : $8.99/an
- `.net` : $14.99/an
- `.org` : $12.99/an

### 2. GoDaddy (Alternative)

**Avantages :**
- ✅ API robuste
- ✅ Large sélection de TLDs
- ✅ Intégration DNS

**Configuration :**
1. Créez un compte développeur sur [GoDaddy](https://developer.godaddy.com/)
2. Obtenez votre clé API
3. Ajoutez la variable d'environnement

### 3. Cloudflare (Premium)

**Avantages :**
- ✅ DNS ultra-rapide
- ✅ Sécurité avancée
- ✅ CDN intégré

**Configuration :**
1. Créez un compte [Cloudflare](https://cloudflare.com/)
2. Obtenez votre API key
3. Ajoutez la variable d'environnement

## 💳 Configuration des paiements

### 1. Stripe (Recommandé)

**Avantages :**
- ✅ Paiements sécurisés
- ✅ Support international
- ✅ Webhooks fiables
- ✅ Interface simple

**Configuration :**
1. Créez un compte sur [Stripe](https://stripe.com/)
2. Allez dans **Developers** > **API Keys**
3. Copiez vos clés de test/production
4. Configurez les webhooks :
   - URL : `https://votre-domaine.com/api/webhooks/stripe`
   - Événements : `payment_intent.succeeded`

### 2. PayPal (Alternative)

**Avantages :**
- ✅ Reconnaissance mondiale
- ✅ Paiements flexibles

**Configuration :**
1. Créez un compte développeur sur [PayPal Developer](https://developer.paypal.com/)
2. Créez une application
3. Obtenez vos clés client
4. Configurez les webhooks

## 🌐 Configuration Vercel

### 1. Obtenir un token Vercel

1. Allez sur [Vercel Dashboard](https://vercel.com/dashboard)
2. Naviguez vers **Settings** > **Tokens**
3. Cliquez sur **Create Token**
4. Donnez un nom (ex: "SiteForge Deploy")
5. Sélectionnez les permissions :
   - ✅ **Deployments** (lecture/écriture)
   - ✅ **Projects** (lecture/écriture)
   - ✅ **Domains** (lecture/écriture)

### 2. Configuration des domaines

Vercel gère automatiquement :
- ✅ Certificats SSL
- ✅ Configuration DNS
- ✅ CDN global
- ✅ Monitoring

## 🔄 Flux de déploiement complet

### 1. Recherche de domaines
```typescript
// L'utilisateur recherche un domaine
const results = await checkDomainAvailability('mon-site')
// Retourne les domaines disponibles avec prix
```

### 2. Sélection et paiement
```typescript
// L'utilisateur sélectionne un domaine
const payment = await createPayment({
  amount: 12.99,
  currency: 'USD',
  domain: 'mon-site.com',
  customerId: 'cust_123'
})
```

### 3. Achat du domaine
```typescript
// Achat automatique du domaine
const purchase = await purchaseDomain({
  domain: 'mon-site.com',
  period: 1,
  contactInfo: customerInfo
})
```

### 4. Déploiement Vercel
```typescript
// Déploiement sur Vercel
const deployment = await deployToVercel({
  domain: 'mon-site.com',
  chatId: 'chat_123',
  demoUrl: 'https://demo.example.com'
})
```

### 5. Configuration DNS
```typescript
// Configuration automatique des DNS
await configureDomainDNS('mon-site.com', 'https://site.vercel.app')
```

## 📊 Monitoring et gestion

### 1. Statuts de déploiement
- **`idle`** : Aucun déploiement
- **`deploying`** : Déploiement en cours
- **`success`** : Déploiement réussi
- **`error`** : Erreur de déploiement

### 2. Gestion des domaines
- ✅ Renouvellement automatique
- ✅ Transfert de propriété
- ✅ Configuration DNS
- ✅ Monitoring SSL

### 3. Facturation
- ✅ Paiements automatiques
- ✅ Factures détaillées
- ✅ Gestion des remboursements

## 🛡️ Sécurité

### 1. Validation des domaines
```typescript
const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/
if (!domainRegex.test(domain)) {
  throw new Error('Invalid domain format')
}
```

### 2. Gestion des erreurs
- ✅ Retry automatique
- ✅ Fallback providers
- ✅ Logs détaillés
- ✅ Notifications d'erreur

### 3. Protection des données
- ✅ Chiffrement des informations client
- ✅ Tokens sécurisés
- ✅ Webhooks vérifiés

## 🚀 Déploiement en production

### 1. Variables d'environnement
```bash
# Production
VERCEL_TOKEN="prod_token"
NAMECHEAP_API_KEY="prod_key"
STRIPE_SECRET_KEY="sk_live_..."
```

### 2. Configuration des webhooks
- **Stripe** : `https://votre-domaine.com/api/webhooks/stripe`
- **PayPal** : `https://votre-domaine.com/api/webhooks/paypal`

### 3. Monitoring
- ✅ Logs de déploiement
- ✅ Métriques de performance
- ✅ Alertes d'erreur

## 📈 Optimisations

### 1. Performance
- ✅ Cache des résultats de domaines
- ✅ Déploiement parallèle
- ✅ CDN global

### 2. Coûts
- ✅ Comparaison automatique des prix
- ✅ Négociation des tarifs
- ✅ Optimisation des ressources

### 3. Expérience utilisateur
- ✅ Interface intuitive
- ✅ Feedback en temps réel
- ✅ Gestion des erreurs

## 🔧 Dépannage

### Problèmes courants

1. **Erreur de token Vercel**
   - Vérifiez les permissions du token
   - Régénérez le token si nécessaire

2. **Échec d'achat de domaine**
   - Vérifiez les clés API des providers
   - Vérifiez la disponibilité du domaine

3. **Problème de paiement**
   - Vérifiez les clés Stripe/PayPal
   - Vérifiez les webhooks

4. **Configuration DNS**
   - Vérifiez les nameservers
   - Attendez la propagation DNS

### Support

Pour toute question :
1. Vérifiez les logs de la console
2. Testez les APIs individuellement
3. Consultez la documentation des providers
4. Contactez le support technique

---

**Note** : Ce système est conçu pour être extensible et peut être adapté à d'autres providers selon vos besoins.
