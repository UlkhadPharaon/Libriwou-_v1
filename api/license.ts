/**
 * Mock Subscription & License validation API endpoint.
 * Acts as the secure billing cloud system in our Hybrid Sovereign Architecture.
 */

export default async function handler(req: any, res: any) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { email } = req.body || {};
    console.log(`[License API] Validating subscription status for: ${email}`);

    if (!email) {
      return res.status(400).json({ error: "Email requis pour la validation." });
    }

    // Default: return a successful active subscription for 12 months.
    // If the email contains 'expired', we return an expired subscription to demonstrate the locking system!
    const isExpiredTrigger = email.toLowerCase().includes('expired');

    const expiryDate = new Date();
    if (isExpiredTrigger) {
      // Expired 5 days ago
      expiryDate.setDate(expiryDate.getDate() - 5);
    } else {
      // Active for 1 year
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    }

    const status = {
      active: !isExpiredTrigger && expiryDate > new Date(),
      expiry: expiryDate.toISOString(),
      plan: "Premium UEMOA Corporate",
      email: email,
      lastChecked: new Date().toISOString()
    };

    return res.status(200).json(status);
  } catch (error: any) {
    console.error("[License API] Error:", error);
    return res.status(500).json({ error: error.message || 'Server error' });
  }
}
