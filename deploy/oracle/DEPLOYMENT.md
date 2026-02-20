# Oracle Deployment (Isolated)

This folder contains production deployment files for the Oracle VM only.

## Local Development

Local development is unchanged and does not require anything in this folder.

## VM First Deploy

On the Oracle VM:

```bash
sudo mkdir -p /opt/teamproject36
sudo chown -R $USER:$USER /opt/teamproject36
cd /opt/teamproject36
git clone <your-repo-url> .
cp deploy/oracle/.env.prod.example deploy/oracle/.env.prod
nano deploy/oracle/.env.prod
docker compose -f deploy/oracle/docker-compose.prod.yml --env-file deploy/oracle/.env.prod up -d --build
```

## Verify

```bash
curl http://localhost/api/health
```

Use your VM public IP in browser for the frontend.

## Optional GitLab Auto-Deploy from `main`

Add this include to your active CI file (root or existing pipeline file):

```yaml
include:
  - local: 'deploy/oracle/gitlab-ci.deploy.yml'
```

Required CI variables:

- `DEPLOY_SERVER_HOST`
- `DEPLOY_SERVER_USER`
- `DEPLOY_SSH_PRIVATE_KEY`
