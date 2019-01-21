# happyfoodhole.com

## Environment Setup

**You must have PHP installed locally.**

1. Run the setup script: `bash ./setup.sh`

## Run Development Site
1. Run: `vagrant up`

## Run Migrations

1. Run migrations: `vendor/bin/phinx migrate`

## Deploys
1. `gulp --production`
2. commit + push
3. pull on superrhino

### Connect to DB

1. on superrhino: `sudo mysql -u <dbuser> -p`
