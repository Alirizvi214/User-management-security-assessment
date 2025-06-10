# Week 1 – Security Assessment Report

Project: Strengthening Security Measures for a Web Application
Intern: Syed Ali Murtuza Rizvi
Week: 1

## 1. Application Setup

Project Used: https://github.com/Pranavk-official/user-management.git
Stack: Node.js, Express, MongoDB
How I Set It Up:

  git clone https://github.com/Pranavk-official/user-management.git
  cd user-management
  npm install  
  npm start

## 2. Vulnerability Assessment

Tools Used:

 OWASP ZAP
 Browser DevTools (Chrome)
 Manual testing (custom HTML forms, input payloads)

## 3. Vulnerabilities Found

| Vulnerability                     | Details                                                                       | Risk Level |
| --------------------------------- | ----------------------------------------------------------------------------- | ---------- |
| Stored XSS                        | `<script>alert("XSS")</script>` in first/last name fields displayed unescaped | High       |
| Missing HTTP Security Headers     | CSP, X-Content-Type-Options, X-Frame-Options missing                          | Medium     |
| No CSRF Protection                | No CSRF tokens in forms; requests can be forged                               | Medium     |
| Cookie Missing Flags              | `SameSite`, `Secure`, and `HttpOnly` flags missing                            | Medium     |
| No Input Validation               | Email and password not validated on server side                               | Medium     |
| Password Hashing                  | Passwords hashed using bcrypt                                                 | Safe       |

## 4. Manual Tests Performed

 XSS injection via:

  <script>alert('XSS')</script>
  
 SQL Injection Test:

   Input: `admin' OR '1'='1`
   Result: Did not bypass login 
 Checked headers using browser dev tools (Network tab)
 Observed cookie flags via Application tab in DevTools


## 5. Suggested Fixes

| Issue            | Recommended Fix                                         |
| ---------------- | ------------------------------------------------------- |
| XSS              | Escape all output in templates                          |
| Missing Headers  | Use Helmet.js middleware                                |
| No CSRF          | Add CSRF token middleware                               |
| Cookies          | Set `SameSite`, `Secure`, `HttpOnly` flags              |
| Input Validation | Use `validator` package to validate email, length, etc. |

## 6. Key Learnings

 Learned to identify common web vulnerabilities like XSS, CSRF, and misconfigurations
 Practiced using OWASP ZAP to scan real apps
 Understood the importance of input validation, secure cookies, and HTTP headers
 Verified that bcrypt was used for secure password hashing


