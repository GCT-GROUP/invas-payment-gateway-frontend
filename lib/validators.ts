/**
 * Form validation utilities
 */

export const validators = {
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },

  fullName: (name: string): boolean => {
    return name.trim().length >= 2
  },

  cardNumber: (cardNumber: string): boolean => {
    const cleaned = cardNumber.replace(/\s/g, "")
    return cleaned.length >= 13 && cleaned.length <= 19 && /^\d+$/.test(cleaned)
  },

  expiryDate: (expiryDate: string): boolean => {
    const [month, year] = expiryDate.split("/").map((x) => x.trim())
    if (!month || !year) return false

    const monthNum = Number.parseInt(month, 10)
    const yearNum = Number.parseInt(year, 10)

    if (isNaN(monthNum) || isNaN(yearNum)) return false
    if (monthNum < 1 || monthNum > 12) return false

    const currentDate = new Date()
    const currentYear = currentDate.getFullYear() % 100
    const currentMonth = currentDate.getMonth() + 1

    if (yearNum < currentYear) return false
    if (yearNum === currentYear && monthNum < currentMonth) return false

    return true
  },

  cvv: (cvv: string): boolean => {
    return /^\d{3,4}$/.test(cvv.trim())
  },

  userId: (userId: string): boolean => {
    return userId.length > 0 && userId.length <= 255
  },

  planId: (planId: string): boolean => {
    return planId.length > 0 && planId.length <= 255
  },
}

export function validatePaymentForm(data: {
  email: string
  fullName: string
  cardNumber: string
  expiryDate: string
  cvv: string
}): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {}

  if (!validators.email(data.email)) {
    errors.email = "Please enter a valid email address"
  }

  if (!validators.fullName(data.fullName)) {
    errors.fullName = "Please enter your full name"
  }

  if (!validators.cardNumber(data.cardNumber)) {
    errors.cardNumber = "Please enter a valid card number"
  }

  if (!validators.expiryDate(data.expiryDate)) {
    errors.expiryDate = "Please enter a valid expiry date (MM/YY)"
  }

  if (!validators.cvv(data.cvv)) {
    errors.cvv = "Please enter a valid CVV (3-4 digits)"
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  }
}
