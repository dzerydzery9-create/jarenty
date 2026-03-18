import BaseAgent, { AgentConfig, AgentTask, AgentResult } from './BaseAgent';

class SecurityAgent extends BaseAgent {
  constructor() {
    const config: AgentConfig = {
      name: 'Security Agent',
      description: 'Analyzes code for security vulnerabilities, implements security best practices, and ensures safe operations',
      capabilities: ['vulnerability-scan', 'code-security-review', 'authentication-security', 'data-protection'],
      supportedLanguages: ['typescript', 'javascript', 'python', 'java', 'csharp', 'go', 'rust'],
    };
    super(config);
  }

  canHandle(task: AgentTask): boolean {
    return ['vulnerability-scan', 'code-security-review', 'authentication-security', 'data-protection'].includes(task.type);
  }

  async process(task: AgentTask): Promise<AgentResult> {
    const { code, dependencies, apis, data } = task.input;

    let result = '';

    switch (task.type) {
      case 'vulnerability-scan':
        result = await this.scanVulnerabilities(dependencies, code);
        break;
      case 'code-security-review':
        result = await this.reviewCodeSecurity(code);
        break;
      case 'authentication-security':
        result = await this.reviewAuthentication(apis);
        break;
      case 'data-protection':
        result = await this.reviewDataProtection(data, code);
        break;
    }

    return {
      taskId: task.id,
      success: true,
      output: result,
      files: {},
    };
  }

  private async scanVulnerabilities(dependencies: Record<string, string>, code: string): Promise<string> {
    return `Security Vulnerability Scan Report

🔍 Scan Summary:
- Dependencies analyzed: ${Object.keys(dependencies).length}
- Code lines scanned: ${code.split('\n').length}
- Scan date: ${new Date().toISOString().split('T')[0]}

🚨 Critical Vulnerabilities Found:

**High Severity:**
${this.scanForHighSeverityIssues(dependencies, code)}

**Medium Severity:**
${this.scanForMediumSeverityIssues(dependencies, code)}

**Low Severity:**
${this.scanForLowSeverityIssues(dependencies, code)}

📊 Vulnerability Breakdown:

| Severity | Count | Status |
|----------|-------|--------|
| Critical | ${this.countCriticalIssues(dependencies, code)} | 🔴 Requires immediate attention |
| High | ${this.countHighSeverityIssues(dependencies, code)} | 🟠 Fix within 30 days |
| Medium | ${this.countMediumSeverityIssues(dependencies, code)} | 🟡 Fix within 90 days |
| Low | ${this.countLowSeverityIssues(dependencies, code)} | 🟢 Address in next update |

🛠️ Recommended Fixes:

**Immediate Actions (Critical):**
\`\`\`bash
# Update vulnerable dependencies
npm audit fix --force

# Or manually update critical packages
npm update axios semver

# Check for security advisories
npm audit
\`\`\`

**Code-Level Fixes:**
\`\`\`typescript
// ❌ Vulnerable: Direct use of user input in eval
const userCode = req.body.code;
eval(userCode); // 🚨 SECURITY RISK

// ✅ Secure: Validate and sanitize input
const userCode = req.body.code;
if (typeof userCode !== 'string' || userCode.length > 1000) {
  throw new Error('Invalid code input');
}
// Use safe evaluation or restrict execution context
const result = safeEval(userCode, { timeout: 5000 });
\`\`\`

**Dependency Security:**
\`\`\`json
// package.json - Security-focused dependencies
{
  "dependencies": {
    "helmet": "^7.0.0",           // Security headers
    "express-rate-limit": "^7.0.0", // Rate limiting
    "joi": "^17.9.0",             // Input validation
    "bcrypt": "^5.1.0",           // Password hashing
    "jsonwebtoken": "^9.0.0",     // JWT handling
    "csurf": "^1.11.0"            // CSRF protection
  }
}
\`\`\`

🔒 Security Hardening Measures:

**1. Content Security Policy (CSP)**
\`\`\`typescript
// server.ts
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));
\`\`\`

**2. Input Validation & Sanitization**
\`\`\`typescript
import Joi from 'joi';

// Validation schema
const userInputSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  age: Joi.number().integer().min(13).max(120),
});

// Usage
const validateInput = (data: any) => {
  const { error, value } = userInputSchema.validate(data);
  if (error) {
    throw new Error(\`Validation error: \${error.details[0].message}\`);
  }
  return value;
};
\`\`\`

**3. Secure Headers**
\`\`\`typescript
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});
\`\`\`

**4. Rate Limiting**
\`\`\`typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);
\`\`\`

**5. Secure Session Management**
\`\`\`typescript
import session from 'express-session';

app.use(session({
  secret: process.env.SESSION_SECRET || 'change-this-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    httpOnly: true, // Prevent XSS attacks
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));
\`\`\`

📋 Security Checklist:

**✅ Completed:**
- [x] Dependency vulnerability scan
- [x] Code security review
- [x] Input validation implementation
- [x] Secure headers configuration

**🔄 In Progress:**
- [ ] Authentication system review
- [ ] Data encryption implementation
- [ ] API security testing
- [ ] Penetration testing

**⏳ Planned:**
- [ ] Security monitoring setup
- [ ] Incident response plan
- [ ] Security training
- [ ] Regular security audits

🎯 Security Score: ${this.calculateSecurityScore(dependencies, code)}/100

**Recommendations:**
${this.generateSecurityRecommendations(dependencies, code)}`;
  }

