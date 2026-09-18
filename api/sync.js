const { neon } = require('@neondatabase/serverless');

// Self-healing: Ensure required tables exist in Neon
async function ensureTables(sql) {
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

  // Auto-migration: Ensure missing columns are added if tables already existed
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
}

module.exports = async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    return res.status(500).json({
      success: false,
      error: 'DATABASE_URL environment variable is not configured in Vercel.',
      hint: 'Please set DATABASE_URL in Vercel Project Settings > Environment Variables.',
    });
  }

  try {
    const sql = neon(databaseUrl);
    await ensureTables(sql);

    // ==========================================
    // GET: Fetch user data from Neon Cloud
    // ==========================================
    if (req.method === 'GET') {
      const userId = req.query.userId || 'default_user';

      const users = await sql`SELECT * FROM users WHERE id = ${userId} LIMIT 1`;
      const habits = await sql`SELECT * FROM habits WHERE user_id = ${userId}`;
      const habitCompletions = await sql`SELECT * FROM habit_completions WHERE user_id = ${userId}`;
      const memos = await sql`SELECT * FROM smart_memos WHERE user_id = ${userId}`;
      const quranProgress = await sql`SELECT * FROM quran_progress WHERE user_id = ${userId} LIMIT 1`;
      const sedekahRecords = await sql`SELECT * FROM sedekah_records WHERE user_id = ${userId}`;

      return res.status(200).json({
        success: true,
        data: {
          user: users[0] || null,
          habits: habits || [],
          habitCompletions: habitCompletions || [],
          memos: memos || [],
          quranProgress: quranProgress[0] || null,
          sedekahRecords: sedekahRecords || [],
        },
        syncedAt: new Date().toISOString(),
      });
    }

    // ==========================================
    // POST: Sync/Upload user data to Neon Cloud
    // ==========================================
    if (req.method === 'POST') {
      const body = req.body || {};
      const userId = body.userId || 'default_user';
      const profile = body.profile || { name: 'Mukmin Mujahid', avatar: '🕌', bio: 'Menjaga Himmah & Istiqomah' };
      const habits = Array.isArray(body.habits) ? body.habits : [];
      const completions = Array.isArray(body.completions) ? body.completions : [];
      const memos = Array.isArray(body.memos) ? body.memos : [];
      const quranProgress = body.quranProgress || null;
      const sedekahRecords = Array.isArray(body.sedekahRecords) ? body.sedekahRecords : [];

      // 1. Upsert User Profile
      await sql`
        INSERT INTO users (id, name, avatar, bio, updated_at)
        VALUES (${userId}, ${profile.name || 'Hamba Allah'}, ${profile.avatar || '🕌'}, ${profile.bio || ''}, NOW())
        ON CONFLICT (id) DO UPDATE
        SET name = EXCLUDED.name,
            avatar = EXCLUDED.avatar,
            bio = EXCLUDED.bio,
            updated_at = NOW();
      `;

      // 2. Upsert Habits
      for (const h of habits) {
        if (!h.id || !h.title) continue;
        await sql`
          INSERT INTO habits (id, user_id, title, category, period, target_frequency, points, icon_name)
          VALUES (
            ${h.id},
            ${userId},
            ${h.title},
            ${h.category || 'spiritual'},
            ${h.period || 'daily'},
            ${h.targetFrequency || 1},
            ${h.points || 10},
            ${h.iconName || 'Check'}
          )
          ON CONFLICT (id) DO UPDATE
          SET title = EXCLUDED.title,
              category = EXCLUDED.category,
              period = EXCLUDED.period,
              target_frequency = EXCLUDED.target_frequency,
              points = EXCLUDED.points,
              icon_name = EXCLUDED.icon_name;
        `;
      }

      // 3. Upsert Habit Completions
      for (const c of completions) {
        if (!c.habitId || !c.date) continue;
        await sql`
          INSERT INTO habit_completions (habit_id, completed_date, user_id)
          VALUES (${c.habitId}, ${c.date}, ${userId})
          ON CONFLICT (habit_id, completed_date) DO NOTHING;
        `;
      }

      // 4. Upsert Smart Memos
      for (const m of memos) {
        if (!m.id || !m.title) continue;
        const milestonesJson = JSON.stringify(m.milestones || []);
        await sql`
          INSERT INTO smart_memos (id, user_id, title, category, priority, milestones, bonus_points)
          VALUES (
            ${m.id},
            ${userId},
            ${m.title},
            ${m.category || 'ibadah'},
            ${m.priority || 'medium'},
            ${milestonesJson}::jsonb,
            ${m.bonusPoints || 0}
          )
          ON CONFLICT (id) DO UPDATE
          SET title = EXCLUDED.title,
              category = EXCLUDED.category,
              priority = EXCLUDED.priority,
              milestones = EXCLUDED.milestones,
              bonus_points = EXCLUDED.bonus_points;
        `;
      }

      // 5. Upsert Quran Progress
      if (quranProgress) {
        await sql`
          INSERT INTO quran_progress (user_id, last_page, last_surah_id, last_ayah_number, target_khatam_days, daily_page_target, updated_at)
          VALUES (
            ${userId},
            ${quranProgress.lastPage || 1},
            ${quranProgress.lastSurahId || 1},
            ${quranProgress.lastAyahNumber || 1},
            ${quranProgress.targetKhatamDays || 30},
            ${quranProgress.dailyPageTarget || 20},
            NOW()
          )
          ON CONFLICT (user_id) DO UPDATE
          SET last_page = EXCLUDED.last_page,
              last_surah_id = EXCLUDED.last_surah_id,
              last_ayah_number = EXCLUDED.last_ayah_number,
              target_khatam_days = EXCLUDED.target_khatam_days,
              daily_page_target = EXCLUDED.daily_page_target,
              updated_at = NOW();
        `;
      }

      return res.status(200).json({
        success: true,
        message: 'Berhasil menyinkronkan data ke Neon PostgreSQL Cloud.',
        syncedAt: new Date().toISOString(),
        counts: {
          habits: habits.length,
          completions: completions.length,
          memos: memos.length,
        },
      });
    }

    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  } catch (error) {
    console.error('Neon Sync Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Gagal terhubung ke database Neon.',
    });
  }
};
