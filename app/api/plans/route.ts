export async function GET(request: Request) {
  const apiKey = request.headers.get("X-API-Key")

  if (!apiKey) {
    return Response.json({ error: "API key is required" }, { status: 401 })
  }

  // Mock plans data - Replace with actual API call
  const plans = [
    {
      id: "plan_starter",
      externalPlanId: "plan_basic",
      name: "Starter",
      amount: 5900,
      currency: "USD",
      duration: 30,
      features: [
        "PhoneBooks Manipulation",
        "Template Management",
        "Bulk Messaging",
        "Campaign Statistics",
        "Chatting System",
        "Bot Factory",
        "Calls",
        "1,000 Bot Sessions",
        "5 GB Cloud Storage",
      ],
      isActive: true,
    },
    {
      id: "plan_growth",
      externalPlanId: "plan_growth",
      name: "Growth",
      amount: 9900,
      currency: "USD",
      duration: 30,
      features: [
        "Everything in Starter +",
        "Roles & Permissions",
        "Lead Management",
        "API Endpoints",
        "Message Scheduling",
        "Catalog Management",
        "Basic Flows",
        "5,000 Bot Sessions",
        "10 GB Cloud Storage",
      ],
      isActive: true,
    },
    {
      id: "plan_premium",
      externalPlanId: "plan_premium",
      name: "Premium",
      amount: 24900,
      currency: "USD",
      duration: 30,
      features: [
        "Everything in Growth +",
        "Order Manipulation",
        "Premium Customer Support",
        "Call Center",
        "Advanced Flows",
        "10,000 ChatBot Sessions",
        "15 GB Cloud Storage",
        "Priority API Access",
      ],
      isActive: true,
    },
  ]

  return Response.json({
    success: true,
    data: plans,
  })
}
