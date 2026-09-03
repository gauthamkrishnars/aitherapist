const fs = require('fs');

/**
 * Automatically maps whichever database variable Vercel created 
 * (e.g. DATABASE1_URL, DATABASE1_URL_PRISMA_URL, POSTGRES_PRISMA_URL) 
 * to DATABASE_URL so Prisma CLI and Next.js connect seamlessly.
 */
function resolveDatabaseUrl() {
  const priorityKeys = [
    'DATABASE_URL',
    'DATABASE1_URL',
    'DATABASE1_URL_PRISMA_URL',
    'DATABASE1_URL_URL',
    'DATABASE1_URL_DATABASE_URL',
    'POSTGRES_PRISMA_URL',
    'POSTGRES_URL',
  ];

  let selectedUrl = null;

  for (const key of priorityKeys) {
    const val = process.env[key];
    if (val && typeof val === 'string' && (val.startsWith('postgres://') || val.startsWith('postgresql://'))) {
      selectedUrl = val;
      break;
    }
  }

  // Fallback: search all process.env for any postgresql connection string
  if (!selectedUrl) {
    for (const [k, v] of Object.entries(process.env)) {
      if (typeof v === 'string' && (v.startsWith('postgres://') || v.startsWith('postgresql://'))) {
        selectedUrl = v;
        break;
      }
    }
  }

  if (selectedUrl) {
    try {
      fs.appendFileSync('.env', `\nDATABASE_URL="${selectedUrl}"\n`);
      console.log('✓ Successfully mapped database connection string to DATABASE_URL');
    } catch (e) {
      // If filesystem is read-only, process.env is still present for runtime
    }
  } else {
    console.log('ℹ No PostgreSQL connection string detected in current environment.');
  }
}

resolveDatabaseUrl();
