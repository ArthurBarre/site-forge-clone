# Vercel Project Manager

Un script Node.js pour gérer vos projets Vercel avec une interface interactive.

## 🚀 Fonctionnalités

- **Lister tous vos projets Vercel**
- **Sélection multiple** avec interface interactive
- **Suppression en lot** avec confirmation
- **Affichage détaillé** des informations de projet
- **Gestion d'erreurs** robuste

## 📋 Prérequis

1. **Token Vercel** : Vous devez avoir un token Vercel valide
2. **Variables d'environnement** : Définir `VERCEL_TOKEN`

## 🔧 Installation

```bash
# Les dépendances sont déjà installées
pnpm install
```

## 🎯 Utilisation

### 1. Configurer le token Vercel

```bash
# Option 1: Variable d'environnement temporaire
export VERCEL_TOKEN=your_vercel_token_here

# Option 2: Créer un fichier .env.local
echo "VERCEL_TOKEN=your_vercel_token_here" >> .env.local
```

### 2. Lancer le script

```bash
# Via npm script (recommandé)
pnpm vercel:manage

# Ou directement
node scripts/vercel-project-manager.js
```

## 🎨 Interface

Le script affiche :

- **Liste des projets** avec détails (nom, ID, framework, dates)
- **Sélection multiple** avec checkboxes
- **Confirmation** avant suppression
- **Résumé** des opérations (succès/échecs)

## 📊 Exemple de sortie

```
🚀 Vercel Project Manager
This tool helps you manage your Vercel projects

🔍 Fetching Vercel projects...
📦 Found 3 project(s)

1. my-awesome-app
   ID: prj_abc123
   Framework: Next.js
   Created: 12/01/2024
   Updated: 15/01/2024

2. portfolio-site
   ID: prj_def456
   Framework: React
   Created: 10/01/2024

? Select projects to delete: (Press <space> to select, <a> to toggle all, <i> to invert selection)
❯◯ my-awesome-app (prj_abc123)
 ◯ portfolio-site (prj_def456)

? Are you sure you want to delete 1 project(s)? (y/N)
```

## ⚠️ Sécurité

- **Confirmation obligatoire** avant suppression
- **Affichage des détails** pour éviter les erreurs
- **Gestion d'erreurs** pour chaque opération
- **Résumé détaillé** des résultats

## 🛠️ Personnalisation

Vous pouvez modifier le script pour :

- **Filtrer par framework** (Next.js, React, etc.)
- **Filtrer par date** (projets anciens)
- **Ajouter d'autres opérations** (renommer, archiver, etc.)
- **Exporter la liste** en CSV/JSON

## 🐛 Dépannage

### Erreur "VERCEL_TOKEN required"
```bash
# Vérifier que le token est défini
echo $VERCEL_TOKEN

# Redéfinir si nécessaire
export VERCEL_TOKEN=your_token_here
```

### Erreur "No projects found"
- Vérifier que le token est valide
- Vérifier que vous avez des projets sur Vercel
- Vérifier les permissions du token

### Erreur de suppression
- Certains projets peuvent être protégés
- Vérifier les permissions du token
- Vérifier que le projet n'est pas en cours d'utilisation
