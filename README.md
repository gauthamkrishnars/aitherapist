# Clarity AI Therapist

A full stack conversational mental health companion built with **Next.js 14 (App Router)**, **SQLite**, **Prisma ORM**, and **Tailwind CSS**. Clarity provides empathetic, non-judgmental dialogue grounded in Cognitive Behavioral Therapy (CBT) and Acceptance and Commitment Therapy (ACT), paired with safety crisis detection middleware.

---

## Key Features

- **Empathetic AI Dialogue**: Active listening, emotional validation, and gentle reflective inquiry without clinical diagnostic pretension.
- **Safety Crisis Middleware**: Real-time evaluation of user input for self-harm, suicidal ideation, or crisis indicators. Automatically displays an emergency modal and banner with direct links to the **988 Suicide & Crisis Lifeline**, **Crisis Text Line (741741)**, and international hotlines.
- **End of Session Synthesis**: When you click **"End Session"**, Clarity synthesizes a clear session recap and generates 3 actionable, personalized coping steps.
- **Flexible Authentication**: Create a registered account with email/password (hashed with `bcryptjs`) or click **"Start Anonymous Session"** for zero-email guest access.
- **Session History Dashboard**: Search, filter, and inspect past transcripts, emotional themes, and coping action plans.
- **Local SQLite Database**: Powered by Prisma ORM (`prisma/dev.db`), keeping conversation records under local control.
- **Modern Responsive Design**: High-contrast, calm aesthetics using `Space Grotesk` and `JetBrains Mono`, 100% mobile responsiveness, and dark/light mode toggle.
- **Technical SEO & Legal Compliance**: Complete Open Graph meta tags, structured JSON-LD schema (`schema.org/HealthApplication`), and functional modal popups for Terms of Service, Privacy Policy, and medical disclaimers.

---

## Directory Structure

```
ai therapist/
├── prisma/
│   ├── schema.prisma              # Database schema (User, Session, Message)
│   └── dev.db                     # Local SQLite database
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── anonymous/     # Guest authentication route
│   │   │   │   ├── login/         # Email/password authentication
│   │   │   │   ├── logout/        # Clear auth session cookie
│   │   │   │   ├── me/            # Current authenticated user check
│   │   │   │   └── register/      # User account registration
│   │   │   ├── chat/              # Chat endpoint with safety crisis middleware
│   │   │   └── sessions/
│   │   │       ├── route.js       # List & create sessions
│   │   │       └── [id]/
│   │   │           ├── route.js   # Session details & transcript
│   │   │           └── end/       # End session & generate coping recap
│   │   ├── auth/page.jsx          # Login, Register, and Anonymous guest entry
│   │   ├── chat/page.jsx          # Real-time therapist chat interface
│   │   ├── sessions/
│   │   │   ├── page.jsx           # Session history dashboard
│   │   │   └── [id]/page.jsx      # Past session transcript & coping plan
│   │   ├── globals.css            # Tailwind styles, scrollbars, skeleton shimmers
│   │   ├── layout.jsx             # SEO metadata, JSON-LD, fonts, root shell
│   │   ├── page.jsx               # Striking landing page
│   │   └── providers.jsx          # Modals & theme coordinator
│   ├── components/
│   │   ├── CrisisModal.jsx        # Prominent emergency hotline modal (988)
│   │   ├── EndSessionModal.jsx    # Session recap and coping steps checklist
│   │   ├── Footer.jsx             # Mental health disclaimers & legal modal triggers
│   │   ├── Header.jsx             # Navigation, user profile, and theme toggle
│   │   ├── LegalModal.jsx         # Terms of Service & Privacy Policy popups
│   │   └── ThemeToggle.jsx        # Light/Dark mode switcher
│   └── lib/
│       ├── auth.js                # JWT signing/verification and bcrypt utilities
│       ├── db.js                  # Prisma Client singleton
│       ├── llmService.js          # Multi-provider LLM caller + offline clinical engine
│       ├── safety.js              # Safety crisis detection regex engine & hotlines
│       └── therapistPrompt.js     # CBT/ACT system prompts and synthesis templates
├── .env                           # Local environment variables
├── .env.example                   # Example environment configuration
├── jsconfig.json                  # Path aliases (@/* -> ./src/*)
├── next.config.mjs                # Next.js configuration
├── package.json                   # Dependencies and scripts
└── tailwind.config.js             # Tailwind CSS theme configuration
```

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Initialize the SQLite Database
```bash
npx prisma db push
```

### 3. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

### 4. Optional: Connect an External LLM Key
By default, Clarity includes an intelligent offline clinical engine so you can immediately chat without any third-party API key.

If you wish to use OpenAI, Groq, or OpenRouter:
1. Set `LLM_API_KEY="your-api-key"` in `.env`, or
2. Click the gear icon in the chat interface toolbar to set a custom key on the fly.

---

## Safety Protocol & Disclaimer

> [!IMPORTANT]
> **Not Medical Treatment**: Clarity AI Therapist is an algorithmic conversational reflection tool. It does not provide psychiatric diagnoses, medical prescriptions, or clinical psychotherapy.
> 
> **Crisis Lifeline**: If you or someone you know is in acute distress or having thoughts of self-harm, call or text **988** (available 24/7 in the US and Canada) or visit **[findahelpline.com](https://findahelpline.com)** internationally.
