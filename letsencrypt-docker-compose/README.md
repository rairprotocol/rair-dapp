# Nginx and Let’s Encrypt with Docker Compose in less than 3 minutes

This example automatically obtains and renews [Let's Encrypt](https://letsencrypt.org/) TLS certificates and set up HTTPS in Nginx for multiple domain names using Docker Compose.

You can set up HTTPS in Nginx with Let's Encrypt TLS certificates for your domain names and get A+ rating at [SSL Labs SSL Server Test](https://www.ssllabs.com/ssltest/) by changing a few configuration parameters of this example.

Let's Encrypt is a certificate authority that provides free X.509 certificates for TLS encryption.
The certificates are valid for 90 days and can be renewed. Both initial creation and renewal can be automated using [Certbot](https://certbot.eff.org/).

When using Kubernetes Let's Encrypt TLS certificates can be easily obtained and installed using [Cert Manager](https://cert-manager.io/).
For simple web sites and applications Kubernetes is too much overhead and Docker Compose is more suitable.
But for Docker Compose there is no such popular and robust tool for TLS certificate management.

The example supports separate TLS certificates for multiple domain names, e.g. example.com, anotherdomain.net etc.
For simplicity this example deals with the following domain names:

* test1.devcomanda.com
* test2.devcomanda.com

The idea is simple. There are 3 containers: 

* Nginx
* Certbot - for obtaining and renewing certificates
* Cron - for triggering certificates renewal once a day

The sequence of actions:

* Nginx generates self-signed "dummy" certificates to pass ACME challenge for obtaining Let's Encrypt certificates
* Certbot waits for Nginx to become ready and obtains certificates
* Cron triggers Certbot to try to renew certificates and Nginx to reload configuration on a daily basis

The directories and files:

* `docker-compose.yml`
* `.env` - specifies `COMPOSE_PROJECT_NAME` to make container names independent from the base directory name
* `config.env` - specifies project configuration, e.g. domain names, emails etc.
* `html/` - directory mounted as `root` for Nginx
    * `index.html`
* `nginx/`
    * `Dockerfile`
    * `nginx.sh` - entrypoint script
    * `hsts.conf` - HTTP Strict Transport Security (HSTS) policy
    * `default.conf` - Nginx configuration for all domains. Contains a configuration to get A+ rating at [SSL Server Test](https://www.ssllabs.com/ssltest/)
* `certbot/`
    * `Dockerfile`
    * `certbot.sh` - entrypoint script
* `cron/`
    * `Dockerfile`
    * `renew_certs.sh` - script executed on a daily basis to try to renew certificates

To adapt the example to your domain names you need to change only `config.env`:

```properties
DOMAINS=test1.devcomanda.com test2.devcomanda.com
CERTBOT_EMAILS=info@devcomanda.com info@devcomanda.com
CERTBOT_TEST_CERT=1
CERTBOT_RSA_KEY_SIZE=4096
```

Configuration parameters:

* `DOMAINS` - a space separated list of domains to manage certificates for
* `CERTBOT_EMAILS` - a space separated list of email for corresponding domains. If not specified, certificates will be obtained with `--register-unsafely-without-email`
* `CERTBOT_TEST_CERT` - use Let's Encrypt staging server (`--test-cert`)

Let's Encrypt has rate limits. So, while testing it's better to use staging server by setting `CERTBOT_TEST_CERT=1` (default value).
When you are ready to use production Let's Encrypt server, set `CERTBOT_TEST_CERT=0`.

## Prerequisites

1. [Docker](https://docs.docker.com/install/) and [Docker Compose](https://docs.docker.com/compose/install/) are installed
2. You have a domain name
3. You have a server with a publicly routable IP address
4. You have cloned this repository
   ```bash
   git clone https://github.com/evgeniy-khist/letsencrypt-docker-compose.git
   ```

## Step 0 - Point your domain to server with DNS A records

For all domain names configure DNS A records to point to a server where Docker containers will be running.

## Step 1 - Edit domain names and emails in the configuration

Specify you domain names and contact emails for these domains in the `config.env`:

```properties
DOMAINS=test1.devcomanda.com test2.devcomanda.com
CERTBOT_EMAILS=info@devcomanda.com info@devcomanda.com
```

## Step 2 - Create named Docker volumes for dummy and Let's Encrypt TLS certificates

```bash
docker volume create --name=devcomanda_nginx_ssl
docker volume create --name=devcomanda_certbot_certs
```

## Step 3 - Build images and start containers

```bash
docker-compose up --build
```

## Step 4 - Switch to production Let's Encrypt server after verifying HTTPS works with test certificates

Stop the containers:

```bash
docker-compose down
```

Configure to use production Let's Encrypt server in `config.env`:

```properties
CERTBOT_TEST_CERT=0
```

Re-create the volume for Let's Encrypt certificates:

```bash
docker volume rm devcomanda_certbot_certs
docker volume create --name=devcomanda_certbot_certs
```

Start the containers:

```bash
docker-compose up
```
