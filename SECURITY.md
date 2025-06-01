# Security Guidelines

## 🔒 Security Measures Implemented

### API Key Protection
- **Environment Variables**: All OpenAI API keys are stored in environment variables, never hardcoded
- **Validation**: API routes validate that `OPENAI_API_KEY` exists before processing requests
- **Error Handling**: Secure error messages that don't expose sensitive information
- **Client-side Storage**: Mobile app stores API keys securely using device keychain/keystore

### API Route Security

#### Input Validation
- **Request Body Validation**: All API routes validate incoming data format and types
- **File Upload Limits**: Audio files limited to 25MB (OpenAI's maximum)
- **File Type Validation**: Only allowed audio formats accepted (wav, mp3, m4a, webm)
- **Content Sanitization**: User input is validated before processing

#### Error Handling
- **Secure Error Messages**: Generic error messages to prevent information leakage
- **Logging**: Detailed errors logged server-side, generic messages returned to client
- **Status Codes**: Appropriate HTTP status codes for different error types

### Data Protection

#### Local Storage
- **SQLite Encryption**: Database can be encrypted for sensitive data
- **Secure Storage**: API keys stored using platform-specific secure storage
- **Data Validation**: All data validated before storage

#### Network Security
- **HTTPS Only**: All API calls use HTTPS encryption
- **Request Headers**: Proper authorization headers for API calls
- **Rate Limiting**: Can be implemented to prevent abuse

## 🛡️ Security Best Practices

### Environment Configuration

1. **Never commit `.env` files** to version control
2. **Use `.env.local.example`** as a template for required variables
3. **Rotate API keys** regularly
4. **Use different keys** for development and production

### API Key Management

```bash
# ✅ Correct - Using environment variables
OPENAI_API_KEY=your_actual_api_key_here

# ❌ Wrong - Never hardcode in source code
const apiKey = "sk-1234567890abcdef"
```

### Code Examples

#### Secure API Route Pattern
```typescript
export async function POST(req: Request) {
  try {
    // 1. Validate environment variables
    if (!process.env.OPENAI_API_KEY) {
      return Response.json({ error: "Service unavailable" }, { status: 500 })
    }

    // 2. Validate input
    const { content } = await req.json()
    if (!content || typeof content !== 'string') {
      return Response.json({ error: "Invalid input" }, { status: 400 })
    }

    // 3. Use secure configuration
    const client = openai({
      apiKey: process.env.OPENAI_API_KEY,
    })

    // 4. Process request...
    
  } catch (error) {
    // 5. Secure error handling
    console.error("API Error:", error)
    return Response.json({ error: "Processing failed" }, { status: 500 })
  }
}
```

## 🚨 Security Checklist

### Development
- [ ] API keys stored in environment variables
- [ ] `.env` files added to `.gitignore`
- [ ] Input validation on all endpoints
- [ ] Secure error handling implemented
- [ ] File upload restrictions in place

### Deployment
- [ ] Environment variables configured in production
- [ ] HTTPS enabled for all endpoints
- [ ] Rate limiting configured
- [ ] Monitoring and logging enabled
- [ ] Regular security updates scheduled

### Mobile App
- [ ] API keys stored in secure storage
- [ ] Network requests use HTTPS
- [ ] User input sanitized
- [ ] Sensitive data encrypted locally
- [ ] App permissions minimized

## 🔧 Configuration Files

### Required Environment Variables
```bash
# Core Configuration
OPENAI_API_KEY=your_openai_api_key_here
NODE_ENV=production

# Optional Security Enhancements
JWT_SECRET=your_jwt_secret_here
ENCRYPTION_KEY=your_encryption_key_here
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MS=900000
```

### Recommended .gitignore Additions
```
# Environment files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# API keys and secrets
*.key
*.pem
secrets/
```

## 🚀 Production Deployment

### Environment Setup
1. **Use secure environment variable management**
   - Vercel: Environment Variables in dashboard
   - Netlify: Site settings > Environment variables
   - AWS: Systems Manager Parameter Store
   - Docker: Secrets management

2. **Enable security headers**
   ```typescript
   // next.config.js
   const securityHeaders = [
     {
       key: 'X-Content-Type-Options',
       value: 'nosniff'
     },
     {
       key: 'X-Frame-Options',
       value: 'DENY'
     },
     {
       key: 'X-XSS-Protection',
       value: '1; mode=block'
     }
   ]
   ```

### Monitoring
- **Error tracking**: Implement error monitoring (Sentry, LogRocket)
- **API monitoring**: Track API usage and errors
- **Security scanning**: Regular dependency vulnerability scans
- **Access logging**: Log all API access attempts

## 📞 Security Incident Response

### If API Key is Compromised
1. **Immediately revoke** the compromised key in OpenAI dashboard
2. **Generate new API key** and update environment variables
3. **Review logs** for unauthorized usage
4. **Update all deployments** with new key
5. **Monitor usage** for any anomalies

### Reporting Security Issues
- **Email**: security@ainoteorganizer.com
- **Response time**: 24-48 hours
- **Disclosure**: Responsible disclosure policy

## 🔄 Regular Security Maintenance

### Monthly Tasks
- [ ] Review API usage and costs
- [ ] Check for dependency updates
- [ ] Rotate API keys if needed
- [ ] Review access logs

### Quarterly Tasks
- [ ] Security audit of codebase
- [ ] Penetration testing
- [ ] Update security documentation
- [ ] Review and update permissions

---

**Security is an ongoing process. This document should be reviewed and updated regularly as the application evolves.** 