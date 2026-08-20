import type { APIRoute } from "astro";
import { ADMIN_COOKIE } from "../../../lib/investor-deck/runtime";

export const prerender = false;

const clear = () =>
  new Response(null, {
    status: 303,
    headers: {
      Location: "/investors",
      "Set-Cookie": `${ADMIN_COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax`,
      "Cache-Control": "private, no-store",
    },
  });

export const POST: APIRoute = async () => clear();
export const GET: APIRoute = async () => clear();
