'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useWizard } from './WizardState'
import { WizardLayout } from './WizardLayout'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { generateTitle } from '@/lib/title-generator'
import { formatCurrency } from '@/lib/utils'
import { ArrowLeft, Save, Loader2, Check } from 'lucide-react'

export function StepReview() {
  const { setStep, data, reset } = useWizard()
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const suggestedTitle = generateTitle({
    itemTypeCode: data.itemTypeCode,
    ...data.details,
  })

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/wizard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const result = await res.json()
      if (res.ok) {
        setSaved(true)
        setTimeout(() => {
          router.push(`/inventory/${result.item.id}`)
        }, 1000)
      } else {
        setError(result.error || 'Failed to save item')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (saved) {
    return (
      <WizardLayout title="Item Saved!">
        <div className="text-center py-12">
          <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <p className="text-gray-700 font-medium">Redirecting to item page...</p>
        </div>
      </WizardLayout>
    )
  }

  return (
    <WizardLayout title="Review & Save">
      <Button variant="ghost" size="sm" className="mb-4 -ml-2" onClick={() => setStep('pricing')}>
        <ArrowLeft className="h-4 w-4 mr-1" />Back
      </Button>

      <div className="space-y-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-gray-400 mb-1 font-medium uppercase tracking-wide">Item Type</p>
            <Badge variant="secondary">{data.itemTypeCode}</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-gray-400 mb-1 font-medium uppercase tracking-wide">Suggested Title</p>
            <p className="text-base font-semibold text-gray-900">{suggestedTitle}</p>
          </CardContent>
        </Card>

        {Object.entries(data.details).length > 0 && (
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-gray-400 mb-3 font-medium uppercase tracking-wide">Details</p>
              <div className="space-y-1">
                {Object.entries(data.details).map(([key, val]) => {
                  if (typeof val !== 'object' || val === null) return null
                  return Object.entries(val as Record<string, string | number | boolean | null>)
                    .filter(([, v]) => v != null && v !== '')
                    .map(([field, value]) => (
                      <div key={`${key}-${field}`} className="flex justify-between py-0.5">
                        <span className="text-sm text-gray-500 capitalize">{field.replace(/([A-Z])/g, ' $1').trim()}</span>
                        <span className="text-sm text-gray-900 font-medium">{String(value)}</span>
                      </div>
                    ))
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {data.pricing.marketValue && (
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-gray-400 mb-3 font-medium uppercase tracking-wide">Pricing</p>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Market Value</span>
                  <span className="text-sm font-medium">{formatCurrency(parseFloat(data.pricing.marketValue))}</span>
                </div>
                {data.pricing.listingPrice && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Listing Price</span>
                    <span className="text-sm font-medium">{formatCurrency(parseFloat(data.pricing.listingPrice))}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {data.references.length > 0 && (
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wide">References ({data.references.length})</p>
              <div className="space-y-1">
                {data.references.map((ref, i) => (
                  <div key={i} className="text-sm text-gray-700">
                    <Badge variant="secondary" className="text-xs mr-2">{ref.refType}</Badge>
                    {ref.label || ref.url || ref.value}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {error && (
          <div className="p-3 rounded-md bg-red-50 border border-red-200 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="flex gap-3 justify-between pt-2">
          <Button variant="outline" onClick={() => { reset(); router.push('/wizard') }}>
            Start Over
          </Button>
          <Button onClick={handleSave} disabled={saving} className="px-8">
            {saving ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</>
            ) : (
              <><Save className="h-4 w-4 mr-2" />Save Item</>
            )}
          </Button>
        </div>
      </div>
    </WizardLayout>
  )
}
