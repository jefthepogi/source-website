export async function onRequestPost(context) {
    try {
      const { fileId } = await context.request.json();
      
      if (!fileId) {
        return new Response(JSON.stringify({ error: "Missing fileId" }), { status: 400 });
      }
  
      // Securely pull the private key from Cloudflare environment secrets (.dev.vars locally)
      const privateKey = context.env.IMAGEKIT_PRIVATE_KEY;
      
      // ImageKit requires Basic Auth: Base64 encoding of "private_key:"
      const authHeader = `Basic ${btoa(privateKey + ':')}`;
  
      const response = await fetch(`https://api.imagekit.io/v1/files/${fileId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': authHeader
        }
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        return new Response(JSON.stringify(errorData), { status: response.status });
      }
  
      return new Response(JSON.stringify({ success: true }), { status: 200 });
  
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
  }