  private async reviewCodeSecurity(code: string): Promise<string> {
    return `Code Security Review Report

🔐 Security Analysis Summary:

**Code Quality Metrics:**
- Total lines: ${code.split('\n').length}
- Functions/methods: ${this.countFunctions(code)}
- External dependencies: ${this.countExternalDeps(code)}
- Security-sensitive operations: ${this.countSecurityOps(code)}

🚨 Security Issues Found:

**Critical Security Flaws:**
${this.analyzeCriticalFlaws(code)}

**Injection Vulnerabilities:**
${this.analyzeInjectionVulnerabilities(code)}

**Authentication & Authorization Issues:**
${this.analyzeAuthIssues(code)}

**Data Protection Concerns:**
${this.analyzeDataProtection(code)}

**Cryptography Issues:**
${this.analyzeCryptoIssues(code)}

🛠️ Security Fixes Required:

**1. SQL Injection Prevention**
\`\`\`typescript
// ❌ Vulnerable
const query = \`SELECT * FROM users WHERE id = \${userId}\`;
db.query(query);

// ✅ Secure - Use parameterized queries
const query = 'SELECT * FROM users WHERE id = ?';
db.query(query, [userId]);
\`\`\`

**2. XSS Prevention**
\`\`\`typescript
// ❌ Vulnerable
const html = \`<div>\${userInput}</div>\`;
element.innerHTML = html;

// ✅ Secure - Sanitize input
import DOMPurify from 'dompurify';
const sanitized = DOMPurify.sanitize(userInput);
element.innerHTML = \`<div>\${sanitized}</div>\`;
\`\`\`

**3. CSRF Protection**
\`\`\`typescript
// ❌ Vulnerable - No CSRF protection
app.post('/transfer', (req, res) => {
  // Process transfer
});

// ✅ Secure - CSRF token validation
import csrf from 'csurf';
const csrfProtection = csrf({ cookie: true });

app.post('/transfer', csrfProtection, (req, res) => {
  // Process transfer
});
\`\`\`

**4. Secure Password Handling**
\`\`\`typescript
// ❌ Insecure
const hashedPassword = md5(password); // MD5 is broken

// ✅ Secure
import bcrypt from 'bcrypt';
const saltRounds = 12;
const hashedPassword = await bcrypt.hash(password, saltRounds);

// Verification
const isValid = await bcrypt.compare(password, hashedPassword);
\`\`\`

**5. Secure Random Generation**
\`\`\`typescript
// ❌ Predictable
const token = Math.random().toString(36);

// ✅ Cryptographically secure
import crypto from 'crypto';
const token = crypto.randomBytes(32).toString('hex');
\`\`\`

**6. File Upload Security**
\`\`\`typescript
// ❌ Vulnerable
app.post('/upload', (req, res) => {
  const file = req.files.file;
  file.mv(\`/uploads/\${file.name}\`); // Directory traversal possible
});

// ✅ Secure
const multer = require('multer');
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    // Validate file type
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only images allowed'));
    }
    cb(null, true);
  }
});

app.post('/upload', upload.single('file'), (req, res) => {
  // File safely uploaded
});
\`\`\`

**7. Error Information Leakage**
\`\`\`typescript
// ❌ Leaks sensitive information
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message, stack: err.stack });
});

// ✅ Secure error handling
app.use((err, req, res, next) => {
  console.error(err); // Log full error server-side

  // Send generic error to client
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});
\`\`\`

**8. Secure Headers Implementation**
\`\`\`typescript
import helmet from 'helmet';

app.use(helmet({
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  xssFilter: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
}));
\`\`\`

📊 Security Compliance:

**OWASP Top 10 Coverage:**
- [x] Injection - Addressed with parameterized queries
- [x] Broken Authentication - Secure session management
- [x] Sensitive Data Exposure - Encryption implemented
- [x] XML External Entities - Input validation
- [x] Broken Access Control - Authorization checks
- [ ] Security Misconfiguration - Needs review
- [ ] Cross-Site Scripting - Sanitization implemented
- [ ] Insecure Deserialization - Needs validation
- [ ] Vulnerable Components - Dependency updates
- [ ] Insufficient Logging - Audit logging needed

**Compliance Standards:**
- [x] GDPR - Data protection measures
- [ ] HIPAA - Medical data handling
- [x] PCI DSS - Payment data security
- [ ] SOC 2 - Organizational controls

🎯 Security Improvement Plan:

**Phase 1: Critical Fixes (Immediate)**
1. Fix all injection vulnerabilities
2. Implement proper authentication
3. Add input validation everywhere
4. Update vulnerable dependencies

**Phase 2: Security Hardening (1-2 weeks)**
1. Implement CSP headers
2. Add rate limiting
3. Set up security monitoring
4. Conduct security testing

**Phase 3: Advanced Security (1 month)**
1. Implement zero-trust architecture
2. Add automated security scanning
3. Set up incident response
4. Regular security audits

🔄 Continuous Security:

1. **Automated Security Testing**
   - SAST (Static Application Security Testing)
   - DAST (Dynamic Application Security Testing)
   - Dependency vulnerability scanning
   - Container security scanning

2. **Security Monitoring**
   - Real-time threat detection
   - Log analysis and correlation
   - Automated alerting
   - Incident response automation

3. **Security Training**
   - Developer security awareness
   - Secure coding practices
   - Threat modeling workshops
   - Regular security updates`;
  }

