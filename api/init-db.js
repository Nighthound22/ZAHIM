const { neon } = require('@neondatabase/serverless');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    return res.status(500).json({
      success: false,
      status: 'DATABASE_URL_MISSING',
      message: 'DATABASE_URL belum diatur di Vercel Environment Variables.',
      hint: 'Tambahkan connection string Neon antum ke Vercel: Project Settings > Environment Variables > DATABASE_URL',
    });
  }

  try {
    const sql = neon(databaseUrl);

    // Test query
    const result = await sql`SELECT NOW() as current_time, current_database() as db_name, version() as pg_version`;

    // Ensure all tables
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        avatar VARCHAR(255),
        bio TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS habits (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        category VARCHAR(50) NOT NULL,
        period VARCHAR(50) NOT NULL,
        target_frequency INTEGER DEFAULT 1,
        points INTEGER DEFAULT 10,
        icon_name VARCHAR(100),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS habit_completions (
        id SERIAL PRIMARY KEY,
        habit_id VARCHAR(255) REFERENCES habits(id) ON DELETE CASCADE,
        completed_date VARCHAR(20) NOT NULL,
        user_id VARCHAR(255),
        UNIQUE (habit_id, completed_date)
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS smart_memos (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        category VARCHAR(50) NOT NULL,
        priority VARCHAR(20) NOT NULL,
        milestones JSONB DEFAULT '[]'::jsonb,
        bonus_points INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS quran_progress (
        user_id VARCHAR(255) PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        last_page INTEGER DEFAULT 1,
        last_surah_id INTEGER DEFAULT 1,
        last_ayah_number INTEGER DEFAULT 1,
        target_khatam_days INTEGER DEFAULT 30,
        daily_page_target INTEGER DEFAULT 20,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS sedekah_records (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
        amount NUMERIC(15, 2) NOT NULL,
        date VARCHAR(20) NOT NULL,
        note TEXT
      );
    `;

    // Auto-migration: Ensure missing columns exist
    try {
      await sql`ALTER TABLE habits ADD COLUMN IF NOT EXISTS icon_name VARCHAR(100);`;
      await sql`ALTER TABLE habits ADD COLUMN IF NOT EXISTS target_frequency INTEGER DEFAULT 1;`;
      await sql`ALTER TABLE habits ADD COLUMN IF NOT EXISTS points INTEGER DEFAULT 10;`;
      await sql`ALTER TABLE habits ADD COLUMN IF NOT EXISTS period VARCHAR(50) DEFAULT 'daily';`;
      await sql`ALTER TABLE habits ADD COLUMN IF NOT EXISTS category VARCHAR(50) DEFAULT 'ibadah';`;
      await sql`ALTER TABLE habit_completions ADD COLUMN IF NOT EXISTS user_id VARCHAR(255);`;
      await sql`ALTER TABLE smart_memos ADD COLUMN IF NOT EXISTS milestones JSONB DEFAULT '[]'::jsonb;`;
      await sql`ALTER TABLE smart_memos ADD COLUMN IF NOT EXISTS bonus_points INTEGER DEFAULT 0;`;
      await sql`ALTER TABLE quran_progress ADD COLUMN IF NOT EXISTS daily_page_target INTEGER DEFAULT 20;`;
      await sql`ALTER TABLE quran_progress ADD COLUMN IF NOT EXISTS target_khatam_days INTEGER DEFAULT 30;`;
      await sql`ALTER TABLE sedekah_records ADD COLUMN IF NOT EXISTS note TEXT;`;
    } catch (migErr) {
      console.warn('Auto-migration notice:', migErr);
    }

    return res.status(200).json({
      success: true,
      status: 'CONNECTED',
      message: 'Koneksi ke Neon PostgreSQL berhasil & seluruh tabel siap digunakan!',
      neonProject: 'sparkling-feather-82050623',
      database: result[0]?.db_name,
      serverTime: result[0]?.current_time,
      postgresVersion: result[0]?.pg_version,
    });
  } catch (error) {
    console.error('Database connection test error:', error);
    return res.status(500).json({
      success: false,
      status: 'CONNECTION_FAILED',
      error: error.message,
    });
  }
};
