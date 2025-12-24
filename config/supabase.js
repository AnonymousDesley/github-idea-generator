const { createClient } = require('@supabase/supabase-js');

// Uses credentials from Step 5 of the guide [cite: 487-488]
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

module.exports = supabase;