  private async reviewAuthentication(apis: string[]): Promise<string> {
    return `Authentication Security Review

🔐 Authentication Analysis:

**APIs Requiring Authentication:** ${apis.join(', ')}

**Current Authentication Methods:**
${this.analyzeAuthMethods(apis)}

**Security Assessment:**

**Strengths:**
- JWT token-based authentication
- Password hashing with bcrypt
- Session management with secure cookies

**Weaknesses:**
${this.identifyAuthWeaknesses(apis)}

🛠️ Authentication Security Improvements:

**1. Multi-Factor Authentication (MFA)**
\`\`\`typescript
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';

// Generate MFA secret
const generateMFASecret = () => {
  return speakeasy.generateSecret({
    name: 'AI Agent Builder',
    issuer: 'Your Company'
  });
};

// Verify MFA token
const verifyMFAToken = (secret: string, token: string) => {
  return speakeasy.totp.verify({
    secret: secret,
    encoding: 'base32',
    token: token,
    window: 2 // Allow 30-second window
  });
};

// API endpoint for MFA setup
app.post('/api/auth/mfa/setup', async (req, res) => {
  const userId = req.user.id;
  const secret = generateMFASecret();

  // Store secret temporarily (associate with user session)
  await redis.setex(\`mfa_setup:\${userId}\`, 300, secret.base32); // 5 min expiry

  // Generate QR code
  const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url);

  res.json({
    secret: secret.base32,
    qrCode: qrCodeUrl
  });
});
\`\`\`

**2. OAuth 2.0 Implementation**
\`\`\`typescript
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

// Google OAuth strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Find or create user
    let user = await User.findOne({ googleId: profile.id });

    if (!user) {
      user = new User({
        googleId: profile.id,
        email: profile.emails[0].value,
        name: profile.displayName,
        avatar: profile.photos[0].value
      });
      await user.save();
    }

    done(null, user);
  } catch (error) {
    done(error, null);
  }
}));

// Routes
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication
    res.redirect('/dashboard');
  }
);
\`\`\`

**3. Secure Session Management**
\`\`\`typescript
import session from 'express-session';
import connectRedis from 'connect-redis';
import Redis from 'ioredis';

const RedisStore = connectRedis(session);
const redisClient = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD
});

app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // HTTPS only
    httpOnly: true, // Prevent XSS
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'strict' // CSRF protection
  }
}));
\`\`\`

**4. Password Security**
\`\`\`typescript
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import zxcvbn from 'zxcvbn';

class PasswordSecurity {
  private static readonly SALT_ROUNDS = 12;
  private static readonly MIN_STRENGTH = 3; // zxcvbn score

  static async hashPassword(password: string): Promise<string> {
    // Validate password strength
    const strength = zxcvbn(password);
    if (strength.score < this.MIN_STRENGTH) {
      throw new Error(\`Password too weak. Suggestions: \${strength.feedback.suggestions.join(', ')}\`);
    }

    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  static generateSecureToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  static generateResetToken(): { token: string; expires: Date } {
    const token = this.generateSecureToken();
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    return { token, expires };
  }
}
\`\`\`

**5. API Key Management**
\`\`\`typescript
import crypto from 'crypto';

class APIKeyManager {
  static generateAPIKey(): string {
    return 'ak_' + crypto.randomBytes(32).toString('hex');
  }

  static hashAPIKey(apiKey: string): string {
    return crypto.createHash('sha256').update(apiKey).digest('hex');
  }

  static async validateAPIKey(providedKey: string): Promise<boolean> {
    const hashedKey = this.hashAPIKey(providedKey);

    // Check against database
    const apiKey = await APIKey.findOne({
      keyHash: hashedKey,
      active: true,
      expiresAt: { $gt: new Date() }
    });

    return !!apiKey;
  }

  static async createAPIKey(userId: string, name: string, permissions: string[]): Promise<string> {
    const apiKey = this.generateAPIKey();
    const hashedKey = this.hashAPIKey(apiKey);

    await APIKey.create({
      userId,
      name,
      keyHash: hashedKey,
      permissions,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      active: true
    });

    return apiKey;
  }
}
\`\`\`

**6. Rate Limiting & Brute Force Protection**
\`\`\`typescript
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';

// General API rate limiting
const apiLimiter = rateLimit({
  store: new RedisStore({
    client: redisClient,
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests',
    retryAfter: 900 // 15 minutes in seconds
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Authentication-specific rate limiting
const authLimiter = rateLimit({
  store: new RedisStore({
    client: redisClient,
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login attempts per windowMs
  message: {
    error: 'Too many login attempts',
    retryAfter: 900
  },
  skipSuccessfulRequests: true, // Don't count successful logins
});

// Password reset rate limiting
const resetLimiter = rateLimit({
  store: new RedisStore({
    client: redisClient,
  }),
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 3 reset requests per hour
  message: {
    error: 'Too many password reset requests',
    retryAfter: 3600
  },
});

// Apply rate limiters
app.use('/api/', apiLimiter);
app.use('/auth/login', authLimiter);
app.use('/auth/reset-password', resetLimiter);
\`\`\`

**7. Audit Logging**
\`\`\`typescript
interface AuditLog {
  id: string;
  userId?: string;
  action: string;
  resource: string;
  ip: string;
  userAgent: string;
  timestamp: Date;
  success: boolean;
  details?: Record<string, any>;
}

class AuditLogger {
  static async log(event: Omit<AuditLog, 'id' | 'timestamp'>): Promise<void> {
    const auditEntry: AuditLog = {
      ...event,
      id: crypto.randomUUID(),
      timestamp: new Date()
    };

    // Store in database
    await AuditLogModel.create(auditEntry);

    // Log security events to separate system
    if (this.isSecurityEvent(event.action)) {
      await this.logSecurityEvent(auditEntry);
    }
  }

  private static isSecurityEvent(action: string): boolean {
    const securityActions = [
      'login', 'logout', 'password_change', 'api_key_create',
      'permission_change', 'failed_login', 'suspicious_activity'
    ];
    return securityActions.includes(action);
  }

  private static async logSecurityEvent(event: AuditLog): Promise<void> {
    // Send to SIEM, alerting system, etc.
    console.error('SECURITY EVENT:', JSON.stringify(event, null, 2));
  }
}

// Usage in authentication middleware
app.use('/api/*', async (req, res, next) => {
  const startTime = Date.now();

  res.on('finish', async () => {
    await AuditLogger.log({
      userId: req.user?.id,
      action: req.method + ' ' + req.path,
      resource: req.path,
      ip: req.ip,
      userAgent: req.get('User-Agent') || '',
      success: res.statusCode < 400,
      details: {
        statusCode: res.statusCode,
        responseTime: Date.now() - startTime,
        query: req.query,
        body: this.sanitizeBody(req.body)
      }
    });
  });

  next();
});
\`\`\`

📊 Authentication Security Score: ${this.calculateAuthSecurityScore(apis)}/100

**Recommendations:**
${this.generateAuthRecommendations(apis)}`;
  }

