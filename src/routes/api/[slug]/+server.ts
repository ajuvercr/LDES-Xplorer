import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET = (async ({ fetch, params }) => {
  if (!params.slug || params.slug.length < 1) {
    throw error(400, "No slug provided");
  }

  try {
    const url = new URL(params.slug);
    if (!url.protocol || !url.protocol.startsWith("http")) {
      throw error(400, "Only http protocol is supported");
    }

    const resp = await fetch(url, { redirect: "follow", headers: { "accept": "text/turtle" } });

    if (resp.ok) {
      const out = await resp.text();
      return new Response(String(out));
    }
    return resp;

  } catch (e: any) {
    throw error(400);
  }

}) satisfies RequestHandler;
