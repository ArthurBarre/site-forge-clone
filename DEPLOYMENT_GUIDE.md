# 🚀 Guide de déploiement - SiteForge

## Vue d'ensemble

Le système de déploiement de SiteForge permet aux utilisateurs de :
- 🔍 **Rechercher des noms de domaine** disponibles
- 💳 **Acheter des domaines** automatiquement
- 🌐 **Déployer sur Vercel** avec domaine personnalisé
- 📊 **Gérer les déploiements** depuis l'interface

## Fonctionnalités

### 1. Recherche de domaines
- **API intégrée** : `/api/domains/search`
- **TLDs supportés** : .com, .fr, .net, .org, .io, .co, .app, .dev, etc.
- **Prix en temps réel** : Affichage des coûts par TLD
- **Fallback local** : Simulation si l'API externe n'est pas disponible

### 2. Déploiement Vercel
- **API de déploiement** : `/api/deploy`
- **Configuration automatique** des domaines personnalisés
- **Gestion des erreurs** et statuts de déploiement
- **Intégration Vercel** : Utilisation de l'API Vercel officielle

### 3. Interface utilisateur
- **Modal de déploiement** : Interface intuitive pour la recherche et le déploiement
- **Onglets** : Aperçu et Déploiements séparés
- **Statuts en temps réel** : Suivi du processus de déploiement
- **Gestion des déploiements** : Liste, suppression, accès direct

## Configuration

### Variables d'environnement

```bash
# Vercel (obligatoire pour le déploiement)
VERCEL_TOKEN="your-vercel-token"

# Namecheap (optionnel - pour la vraie recherche de domaines)
NAMECHEAP_API_KEY="your-namecheap-api-key"
NAMECHEAP_USER="your-namecheap-username"

# V0 API (pour la génération de sites)
V0_API_KEY="your-v0-api-key"
```

### Obtenir un token Vercel

1. Allez sur [Vercel Dashboard](https://vercel.com/dashboard)
2. Naviguez vers **Settings** > **Tokens**
3. Cliquez sur **Create Token**
4. Donnez un nom au token (ex: "SiteForge Deploy")
5. Sélectionnez les permissions nécessaires :
   - ✅ **Deployments** (lecture/écriture)
   - ✅ **Projects** (lecture/écriture)
   - ✅ **Domains** (lecture/écriture)
6. Copiez le token généré

### Configuration Namecheap (optionnel)

Pour utiliser la vraie API de recherche de domaines :

1. Créez un compte sur [Namecheap](https://www.namecheap.com/)
2. Allez dans **Account** > **API Access**
3. Activez l'API et obtenez vos clés
4. Ajoutez les variables d'environnement

## Utilisation

### 1. Générer un site
```typescript
// L'utilisateur génère un site via le chat
// Le site est créé avec une URL de démo
const chat = {
  id: "chat_123",
  demo: "https://demo.example.com",
  // ...
}
```

### 2. Déployer le site
```typescript
// L'utilisateur clique sur "Déployer"
// 1. Recherche de domaines disponibles
// 2. Sélection d'un domaine
// 3. Achat automatique du domaine
// 4. Déploiement sur Vercel
// 5. Configuration du domaine personnalisé
```

### 3. Gérer les déploiements
```typescript
// Interface de gestion
// - Voir tous les déploiements
// - Accéder aux sites déployés
// - Supprimer des déploiements
// - Voir les statuts
```

## Architecture technique

### APIs créées

```
/api/deploy                    - Déploiement principal
/api/domains/search           - Recherche de domaines
/api/deployments/[chatId]     - Gestion des déploiements
/api/deployments/[deploymentId] - Suppression de déploiements
```

### Composants React

```
components/chat/
├── deploy-modal.tsx          - Modal de déploiement
├── deployment-list.tsx       - Liste des déploiements
├── deployment-status.tsx     - Statut de déploiement
└── preview-panel.tsx         - Panneau avec onglets
```

### Flux de déploiement

```mermaid
graph TD
    A[Utilisateur clique "Déployer"] --> B[Recherche de domaines]
    B --> C[Sélection du domaine]
    C --> D[Achat du domaine]
    D --> E[Création projet Vercel]
    E --> F[Déploiement du code]
    F --> G[Configuration domaine]
    G --> H[Site accessible]
```

## Sécurité

### Validation des domaines
```typescript
const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/
if (!domainRegex.test(domain)) {
  throw new Error('Invalid domain format')
}
```

### Gestion des erreurs
- **Validation des paramètres** : Vérification des données d'entrée
- **Gestion des erreurs API** : Fallback en cas d'échec
- **Logs de déploiement** : Traçabilité complète
- **Rollback automatique** : Annulation en cas d'erreur

## Monitoring

### Statuts de déploiement
- **`idle`** : Aucun déploiement en cours
- **`deploying`** : Déploiement en cours
- **`success`** : Déploiement réussi
- **`error`** : Erreur de déploiement

### Notifications
- **Succès** : Confirmation avec URL du site
- **Erreur** : Message d'erreur avec possibilité de retry
- **Progression** : Indicateurs de chargement

## Développement

### Tests locaux
```bash
# Tester la recherche de domaines
curl -X POST http://localhost:3000/api/domains/search \
  -H "Content-Type: application/json" \
  -d '{"query": "mon-site"}'

# Tester le déploiement
curl -X POST http://localhost:3000/api/deploy \
  -H "Content-Type: application/json" \
  -d '{"domain": "mon-site.com", "chatId": "chat_123", "demoUrl": "https://demo.example.com"}'
```

### Debugging
- **Logs détaillés** : Console logs pour chaque étape
- **Statuts visuels** : Interface utilisateur claire
- **Gestion d'erreurs** : Messages d'erreur explicites

## Prochaines étapes

### Améliorations possibles
1. **Intégration DNS** : Configuration automatique des DNS
2. **SSL automatique** : Certificats SSL automatiques
3. **CDN** : Distribution de contenu global
4. **Monitoring** : Surveillance des performances
5. **Backup** : Sauvegarde automatique des sites

### APIs supplémentaires
- **Analytics** : Statistiques de visite
- **SEO** : Optimisation pour les moteurs de recherche
- **Performance** : Optimisation des performances
- **Security** : Sécurité avancée

## Support

Pour toute question ou problème :
1. Vérifiez les logs de la console
2. Vérifiez les variables d'environnement
3. Testez les APIs individuellement
4. Consultez la documentation Vercel/Namecheap

---

**Note** : Ce système est conçu pour être extensible et peut être adapté à d'autres providers de domaines et de déploiement.
