'use client'

import React from 'react'
import { useWizard } from './WizardState'
import { WizardLayout } from './WizardLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft } from 'lucide-react'

export function StepCoinGraded() {
  const { setStep, data, updateDetails } = useWizard()
  const isNGC = data.itemTypeCode === 'coin_ngc'
  const detailKey = isNGC ? 'coinNgc' : 'coinPcgs'
  const d = data.details[detailKey] || {}

  const set = (key: string, val: string) => {
    updateDetails(detailKey, { ...d, [key]: val })
  }

  return (
    <WizardLayout title={`${isNGC ? 'NGC' : 'PCGS'} Graded Coin Details`}>
      <Button variant="ghost" size="sm" className="mb-4 -ml-2" onClick={() => setStep('coin-path')}>
        <ArrowLeft className="h-4 w-4 mr-1" />Back
      </Button>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Year</Label>
          <Input className="mt-1" value={d.year || ''} onChange={e => set('year', e.target.value)} placeholder="e.g. 1921" />
        </div>
        <div>
          <Label>Mint Mark</Label>
          <Input className="mt-1" value={d.mint || ''} onChange={e => set('mint', e.target.value)} placeholder="e.g. D, S, O" />
        </div>
        <div>
          <Label>Denomination</Label>
          <Input className="mt-1" value={d.denomination || ''} onChange={e => set('denomination', e.target.value)} placeholder="e.g. Morgan Dollar" />
        </div>
        <div>
          <Label>Country</Label>
          <Input className="mt-1" value={d.authorityCountry || ''} onChange={e => set('authorityCountry', e.target.value)} placeholder="e.g. United States" />
        </div>
        <div>
          <Label>Grade</Label>
          <Input className="mt-1" value={d.grade || ''} onChange={e => set('grade', e.target.value)} placeholder="e.g. MS64, PR67" />
        </div>
        <div>
          <Label>Cert Number</Label>
          <Input className="mt-1" value={d.certNumber || ''} onChange={e => set('certNumber', e.target.value)} />
        </div>
        <div>
          <Label>Series</Label>
          <Input className="mt-1" value={d.series || ''} onChange={e => set('series', e.target.value)} placeholder="e.g. Morgan Dollar" />
        </div>
        <div>
          <Label>Composition</Label>
          <Input className="mt-1" value={d.composition || ''} onChange={e => set('composition', e.target.value)} placeholder="e.g. 90% Silver" />
        </div>
        <div>
          <Label>Variety</Label>
          <Input className="mt-1" value={d.variety || ''} onChange={e => set('variety', e.target.value)} placeholder="e.g. VAM-4" />
        </div>
        <div>
          <Label>Strike Type</Label>
          <Input className="mt-1" value={d.strikeType || ''} onChange={e => set('strikeType', e.target.value)} placeholder="e.g. Business Strike, Proof" />
        </div>
        <div>
          <Label>Slab Generation</Label>
          <Input className="mt-1" value={d.slabGeneration || ''} onChange={e => set('slabGeneration', e.target.value)} placeholder="e.g. Old Fatty" />
        </div>
        <div>
          <Label>Holder Notes</Label>
          <Input className="mt-1" value={d.holderNotes || ''} onChange={e => set('holderNotes', e.target.value)} placeholder="e.g. CAC, Star" />
        </div>
        <div className="col-span-2">
          <Label>Obverse Notes</Label>
          <Input className="mt-1" value={d.obverseNotes || ''} onChange={e => set('obverseNotes', e.target.value)} />
        </div>
        <div className="col-span-2">
          <Label>Reverse Notes</Label>
          <Input className="mt-1" value={d.reverseNotes || ''} onChange={e => set('reverseNotes', e.target.value)} />
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <Button onClick={() => setStep('images-references')}>Continue</Button>
      </div>
    </WizardLayout>
  )
}
