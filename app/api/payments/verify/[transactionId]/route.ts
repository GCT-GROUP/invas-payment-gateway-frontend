export async function GET(request: Request, { params }: { params: { transactionId: string } }) {
  const apiKey = request.headers.get("X-API-Key")

  if (!apiKey) {
    return Response.json({ error: "API key is required" }, { status: 401 })
  }

  const { transactionId } = params

  // Mock verification
  const verificationData = {
    transactionId,
    status: "success",
    verified: true,
    timestamp: new Date().toISOString(),
  }

  return Response.json({
    success: true,
    data: verificationData,
  })
}
