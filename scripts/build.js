const { execSync } = require('child_process');

// 1. Resolve DB URL from custom prefixed variables (e.g. DATABASE1_URL, etc.)
require('./prepare-env.js');

try {
  // 2. Generate Prisma Client
  console.log('→ Generating Prisma Client...');
  execSync('npx prisma generate', { stdio: 'inherit' });

  // 3. Sync database schema if PostgreSQL connection string is active
  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl && (dbUrl.startsWith('postgres://') || dbUrl.startsWith('postgresql://'))) {
    console.log('→ Active PostgreSQL connection string found. Syncing schema...');
    try {
      execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });
    } catch (err) {
      console.warn('⚠ Notice: prisma db push encountered a warning, continuing build...');
    }
  } else {
    console.log('ℹ Skipping prisma db push (will sync automatically when deployed with database).');
  }

  // 4. Execute Next.js build
  console.log('→ Compiling Next.js production bundle...');
  execSync('npx next build', { stdio: 'inherit' });
} catch (error) {
  console.error('Build execution failed:', error.message);
  process.exit(1);
}
