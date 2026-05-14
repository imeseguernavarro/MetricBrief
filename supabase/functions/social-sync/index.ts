import "jsr:@supabase/functions-js/edge-runtime.d.ts";

Deno.serve(async (req) => {
  const body = await req.json().catch(() => ({}));

  return Response.json({
    ok: true,
    message: "Sync scaffold ready. Implement provider-specific fetchers here.",
    provider: body.platform ?? null,
    note: "Use SUPABASE_SERVICE_ROLE_KEY plus provider secrets to fetch metrics and upsert rows.",
  });
});
