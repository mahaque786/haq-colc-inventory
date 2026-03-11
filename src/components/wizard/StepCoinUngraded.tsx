'use client'

import React from 'react'
import { useWizard } from './WizardState'
import { WizardLayout } from './WizardLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft } from 'lucide-react'

const detailKeyMap: Record<string, string> = {
  coin_us_precious: 'coinUngradedUSPrecious',
  coin_us_non_precious: 'coinUngradedUSNonPrecious',
  coin_foreign_precious: 'coinUngradedForeignPrecious',
  coin_foreign_non_precious: 'coinUngradedForeignNonPrecious',
}

const METAL_TYPES = ['GOLD', 'SILVER', 'PLATINUM', 'PALLADIUM', 'COPPER', 'NICKEL', 'ZINC', 'CLAD', 'OTHER']

const isPrecious = (code: string) => code.includes('precious') && !code.includes('non_precious')
const isForeign = (code: string) => code.includes('foreign')

export function StepCoinUngraded() {
  const { setStep, data, updateDetails } = useWizard()
  const detailKey = detailKeyMap[data.itemTypeCode] || 'coinUngradedUSNonPrecious'
  const d = data.details[detailKey] || {}
  const showMetal = isPrecious(data.itemTypeCode)
  const showCountry = isForeign(data.itemTypeCode)

  const set = (key: string, val: string) => {
    updateDetails(detailKey, { ...d, [key]: val })
  }

  return (
    <WizardLayout title="Raw / Ungraded Coin Details">
      <Button variant="ghost" size="sm" className="mb-4 -ml-2" onClick={() => setStep('coin-path')}>
        <ArrowLeft className="h-4 w-4 mr-1" />Back
      </Button>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Year</Label>
          <Input className="mt-1" value={d.year || ''} onChange={e => set('year', e.target.value)} placeholder="e.g. 1964" />
        </div>
        <div>
          <Label>Mint Mark</Label>
          <Input className="mt-1" value={d.mint || ''} onChange={e => set('mint', e.target.value)} placeholder="e.g. D, S" />
        </div>
        <div>
          <Label>Denomination</Label>
          <Input className="mt-1" value={d.denomination || ''} onChange={e => set('denomination', e.target.value)} placeholder="e.g. Kennedy Half Dollar" />
        </div>
        <div>
          <Label>Country</Label>
          <Input
            className="mt-1"
            value={showCountry ? (d.authorityCountry || '') : 'United States'}
            onChange={e => showCountry && set('authorityCountry', e.target.value)}
            disabled={!showCountry}
            placeholder={showCountry ? 'e.g. Canada' : undefined}
          />
        </div>
        <div>
          <Label>Series</Label>
          <Input className="mt-1" value={d.series || ''} onChange={e => set('series', e.target.value)} />
        </div>
        <div>
          <Label>Composition</Label>
          <Input className="mt-1" value={d.composition || ''} onChange={e => set('composition', e.target.value)} placeholder="e.g. 90% Silver" />
        </div>
        {showMetal && (
          <div>
            <Label>Metal Type</Label>
            <Select value={d.metalType || ''} onValueChange={v => set('metalType', v)}>
              <SelectTrigger className="mt-1"><SelectValue placeholder="Select metal" /></SelectTrigger>
              <SelectContent>
                {METAL_TYPES.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        )}
        <div>
          <Label>Weight (g)</Label>
          <Input type="number" className="mt-1" value={d.weightGrams || ''} onChange={e => set('weightGrams', e.target.value)} />
        </div>
        <div>
          <Label>Diameter (mm)</Label>
          <Input type="number" className="mt-1" value={d.diameterMm || ''} onChange={e => set('diameterMm', e.target.value)} />
        </div>
        <div>
          <Label>Variety</Label>
          <Input className="mt-1" value={d.variety || ''} onChange={e => set('variety', e.target.value)} />
        </div>
        <div>
          <Label>Strike Type</Label>
          <Input className="mt-1" value={d.strikeType || ''} onChange={e => set('strikeType', e.target.value)} />
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <Button onClick={() => setStep('images-references')}>Continue</Button>
      </div>
    </WizardLayout>
  )
}
