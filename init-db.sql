-- Script d'initialisation pour donner tous les droits à l'utilisateur postgres
-- Ce script s'exécute automatiquement au premier démarrage du conteneur

-- Donner tous les privilèges sur la base de données
GRANT ALL PRIVILEGES ON DATABASE myv0clone TO postgres;

-- Se connecter à la base de données et donner tous les droits sur le schéma public
\c myv0clone;

-- Donner tous les privilèges sur le schéma public
GRANT ALL ON SCHEMA public TO postgres;

-- Donner tous les privilèges sur toutes les tables existantes et futures
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO postgres;

-- Configurer les privilèges par défaut pour les futures tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;

-- S'assurer que l'utilisateur postgres est superuser
ALTER USER postgres WITH SUPERUSER CREATEDB CREATEROLE;
