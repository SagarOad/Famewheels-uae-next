import axios from "axios";

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  try {
    const { data } = await axios.get(`${baseUrl}/bycategory`);
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error fetching filters:", error);
    return new Response("Error fetching filters", { status: 500 });
  }
}