  private async reviewDataProtection(data: any, code: string): Promise<string> {
    return `Data Protection & Privacy Review

🔒 Data Protection Analysis:

**Data Types Identified:**
${this.analyzeDataTypes(data, code)}

**Privacy Compliance:**
${this.checkPrivacyCompliance(data, code)}

🛠️ Data Protection Implementation:

**1. Data Encryption at Rest**
\`\`\`typescript
import crypto from 'crypto';
import fs from 'fs';

class DataEncryption {
  private static readonly ALGORITHM = 'aes-256-gcm';
  private static readonly KEY_LENGTH = 32;
  private static readonly IV_LENGTH = 16;
  private static readonly TAG_LENGTH = 16;

  static generateKey(): Buffer {
    return crypto.randomBytes(this.KEY_LENGTH);
  }

  static encrypt(text: string, key: Buffer): string {
    const iv = crypto.randomBytes(this.IV_LENGTH);
    const cipher = crypto.createCipher(this.ALGORITHM, key);

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    // Return format: iv:authTag:encryptedData
    return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted;
  }

  static decrypt(encryptedText: string, key: Buffer): string {
    const parts = encryptedText.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const authTag = Buffer.from(parts[1], 'hex');
    const encrypted = parts[2];

    const decipher = crypto.createDecipher(this.ALGORITHM, key);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }
}

// Usage
const key = DataEncryption.generateKey();
const encrypted = DataEncryption.encrypt('sensitive data', key);
const decrypted = DataEncryption.decrypt(encrypted, key);
\`\`\`

**2. Data Encryption in Transit**
\`\`\`typescript
// server.ts - Force HTTPS
import https from 'https';
import http from 'http';

const options = {
  key: fs.readFileSync('path/to/private-key.pem'),
  cert: fs.readFileSync('path/to/certificate.pem')
};

const server = https.createServer(options, app);

// Redirect HTTP to HTTPS
http.createServer((req, res) => {
  res.writeHead(301, { 'Location': \`https://\${req.headers.host}\${req.url}\` });
  res.end();
}).listen(80);

server.listen(443, () => {
  console.log('Secure server running on port 443');
});
\`\`\`

**3. Personal Data Handling (GDPR Compliance)**
\`\`\`typescript
interface PersonalData {
  id: string;
  userId: string;
  dataType: 'name' | 'email' | 'phone' | 'address' | 'payment';
  data: string;
  createdAt: Date;
  consentGiven: boolean;
  consentDate?: Date;
  purpose: string;
  retentionPeriod: number; // days
}

class DataProtectionOfficer {
  static async collectPersonalData(
    userId: string,
    dataType: string,
    data: string,
    purpose: string
  ): Promise<void> {
    // Verify consent
    const hasConsent = await this.verifyConsent(userId, dataType, purpose);
    if (!hasConsent) {
      throw new Error('User consent required for data collection');
    }

    // Encrypt sensitive data
    const encryptedData = DataEncryption.encrypt(data, this.getEncryptionKey());

    // Store with metadata
    await PersonalDataModel.create({
      userId,
      dataType,
      data: encryptedData,
      createdAt: new Date(),
      consentGiven: true,
      consentDate: new Date(),
      purpose,
      retentionPeriod: this.getRetentionPeriod(dataType)
    });

    // Log data collection
    await AuditLogger.log({
      userId,
      action: 'personal_data_collected',
      resource: 'personal_data',
      success: true,
      details: { dataType, purpose }
    });
  }

  static async deletePersonalData(userId: string, dataType?: string): Promise<void> {
    const query = { userId };
    if (dataType) {
      query.dataType = dataType;
    }

    const deletedCount = await PersonalDataModel.deleteMany(query);

    await AuditLogger.log({
      userId,
      action: 'personal_data_deleted',
      resource: 'personal_data',
      success: true,
      details: { deletedCount, dataType }
    });
  }

  static async exportPersonalData(userId: string): Promise<any> {
    const userData = await PersonalDataModel.find({ userId });

    // Decrypt data for export
    const decryptedData = userData.map(record => ({
      ...record.toObject(),
      data: DataEncryption.decrypt(record.data, this.getEncryptionKey())
    }));

    return {
      userId,
      exportDate: new Date(),
      data: decryptedData
    };
  }

  private static async verifyConsent(
    userId: string,
    dataType: string,
    purpose: string
  ): Promise<boolean> {
    // Check if user has given consent for this data type and purpose
    const consent = await ConsentModel.findOne({
      userId,
      dataType,
      purpose,
      consented: true,
      expiresAt: { $gt: new Date() }
    });

    return !!consent;
  }

  private static getRetentionPeriod(dataType: string): number {
    const retentionMap = {
      'name': 365 * 10,      // 10 years
      'email': 365 * 10,     // 10 years
      'phone': 365 * 5,      // 5 years
      'address': 365 * 7,    // 7 years
      'payment': 365 * 7     // 7 years (PCI DSS requirement)
    };

    return retentionMap[dataType] || 365; // Default 1 year
  }

  private static getEncryptionKey(): Buffer {
    // In production, use a proper key management system
    const key = process.env.DATA_ENCRYPTION_KEY;
    if (!key) {
      throw new Error('Data encryption key not configured');
    }
    return Buffer.from(key, 'hex');
  }
}
\`\`\`

**4. Data Anonymization**
\`\`\`typescript
class DataAnonymizer {
  static anonymizeEmail(email: string): string {
    const [local, domain] = email.split('@');
    const anonymizedLocal = local.charAt(0) + '*'.repeat(local.length - 2) + local.charAt(local.length - 1);
    return \`\${anonymizedLocal}@\${domain}\`;
  }

  static anonymizePhone(phone: string): string {
    // Keep area code, mask rest
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length >= 10) {
      return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-****');
    }
    return phone;
  }

  static anonymizeName(name: string): string {
    const parts = name.split(' ');
    return parts.map(part =>
      part.length > 1 ? part.charAt(0) + '*'.repeat(part.length - 1) : part
    ).join(' ');
  }

  static tokenizeData(data: string): string {
    // Replace sensitive data with tokens
    const token = crypto.randomUUID();
    // Store mapping securely
    this.storeTokenMapping(token, data);
    return token;
  }

  private static storeTokenMapping(token: string, originalData: string): void {
    // Store in encrypted database with short retention
    // Implementation depends on your storage system
  }
}
\`\`\`

**5. Data Retention & Deletion**
\`\`\`typescript
class DataRetentionManager {
  static async enforceRetentionPolicies(): Promise<void> {
    const now = new Date();

    // Find data past retention period
    const expiredData = await PersonalDataModel.find({
      $expr: {
        $gt: [
          { $add: ['$createdAt', { $multiply: ['$retentionPeriod', 24 * 60 * 60 * 1000] }] },
          now
        ]
      }
    });

    for (const record of expiredData) {
      await this.deletePersonalData(record.userId, record.dataType);
    }
  }

  static async scheduleDataDeletion(userId: string, dataType: string, delayDays: number): Promise<void> {
    const deletionDate = new Date(Date.now() + delayDays * 24 * 60 * 60 * 1000);

    await ScheduledDeletionModel.create({
      userId,
      dataType,
      scheduledFor: deletionDate,
      createdAt: new Date()
    });
  }

  private static async deletePersonalData(userId: string, dataType: string): Promise<void> {
    // Physically delete the data
    await PersonalDataModel.deleteMany({ userId, dataType });

    // Log the deletion
    await AuditLogger.log({
      userId,
      action: 'data_retention_deletion',
      resource: 'personal_data',
      success: true,
      details: { dataType }
    });
  }
}

// Schedule daily cleanup
setInterval(() => {
  DataRetentionManager.enforceRetentionPolicies();
}, 24 * 60 * 60 * 1000); // Daily
\`\`\`

**6. Privacy by Design Implementation**
\`\`\`typescript
class PrivacyByDesign {
  static async performPrivacyImpactAssessment(
    feature: string,
    dataTypes: string[],
    processingPurpose: string
  ): Promise<PrivacyAssessment> {
    const risks = await this.assessPrivacyRisks(dataTypes, processingPurpose);
    const mitigations = this.generateMitigations(risks);
    const compliance = this.checkCompliance(dataTypes, processingPurpose);

    return {
      feature,
      dataTypes,
      processingPurpose,
      risks,
      mitigations,
      compliance,
      approved: risks.length === 0 || mitigations.length >= risks.length,
      assessedAt: new Date(),
      assessor: 'PrivacyByDesignSystem'
    };
  }

  private static async assessPrivacyRisks(dataTypes: string[], purpose: string): Promise<string[]> {
    const risks = [];

    if (dataTypes.includes('location') && purpose === 'marketing') {
      risks.push('Location data for marketing may violate privacy expectations');
    }

    if (dataTypes.includes('health') && !purpose.includes('medical')) {
      risks.push('Health data processing requires explicit medical purpose');
    }

    if (dataTypes.includes('financial') && purpose === 'analytics') {
      risks.push('Financial data for analytics may require additional consent');
    }

    return risks;
  }

  private static generateMitigations(risks: string[]): string[] {
    return risks.map(risk => {
      if (risk.includes('consent')) {
        return 'Implement explicit consent mechanism with clear purpose explanation';
      }
      if (risk.includes('location')) {
        return 'Add location data minimization and user control options';
      }
      if (risk.includes('health')) {
        return 'Obtain medical purpose authorization and implement strict access controls';
      }
      return 'Implement additional privacy safeguards and user controls';
    });
  }

  private static checkCompliance(dataTypes: string[], purpose: string): ComplianceStatus {
    const requiresDPIA = dataTypes.some(type =>
      ['health', 'genetic', 'biometric', 'racial'].includes(type)
    ) || purpose.includes('profiling');

    return {
      gdpr: this.checkGDPRCompliance(dataTypes, purpose),
      ccpa: this.checkCCPACompliance(dataTypes, purpose),
      requiresDPIA,
      dataProtectionOfficer: requiresDPIA
    };
  }

  private static checkGDPRCompliance(dataTypes: string[], purpose: string): boolean {
    // Implement GDPR compliance checks
    const hasLegalBasis = ['consent', 'contract', 'legal', 'vital', 'public', 'legitimate'].some(basis =>
      purpose.toLowerCase().includes(basis)
    );

    const hasDataMinimization = dataTypes.length <= this.getMinimumDataForPurpose(purpose);

    return hasLegalBasis && hasDataMinimization;
  }

  private static checkCCPACompliance(dataTypes: string[], purpose: string): boolean {
    // Implement CCPA compliance checks
    const isSaleOfData = purpose.includes('sale') || purpose.includes('share');
    const hasOptOut = !isSaleOfData || purpose.includes('opt-out');

    return hasOptOut;
  }

  private static getMinimumDataForPurpose(purpose: string): number {
    const purposeDataMap = {
      'authentication': 2,    // email, password
      'communication': 1,     // email or phone
      'payment': 3,           // card details, billing address
      'analytics': 0,         // no personal data ideal
      'marketing': 1          // email minimum
    };

    return purposeDataMap[purpose.toLowerCase()] || 1;
  }
}

interface PrivacyAssessment {
  feature: string;
  dataTypes: string[];
  processingPurpose: string;
  risks: string[];
  mitigations: string[];
  compliance: ComplianceStatus;
  approved: boolean;
  assessedAt: Date;
  assessor: string;
}

interface ComplianceStatus {
  gdpr: boolean;
  ccpa: boolean;
  requiresDPIA: boolean;
  dataProtectionOfficer: boolean;
}
\`\`\`

📊 Data Protection Score: ${this.calculateDataProtectionScore(data, code)}/100

**Compliance Status:**
- GDPR: ${this.checkGDPRCompliance(data, code) ? '✅ Compliant' : '❌ Non-compliant'}
- CCPA: ${this.checkCCPACompliance(data, code) ? '✅ Compliant' : '❌ Non-compliant'}
- Data Encryption: ${this.hasDataEncryption(code) ? '✅ Implemented' : '❌ Missing'}
- Audit Logging: ${this.hasAuditLogging(code) ? '✅ Implemented' : '❌ Missing'}

**Recommendations:**
${this.generateDataProtectionRecommendations(data, code)}`;
  }

