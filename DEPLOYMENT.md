# Guide de déploiement - SiteForge

## Variables d'environnement requises

Pour utiliser la fonctionnalité de déploiement, ajoutez ces variables à votre fichier `.env.local` :

```bash
# Vercel (pour le déploiement)
VERCEL_TOKEN="your-vercel-token"

# Domain APIs (optionnel - pour la vraie recherche de domaines)
NAMECHEAP_API_KEY="your-namecheap-api-key"
NAMECHEAP_USER="your-namecheap-username"

# V0 API (pour la génération de sites)
V0_API_KEY="your-v0-api-key"
```

## Configuration Vercel

1. **Obtenir un token Vercel** :
   - Allez sur [Vercel Dashboard](https://vercel.com/dashboard)
   - Allez dans Settings > Tokens
   - Créez un nouveau token avec les permissions de déploiement

2. **Configurer les domaines personnalisés** :
   - Assurez-vous que votre compte Vercel peut gérer les domaines personnalisés
   - Vérifiez les limites de votre plan Vercel

## Configuration Namecheap (optionnel)

Pour utiliser la vraie API de recherche de domaines :

1. **Créer un compte Namecheap** :
   - Allez sur [Namecheap](https://www.namecheap.com/)
   - Créez un compte développeur

2. **Obtenir les clés API** :
   - Allez dans Account > API Access
   - Activez l'API et obtenez vos clés

## Fonctionnalités

### 🔍 Recherche de domaines
- Recherche en temps réel de domaines disponibles
- Support de multiples TLDs (.com, .fr, .net, .org, .io, etc.)
- Prix en temps réel
- Fallback local si l'API externe n'est pas disponible

### 🚀 Déploiement Vercel
- Déploiement automatique sur Vercel
- Configuration de domaines personnalisés
- Gestion des erreurs et statuts
- Interface utilisateur intuitive

### 💳 Achat de domaines
- Intégration avec des registrars de domaines
- Gestion des paiements
- Configuration automatique des DNS

## Utilisation

1. **Générer un site** avec SiteForge
2. **Cliquer sur "Déployer"** dans le panneau de prévisualisation
3. **Rechercher un nom de domaine** disponible
4. **Sélectionner le domaine** souhaité
5. **Lancer le déploiement** - le site sera déployé automatiquement

## Architecture

```
/api/deploy          - API de déploiement principal
/api/domains/search  - API de recherche de domaines
/components/chat/deploy-modal.tsx - Interface utilisateur
```

## Sécurité

- Validation des domaines
- Vérification des permissions Vercel
- Gestion sécurisée des tokens API
- Logs de déploiement

## Monitoring

- Statuts de déploiement en temps réel
- Gestion des erreurs
- Notifications de succès/échec
- Historique des déploiements
