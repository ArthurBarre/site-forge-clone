#!/bin/bash

# Script pour démarrer le service PostgreSQL avec Docker Compose

echo "🚀 Démarrage du service PostgreSQL..."

# Démarrer le service
docker-compose up -d postgres

# Attendre que le service soit prêt
echo "⏳ Attente que PostgreSQL soit prêt..."
sleep 5

# Vérifier que le service fonctionne
if docker-compose ps postgres | grep -q "Up"; then
    echo "✅ PostgreSQL est démarré et prêt !"
    echo ""
    echo "📋 Informations de connexion :"
    echo "   Host: localhost"
    echo "   Port: 5432"
    echo "   Database: myv0clone"
    echo "   Username: postgres"
    echo "   Password: postgres"
    echo ""
    echo "🔗 POSTGRES_URL:"
    echo "   postgresql://postgres:postgres@localhost:5432/myv0clone"
    echo ""
    echo "🛠️  Commandes utiles :"
    echo "   Arrêter: docker-compose down"
    echo "   Voir les logs: docker-compose logs postgres"
    echo "   Se connecter: docker-compose exec postgres psql -U postgres -d myv0clone"
else
    echo "❌ Erreur lors du démarrage de PostgreSQL"
    echo "Vérifiez les logs avec: docker-compose logs postgres"
    exit 1
fi
