'use client'

import React, { useMemo } from 'react'
import { useWizard } from './WizardState'
import { WizardLayout } from './WizardLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { calculateSuggestedListingPrice } from '@/lib/pricing'
import { formatCurrency } from '@/lib/utils'
import { ArrowLeft, Calculator } from 'lucide-react'

const PLATFORMS = [
  { code: 'ebay', label: 'eBay', feePercent: '0.1295', paymentFeePercent: '0.03', paymentFeeFixed: '0.30' },
  { code: 'tcgplayer', label: 'TCGplayer', feePercent: '0.1099', paymentFeePercent: '0.025', paymentFeeFixed: '0.00' },
  { code: 'whatnot', label: 'Whatnot', feePercent: '0.08', paymentFeePercent: '0.029', paymentFeeFixed: '0.30' },
  { code: 'custom', label: 'Custom', feePercent: '', paymentFeePercent: '', paymentFeeFixed: '' },
]

export function StepPricing() {
  const { setStep, data, updatePricing } = useWizard()
  const p = data.pricing
  const [selectedPlatform, setSelectedPlatform] = React.useState('ebay')

  const handlePlatformChange = (code: string) => {
    setSelectedPlatform(code)
    const plat = PLATFORMS.find(pl => pl.code === code)
    if (plat && code !== 'custom') {
      updatePricing('platformFeePercent', plat.feePercent)
      updatePricing('paymentFeePercent', plat.paymentFeePercent)
      updatePricing('paymentFeeFixed', plat.paymentFeeFixed)
    }
  }

  const calcResult = useMemo(() => {
    if (!p.marketValue) return null
    try {
      return calculateSuggestedListingPrice({
        marketValue: parseFloat(p.marketValue || '0'),
        platformFeePercent: parseFloat(p.platformFeePercent || '0.1295'),
        paymentFeePercent: parseFloat(p.paymentFeePercent || '0.03'),
        paymentFeeFixed: parseFloat(p.paymentFeeFixed || '0.30'),
        shippingCost: parseFloat(p.shippingCost || '5.00'),
        promotedPercent: parseFloat(p.promotedPercent || '0'),
        targetNetProceeds: p.targetNetProceeds ? parseFloat(p.targetNetProceeds) : undefined,
      })
    } catch {
      return null
    }
  }, [p])

  return (
    <WizardLayout title="Pricing">
      <Button variant="ghost" size="sm" className="mb-4 -ml-2" onClick={() => setStep('images-references')}>
        <ArrowLeft className="h-4 w-4 mr-1" />Back
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label>Market Value ($)</Label>
            <Input type="number" className="mt-1" value={p.marketValue || ''} onChange={e => updatePricing('marketValue', e.target.value)} placeholder="0.00" />
          </div>
          <div>
            <Label>Target Net Proceeds ($) <span className="text-xs text-gray-400">(optional)</span></Label>
            <Input type="number" className="mt-1" value={p.targetNetProceeds || ''} onChange={e => updatePricing('targetNetProceeds', e.target.value)} placeholder="Leave blank to use market value" />
          </div>
          <div>
            <Label>Platform</Label>
            <Select value={selectedPlatform} onValueChange={handlePlatformChange}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                {PLATFORMS.map(pl => <SelectItem key={pl.code} value={pl.code}>{pl.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label className="text-xs">Platform Fee %</Label>
              <Input type="number" step="0.0001" className="mt-1 h-9 text-sm" value={p.platformFeePercent || ''} onChange={e => updatePricing('platformFeePercent', e.target.value)} />
            </div>
            <div>
              <Label className="text-xs">Payment %</Label>
              <Input type="number" step="0.0001" className="mt-1 h-9 text-sm" value={p.paymentFeePercent || ''} onChange={e => updatePricing('paymentFeePercent', e.target.value)} />
            </div>
            <div>
              <Label className="text-xs">Fixed ($)</Label>
              <Input type="number" step="0.01" className="mt-1 h-9 text-sm" value={p.paymentFeeFixed || ''} onChange={e => updatePricing('paymentFeeFixed', e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">Shipping Cost ($)</Label>
              <Input type="number" className="mt-1 h-9 text-sm" value={p.shippingCost || '5.00'} onChange={e => updatePricing('shippingCost', e.target.value)} />
            </div>
            <div>
              <Label className="text-xs">Promoted % (optional)</Label>
              <Input type="number" step="0.001" className="mt-1 h-9 text-sm" value={p.promotedPercent || ''} onChange={e => updatePricing('promotedPercent', e.target.value)} />
            </div>
          </div>
          <div>
            <Label>Listing Price ($) <span className="text-xs text-gray-400">(override)</span></Label>
            <Input type="number" className="mt-1" value={p.listingPrice || ''} onChange={e => updatePricing('listingPrice', e.target.value)} placeholder="Leave blank to use suggested" />
          </div>
        </div>

        {/* Calculation result */}
        <div>
          {calcResult ? (
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Calculator className="h-4 w-4 text-blue-600" />
                  <p className="font-semibold text-blue-900 text-sm">Suggested Listing Price</p>
                </div>
                <p className="text-3xl font-bold text-blue-700 mb-4">{formatCurrency(calcResult.suggestedListingPrice)}</p>
                <Separator className="my-3" />
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Platform Fee</span>
                    <span className="text-gray-800">-{formatCurrency(calcResult.breakdown.platformFee)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Fee</span>
                    <span className="text-gray-800">-{formatCurrency(calcResult.breakdown.paymentFee)}</span>
                  </div>
                  {calcResult.breakdown.promotedFee > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Promoted Fee</span>
                      <span className="text-gray-800">-{formatCurrency(calcResult.breakdown.promotedFee)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-gray-800">-{formatCurrency(calcResult.breakdown.shipping)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span className="text-gray-700">Estimated Net</span>
                    <span className={calcResult.estimatedNet >= 0 ? 'text-green-700' : 'text-red-600'}>{formatCurrency(calcResult.estimatedNet)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400 text-sm text-center p-8 border-2 border-dashed border-gray-200 rounded-lg">
              Enter a market value to see the suggested listing price calculation
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <Button onClick={() => setStep('review')}>Continue to Review</Button>
      </div>
    </WizardLayout>
  )
}
