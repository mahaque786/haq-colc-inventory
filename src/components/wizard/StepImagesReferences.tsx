'use client'

import React, { useState } from 'react'
import { useWizard } from './WizardState'
import { WizardLayout } from './WizardLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Plus, X, ExternalLink } from 'lucide-react'
import { WizardStep } from './WizardState'

const REFERENCE_TYPES = [
  'PCGS_URL', 'NGC_URL', 'EBAY_SOLD', 'GSID', 'NUMISMASTER_URL',
  'AUCTION_COMP', 'MARKETPLACE_RESEARCH', 'VALUATION_SOURCE',
  'CATALOG_REF', 'CUSTOM_URL', 'PLAIN_TEXT', 'OTHER',
]

function getPrevStep(itemTypeCode: string): WizardStep {
  if (itemTypeCode === 'coin_ngc' || itemTypeCode === 'coin_pcgs') return 'coin-graded'
  if (itemTypeCode.startsWith('coin_')) return 'coin-ungraded'
  if (itemTypeCode === 'paper_currency') return 'currency-path'
  if (itemTypeCode === 'tcg_single_graded' || itemTypeCode === 'tcg_single_ungraded') return 'tcg-single'
  return 'tcg-sealed'
}

export function StepImagesReferences() {
  const { setStep, data, addReference, removeReference } = useWizard()
  const [refForm, setRefForm] = useState({ refType: 'EBAY_SOLD', label: '', url: '', value: '', notes: '' })

  const handleAddRef = () => {
    if (!refForm.refType) return
    addReference(refForm)
    setRefForm({ refType: 'EBAY_SOLD', label: '', url: '', value: '', notes: '' })
  }

  return (
    <WizardLayout title="Images & References">
      <Button variant="ghost" size="sm" className="mb-4 -ml-2" onClick={() => setStep(getPrevStep(data.itemTypeCode))}>
        <ArrowLeft className="h-4 w-4 mr-1" />Back
      </Button>

      {/* Images note */}
      <div className="mb-6 p-4 rounded-lg bg-blue-50 border border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>Images:</strong> You can add images after creating the item via the item detail page. Firebase Storage upload will be available there.
        </p>
      </div>

      {/* References */}
      <div>
        <h3 className="font-semibold text-gray-800 mb-3">References & Comps</h3>

        {data.references.length > 0 && (
          <div className="mb-4 space-y-2">
            {data.references.map((ref, i) => (
              <div key={i} className="flex items-start gap-2 p-3 rounded-lg bg-gray-50 border border-gray-100">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">{ref.refType}</Badge>
                    {ref.label && <span className="text-sm font-medium text-gray-800">{ref.label}</span>}
                  </div>
                  {ref.url && (
                    <a href={ref.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 flex items-center gap-1 mt-0.5 hover:underline">
                      <ExternalLink className="h-3 w-3" />{ref.url}
                    </a>
                  )}
                  {ref.value && <p className="text-xs text-gray-500 mt-0.5">{ref.value}</p>}
                </div>
                <button onClick={() => removeReference(i)} className="text-gray-400 hover:text-red-500 flex-shrink-0">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="border border-dashed border-gray-300 rounded-lg p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Type</Label>
              <Select value={refForm.refType} onValueChange={v => setRefForm(f => ({ ...f, refType: v }))}>
                <SelectTrigger className="mt-1 h-9 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {REFERENCE_TYPES.map(t => <SelectItem key={t} value={t} className="text-xs">{t.replace(/_/g, ' ')}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Label</Label>
              <Input className="mt-1 h-9 text-sm" value={refForm.label} onChange={e => setRefForm(f => ({ ...f, label: e.target.value }))} placeholder="Optional label" />
            </div>
          </div>
          <div>
            <Label className="text-xs">URL</Label>
            <Input className="mt-1 h-9 text-sm" value={refForm.url} onChange={e => setRefForm(f => ({ ...f, url: e.target.value }))} placeholder="https://" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Value / Price</Label>
              <Input className="mt-1 h-9 text-sm" value={refForm.value} onChange={e => setRefForm(f => ({ ...f, value: e.target.value }))} placeholder="e.g. $125.00" />
            </div>
            <div>
              <Label className="text-xs">Notes</Label>
              <Input className="mt-1 h-9 text-sm" value={refForm.notes} onChange={e => setRefForm(f => ({ ...f, notes: e.target.value }))} />
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleAddRef} className="w-full">
            <Plus className="h-4 w-4 mr-2" />Add Reference
          </Button>
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <Button onClick={() => setStep('pricing')}>Continue to Pricing</Button>
      </div>
    </WizardLayout>
  )
}