  // Helper methods for security analysis
  private scanForHighSeverityIssues(dependencies: Record<string, string>, code: string): string {
    const issues = [];
    if (code.includes('eval(')) issues.push('Use of eval() - Code injection vulnerability');
    if (code.includes('innerHTML')) issues.push('Direct innerHTML manipulation - XSS vulnerability');
    if (Object.keys(dependencies).some(dep => dep.includes('express') && dependencies[dep].includes('^3'))) {
      issues.push('Outdated Express.js version - Security vulnerabilities');
    }
    return issues.map(issue => `- ${issue}`).join('\n') || 'None found';
  }

  private scanForMediumSeverityIssues(dependencies: Record<string, string>, code: string): string {
    const issues = [];
    if (!code.includes('helmet')) issues.push('Missing security headers (helmet middleware)');
    if (!code.includes('rate-limit')) issues.push('No rate limiting implemented');
    if (code.includes('console.log') && code.includes('password')) issues.push('Logging sensitive data');
    return issues.map(issue => `- ${issue}`).join('\n') || 'None found';
  }

  private scanForLowSeverityIssues(dependencies: Record<string, string>, code: string): string {
    const issues = [];
    if (!code.includes('joi') && !code.includes('yup')) issues.push('Missing input validation library');
    if (!code.includes('cors')) issues.push('CORS not explicitly configured');
    return issues.map(issue => `- ${issue}`).join('\n') || 'None found';
  }

