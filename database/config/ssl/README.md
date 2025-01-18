# SSL Certificates Information

⚠️ **IMPORTANT NOTICE** ⚠️

These SSL certificates and private keys are for **TESTING AND DEVELOPMENT PURPOSES ONLY**.
They are not meant for production use and do not provide real security in a production environment.

## Contents
- All certificates in this directory are self-signed test certificates
- They are included in the repository for development convenience
- These certificates should be replaced with real, valid certificates in production

## Directory Structure
```
ssl/
├── server.crt    # Self-signed certificate for development
├── server.key    # Private key for development
└── README.md     # This file
```

## Security Warning
- Never use these certificates in a production environment
- Real SSL certificates should be obtained from a trusted Certificate Authority
- Keep production SSL private keys secure and never commit them to version control
- These test certificates are only for local development (localhost)

## For Production Use
1. Obtain real SSL certificates from a trusted Certificate Authority (like Let's Encrypt)
2. Replace the following files:
   - `server.crt` with your production certificate
   - `server.key` with your production private key
3. Ensure proper security measures:
   - Set correct file permissions (600 for private keys)
   - Keep backups of your certificates
   - Monitor certificate expiration dates
   - Set up automatic renewal if using Let's Encrypt

## Development Setup
For local development, these certificates are pre-configured to work with:
- Database connection on localhost
- Docker containers using internal network
- Development environment on `localhost` or `127.0.0.1`

## Certificate Generation
If you need to regenerate these development certificates:
```bash
# Generate new self-signed certificate
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout server.key -out server.crt \
  -subj "/CN=localhost"
