import { cookies } from "next/headers";

export async function GET(request, { params }) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  const headers = {};
  if (token) {
    headers["Cookie"] = `${token.name}=${token.value}`;
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const backendRes = await fetch(`${apiUrl}/api/reports/${id}/pdf`, {
    headers,
    credentials: "include",
  });

  if (!backendRes.ok) {
    return new Response(JSON.stringify({ error: "Could not load PDF" }), {
      status: backendRes.status,
      headers: { "Content-Type": "application/json" },
    });
  }

  const buffer = await backendRes.arrayBuffer();

  return new Response(buffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline",
    },
  });
}
