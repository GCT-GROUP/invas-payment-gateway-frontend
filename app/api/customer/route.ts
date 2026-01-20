export async function GET(request: Request) {
    const apiKey = request.headers.get("X-API-Key")

    if (!apiKey) {
        return Response.json({ error: "API key is required" }, { status: 401 })
    }

    return Response.json({
        success: true,
        data: [],
    })
}