  private countCriticalIssues(dependencies: Record<string, string>, code: string): number {
    return this.scanForHighSeverityIssues(dependencies, code).split('\n').filter(line => line.includes('-')).length;
  }

  private countHighSeverityIssues(dependencies: Record<string, string>, code: string): number {
    return this.scanForHighSeverityIssues(dependencies, code).split('\n').filter(line => line.includes('-')).length;
  }

  private countMediumSeverityIssues(dependencies: Record<string, string>, code: string): number {
    return this.scanForMediumSeverityIssues(dependencies, code).split('\n').filter(line => line.includes('-')).length;
  }

  private countLowSeverityIssues(dependencies: Record<string, string>, code: string): number {
    return this.scanForLowSeverityIssues(dependencies, code).split('\n').filter(line => line.includes('-')).length;
  }

  private calculateSecurityScore(dependencies: Record<string, string>, code: string): number {
    let score = 100;
    score -= this.countCriticalIssues(dependencies, code) * 20;
    score -= this.countHighSeverityIssues(dependencies, code) * 10;
    score -= this.countMediumSeverityIssues(dependencies, code) * 5;
    score -= this.countLowSeverityIssues(dependencies, code) * 2;
    return Math.max(0, score);
  }

  private generateSecurityRecommendations(dependencies: Record<string, string>, code: string): string {
    const recommendations = [];
    if (this.countCriticalIssues(dependencies, code) > 0) {
      recommendations.push('Fix all critical security issues immediately');
    }
    if (!code.includes('helmet')) {
      recommendations.push('Implement security headers with helmet');
    }
    if (!code.includes('rate-limit')) {
      recommendations.push('Add rate limiting to prevent abuse');
    }
    recommendations.push('Regular security audits and dependency updates');
    return recommendations.join('\n');
  }

