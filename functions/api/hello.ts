export async function onRequest(context: any) {
  return new Response(JSON.stringify({ 
    message: "Libriwouô API is online!", 
    status: "healthy" 
  }), {
    headers: { "Content-Type": "application/json" }
  });
}
