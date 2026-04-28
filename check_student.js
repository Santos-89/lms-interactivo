const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://arbcluzdlcdnqdoflvhi.supabase.co', 'sb_publishable_BAXv8DVkkHETJmvRDXK5Gw_lOqh4ugf');

async function check() {
  const { data: profiles } = await supabase.from('profiles').select('id, full_name, email, xp');
  console.log("Total perfiles:", profiles?.length);
  const found = profiles?.filter(p => 
    (p.full_name && p.full_name.includes('Guaman')) || 
    (p.email && p.email.includes('jessfania'))
  );
  console.log("Coincidencias:", JSON.stringify(found, null, 2));
}
check();
