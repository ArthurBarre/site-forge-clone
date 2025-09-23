# Configuration de la base de données PostgreSQL

## Démarrage rapide

### 1. Démarrer le service PostgreSQL
```bash
./start-db.sh
```

### 2. Configuration de l'environnement
Ajoutez cette variable à votre fichier `.env` :
```
POSTGRES_URL=postgresql://postgres:postgres@localhost:5432/myv0clone
```

## Informations de connexion

- **Host**: localhost
- **Port**: 5432
- **Database**: myv0clone
- **Username**: postgres
- **Password**: postgres
- **URL complète**: `postgresql://postgres:postgres@localhost:5432/myv0clone`

## Commandes utiles

### Gestion du service
```bash
# Démarrer
docker-compose up -d postgres

# Arrêter
docker-compose down

# Voir les logs
docker-compose logs postgres

# Redémarrer
docker-compose restart postgres
```

### Connexion à la base de données
```bash
# Via Docker
docker-compose exec postgres psql -U postgres -d myv0clone

# Via psql local (si installé)
psql postgresql://postgres:postgres@localhost:5432/myv0clone
```

### Migration de la base de données
```bash
# Générer les migrations
npm run db:generate

# Appliquer les migrations
npm run db:migrate

# Interface Drizzle Studio
npm run db:studio
```

## Droits et permissions

Le service PostgreSQL est configuré avec tous les droits nécessaires :
- Superuser privileges
- Création de bases de données
- Création de rôles
- Tous les privilèges sur le schéma public
- Accès complet aux tables, séquences et fonctions

## Persistance des données

Les données sont persistées dans un volume Docker nommé `postgres_data`. Pour supprimer complètement les données :

```bash
docker-compose down -v
```

## Dépannage

### Le service ne démarre pas
```bash
# Vérifier les logs
docker-compose logs postgres

# Vérifier l'état des conteneurs
docker-compose ps
```

### Port déjà utilisé
Si le port 5432 est déjà utilisé, modifiez le port dans `docker-compose.yml` :
```yaml
ports:
  - "5433:5432"  # Utilisez le port 5433 au lieu de 5432
```

Puis mettez à jour votre `POSTGRES_URL` :
```
POSTGRES_URL=postgresql://postgres:postgres@localhost:5433/myv0clone
```

