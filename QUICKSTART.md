# Quick Start Guide

Get your MicroSaaS running in 5 minutes.

---

## Step 1: Clone (30 seconds)

```bash
# Replace "my-project-name" with your actual project name
git clone https://github.com/manojkanur/FullStackDevelopmentTemplate.git my-project-name
cd my-project-name

# Start fresh (remove template history)
rm -rf .git && git init
```

---

## Step 2: Setup Your Project (2 minutes)

Run the interactive setup wizard:

```bash
/setup-project
```

The wizard will ask you:

```
1. What's your product name?
   → "InvoiceFlow"

2. What does it do?
   → "Invoice management for freelancers"

3. Tech stack preferences?
   → FastAPI, React, Chakra UI, JWT + Google OAuth

4. What are your core modules?
   → Invoices, Clients, Dashboard

5. For each module, what entities and actions?
   → Invoice: client_name, amount, due_date, status
   → Actions: Create, Edit, Send, Mark as Paid

6. Additional features?
   → Stripe Payments, Email Notifications

7. MVP scope?
   → User auth, Create/send invoices, Client management
```

**Output:** Customized `INITIAL.md` and `CLAUDE.md` for your project.

---

## Step 3: Generate Blueprint (1 minute)

```bash
/generate-prp INITIAL.md
```

Review the generated `PRPs/invoiceflow-prp.md`.

---

## Step 4: Build (10-30 minutes)

```bash
/execute-prp PRPs/invoiceflow-prp.md
```

Watch 6 agents build your app in parallel:
- Database models + migrations
- Backend API + auth
- Frontend pages + components
- Docker + CI/CD
- Tests + security review

---

## Step 5: Run

```bash
docker-compose up -d
```

Visit:
- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs

---

## What You Get

```
✅ User authentication (email + Google OAuth)
✅ Your custom modules with full CRUD
✅ React frontend with TypeScript
✅ FastAPI backend with validation
✅ PostgreSQL database
✅ Docker deployment ready
✅ GitHub Actions CI/CD
✅ 80%+ test coverage
✅ Security reviewed
```

---

## Command Summary

| Command | What It Does |
|---------|--------------|
| `/setup-project` | Interactive wizard → generates INITIAL.md + CLAUDE.md |
| `/generate-prp INITIAL.md` | Creates detailed implementation blueprint |
| `/execute-prp PRPs/xxx.md` | Builds everything with parallel agents |

---

## Full Workflow

```
/setup-project              # Answer questions about your product
    ↓
/generate-prp INITIAL.md    # Generate implementation plan
    ↓
/execute-prp PRPs/xxx.md    # Build with 6 parallel agents
    ↓
docker-compose up -d        # Run your app!
```

---

## Need Help?

- Check `README.md` for detailed documentation
- Review `skills/` folder for code patterns
- Check `examples/` for reference implementations

---

**Now go build something awesome!**
