export interface PricingInput {
  marketValue?: number
  platformFeePercent?: number
  paymentFeePercent?: number
  paymentFeeFixed?: number
  shippingCost?: number
  promotedPercent?: number
  targetNetProceeds?: number
}

export interface PricingOutput {
  suggestedListingPrice: number
  estimatedFees: number
  estimatedNet: number
  breakdown: {
    platformFee: number
    paymentFee: number
    shipping: number
    promotedFee: number
    total: number
  }
}

export function calculateSuggestedListingPrice(input: PricingInput): PricingOutput {
  // Default fees represent eBay's standard selling structure:
  // platformFeePercent: 12.95% final value fee, paymentFeePercent: 3% + $0.30 managed payments
  const {
    marketValue = 0,
    platformFeePercent = 0.1295,
    paymentFeePercent = 0.03,
    paymentFeeFixed = 0.30,
    shippingCost = 5.00,
    promotedPercent = 0,
    targetNetProceeds,
  } = input

  const base = targetNetProceeds ?? marketValue
  const totalPercentFee = platformFeePercent + paymentFeePercent + promotedPercent
  const divisor = 1 - totalPercentFee

  const suggestedListingPrice = divisor > 0
    ? (base + paymentFeeFixed + shippingCost) / divisor
    : base * 1.3

  const platformFee = suggestedListingPrice * platformFeePercent
  const paymentFee = suggestedListingPrice * paymentFeePercent + paymentFeeFixed
  const promotedFee = suggestedListingPrice * promotedPercent
  const total = platformFee + paymentFee + promotedFee + shippingCost
  const estimatedNet = suggestedListingPrice - total

  return {
    suggestedListingPrice: Math.round(suggestedListingPrice * 100) / 100,
    estimatedFees: Math.round(total * 100) / 100,
    estimatedNet: Math.round(estimatedNet * 100) / 100,
    breakdown: {
      platformFee: Math.round(platformFee * 100) / 100,
      paymentFee: Math.round(paymentFee * 100) / 100,
      shipping: shippingCost,
      promotedFee: Math.round(promotedFee * 100) / 100,
      total: Math.round(total * 100) / 100,
    },
  }
}
