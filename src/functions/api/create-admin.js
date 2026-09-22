export async function onRequestPost(context) {
    const { request, env } = context;
  
    try {
      // 1. Parse the incoming request from your React frontend
      const { email, password, role, permissions } = await request.json();
  
      // 2. Access your secure environment variables from Cloudflare
      const SUPABASE_URL = env.VITE_SUPABASE_URL;
      const SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
  
      if (!SUPABASE_URL || !SERVICE_KEY) {
        return Response.json({ error: "Missing Server Environment Variables" }, { status: 500 });
      }
  
      // 3. Call the GoTrue Admin API to create the Auth User
      const authRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SERVICE_KEY,
          'Authorization': `Bearer ${SERVICE_KEY}`
        },
        body: JSON.stringify({
          email: email,
          password: password,
          email_confirm: true,
          user_metadata: { role: role }
        })
      });
  
      const authData = await authRes.json();
      if (!authRes.ok) {
        return Response.json({ error: authData.message || "Failed to create auth user" }, { status: 400 });
      }
  
      // 4. Insert the new admin into your public.admin_users table
      const dbRes = await fetch(`${SUPABASE_URL}/rest/v1/admin_users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SERVICE_KEY,
          'Authorization': `Bearer ${SERVICE_KEY}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          user_id: authData.id,
          email: email.toLowerCase(),
          role: role,
          permissions: permissions
        })
      });
  
      if (!dbRes.ok) {
        const dbErr = await dbRes.json();
        return Response.json({ error: dbErr.message || "Failed to insert into admin_users" }, { status: 400 });
      }
  
      // 5. Return success
      return Response.json({ success: true, user: authData }, { status: 200 });
  
    } catch (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }
  }