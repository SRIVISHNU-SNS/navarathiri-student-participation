CREATE TABLE IF NOT EXISTS registrations (
  id BIGSERIAL PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  department VARCHAR(180) NOT NULL,
  participation VARCHAR(64) NOT NULL CHECK (participation IN (
    'Group Dance',
    'Solo Dance',
    'Classical Dance',
    'Singing / Vocal Performance',
    'Music / Instrumental Performance',
    'Drama / Skit',
    'Traditional Dress / Fashion Walk',
    'Anchoring / Hosting',
    'Rangoli / Creative Activities',
    'Decoration / Event Volunteers',
    'Other'
  )),
  participant_type VARCHAR(16) NOT NULL CHECK (participant_type IN ('Individual', 'Group')),
  group_name VARCHAR(160) NOT NULL DEFAULT '',
  group_size VARCHAR(32) NOT NULL DEFAULT '',
  group_members TEXT NOT NULL DEFAULT '',
  rehearsal VARCHAR(32) NOT NULL CHECK (rehearsal IN ('Yes', 'No', 'Depends on schedule')),
  other_query TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS registrations_created_at_desc_idx
  ON registrations (created_at DESC, id DESC);