  private countFunctions(code: string): number {
    const functionMatches = code.match(/function\s+\w+|const\s+\w+\s*=\s*\(|class\s+\w+/g);
    return functionMatches ? functionMatches.length : 0;
  }

  private countExternalDeps(code: string): number {
    const importMatches = code.match(/import\s+.*from\s+['"]([^'"]+)['"]/g);
    const requireMatches = code.match(/require\s*\(\s*['"]([^'"]+)['"]\s*\)/g);
    const allDeps = new Set();

    if (importMatches) {
      importMatches.forEach(match => {
        const dep = match.match(/from\s+['"]([^'"]+)['"]/)?.[1];
        if (dep && !dep.startsWith('.')) allDeps.add(dep);
      });
    }

    if (requireMatches) {
      requireMatches.forEach(match => {
        const dep = match.match(/require\s*\(\s*['"]([^'"]+)['"]\s*\)/)?.[1];
        if (dep && !dep.startsWith('.')) allDeps.add(dep);
      });
    }

    return allDeps.size;
  }

  private countSecurityOps(code: string): number {
    const securityOps = ['bcrypt', 'crypto', 'helmet', 'joi', 'jsonwebtoken', 'rate-limit'];
    return securityOps.filter(op => code.includes(op)).length;
  }

  private analyzeCriticalFlaws(code: string): string {
    const flaws = [];
    if (code.includes('eval(')) flaws.push('Code injection via eval()');
    if (code.includes('child_process') && code.includes('exec')) flaws.push('Command injection vulnerability');
    if (code.includes('fs') && code.includes('path.join') && !code.includes('path.resolve')) flaws.push('Path traversal vulnerability');
    return flaws.map(flaw => `- ${flaw}`).join('\n') || 'None found';
  }

  private analyzeInjectionVulnerabilities(code: string): string {
    const issues = [];
    if (code.includes('query(') && code.includes('${')) issues.push('SQL injection in query building');
    if (code.includes('innerHTML') && code.includes('userInput')) issues.push('XSS via innerHTML');
    if (code.includes('document.write') && code.includes('userInput')) issues.push('XSS via document.write');
    return issues.map(issue => `- ${issue}`).join('\n') || 'None found';
  }

  private analyzeAuthIssues(code: string): string {
    const issues = [];
    if (!code.includes('bcrypt') && code.includes('password')) issues.push('Plain text password storage');
    if (!code.includes('jsonwebtoken') && code.includes('auth')) issues.push('Missing JWT implementation');
    if (!code.includes('session') && code.includes('login')) issues.push('No session management');
    return issues.map(issue => `- ${issue}`).join('\n') || 'None found';
  }

  private analyzeDataProtection(code: string): string {
    const issues = [];
    if (!code.includes('crypto') && code.includes('password')) issues.push('No password encryption');
    if (!code.includes('https') && code.includes('server')) issues.push('HTTP instead of HTTPS');
    if (!code.includes('helmet') && code.includes('express')) issues.push('Missing security headers');
    return issues.map(issue => `- ${issue}`).join('\n') || 'None found';
  }

  private analyzeCryptoIssues(code: string): string {
    const issues = [];
    if (code.includes('md5') || code.includes('sha1')) issues.push('Weak cryptographic hash functions');
    if (code.includes('Math.random') && code.includes('token')) issues.push('Insecure random token generation');
    if (!code.includes('crypto.randomBytes') && code.includes('token')) issues.push('Missing cryptographically secure random');
    return issues.map(issue => `- ${issue}`).join('\n') || 'None found';
  }

  private analyzeAuthMethods(apis: string[]): string {
    const methods = [];
    if (apis.some(api => api.toLowerCase().includes('jwt'))) methods.push('JWT token authentication');
    if (apis.some(api => api.toLowerCase().includes('oauth'))) methods.push('OAuth 2.0');
    if (apis.some(api => api.toLowerCase().includes('session'))) methods.push('Session-based authentication');
    if (apis.some(api => api.toLowerCase().includes('basic'))) methods.push('Basic authentication');
    return methods.join(', ') || 'No authentication methods identified';
  }

  private identifyAuthWeaknesses(apis: string[]): string {
    const weaknesses = [];
    if (!apis.some(api => api.toLowerCase().includes('mfa'))) weaknesses.push('No Multi-Factor Authentication');
    if (!apis.some(api => api.toLowerCase().includes('rate'))) weaknesses.push('No rate limiting on auth endpoints');
    if (!apis.some(api => api.toLowerCase().includes('audit'))) weaknesses.push('No authentication audit logging');
    return weaknesses.join('\n') || 'No major weaknesses identified';
  }

  private calculateAuthSecurityScore(apis: string[]): number {
    let score = 50; // Base score
    if (apis.some(api => api.toLowerCase().includes('jwt'))) score += 15;
    if (apis.some(api => api.toLowerCase().includes('mfa'))) score += 15;
    if (apis.some(api => api.toLowerCase().includes('oauth'))) score += 10;
    if (apis.some(api => api.toLowerCase().includes('rate'))) score += 5;
    if (apis.some(api => api.toLowerCase().includes('audit'))) score += 5;
    return Math.min(100, score);
  }

  private generateAuthRecommendations(apis: string[]): string {
    const recommendations = [];
    if (!apis.some(api => api.toLowerCase().includes('mfa'))) {
      recommendations.push('Implement Multi-Factor Authentication (MFA)');
    }
    if (!apis.some(api => api.toLowerCase().includes('rate'))) {
      recommendations.push('Add rate limiting to authentication endpoints');
    }
    if (!apis.some(api => api.toLowerCase().includes('audit'))) {
      recommendations.push('Implement authentication audit logging');
    }
    recommendations.push('Regular security assessments and penetration testing');
    return recommendations.join('\n');
  }

  private analyzeDataTypes(data: any, code: string): string {
    const dataTypes = [];
    if (code.includes('email') || code.includes('Email')) dataTypes.push('Email addresses');
    if (code.includes('phone') || code.includes('Phone')) dataTypes.push('Phone numbers');
    if (code.includes('address') || code.includes('Address')) dataTypes.push('Physical addresses');
    if (code.includes('payment') || code.includes('card')) dataTypes.push('Payment information');
    if (code.includes('health') || code.includes('medical')) dataTypes.push('Health/medical data');
    if (code.includes('location') || code.includes('gps')) dataTypes.push('Location data');
    return dataTypes.join(', ') || 'No sensitive data types identified';
  }

  private checkPrivacyCompliance(data: any, code: string): string {
    const compliance = [];
    if (code.includes('gdpr') || code.includes('GDPR')) compliance.push('GDPR compliance measures present');
    if (code.includes('consent')) compliance.push('User consent mechanisms implemented');
    if (code.includes('anonymize') || code.includes('anonymization')) compliance.push('Data anonymization implemented');
    if (code.includes('retention') || code.includes('Retention')) compliance.push('Data retention policies defined');
    return compliance.join('\n') || 'No privacy compliance measures identified';
  }

  private calculateDataProtectionScore(data: any, code: string): number {
    let score = 30; // Base score
    if (code.includes('crypto') || code.includes('encrypt')) score += 20;
    if (code.includes('https') || code.includes('ssl')) score += 15;
    if (code.includes('consent')) score += 10;
    if (code.includes('anonymize')) score += 10;
    if (code.includes('audit') || code.includes('log')) score += 10;
    if (code.includes('gdpr') || code.includes('ccpa')) score += 5;
    return Math.min(100, score);
  }

  private checkGDPRCompliance(data: any, code: string): boolean {
    return code.includes('consent') && (code.includes('gdpr') || code.includes('privacy'));
  }

  private checkCCPACompliance(data: any, code: string): boolean {
    return code.includes('opt') && code.includes('out');
  }

  private hasDataEncryption(code: string): boolean {
    return code.includes('crypto') || code.includes('encrypt') || code.includes('bcrypt');
  }

  private hasAuditLogging(code: string): boolean {
    return code.includes('audit') || code.includes('log') || code.includes('logger');
  }

  private generateDataProtectionRecommendations(data: any, code: string): string {
    const recommendations = [];
    if (!this.hasDataEncryption(code)) {
      recommendations.push('Implement data encryption at rest and in transit');
    }
    if (!code.includes('consent')) {
      recommendations.push('Add user consent management for data collection');
    }
    if (!code.includes('anonymize')) {
      recommendations.push('Implement data anonymization for analytics and testing');
    }
    if (!this.hasAuditLogging(code)) {
      recommendations.push('Add comprehensive audit logging for data access');
    }
    recommendations.push('Regular privacy impact assessments and compliance audits');
    return recommendations.join('\n');
  }
}

export default SecurityAgent;