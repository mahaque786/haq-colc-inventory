'use client'

import React from 'react'
import { useWizard } from './WizardState'
import { WizardLayout } from './WizardLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowLeft } from 'lucide-react'

const TCG_BRANDS = ['POKEMON', 'MTG', 'YUGIOH', 'SPORTS_CARDS', 'OTHER']

export function StepTCGSingle() {
  const { setStep, data, updateDetails } = useWizard()
  const isGraded = data.itemTypeCode === 'tcg_single_graded'
  const detailKey = isGraded ? 'tcgSingleGraded' : 'tcgSingleUngraded'
  const d = data.details[detailKey] || {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const set = (key: string, val: any) => {
    updateDetails(detailKey, { ...d, [key]: val })
  }

  return (
    <WizardLayout title={`${isGraded ? 'Graded' : 'Ungraded'} TCG Card Details`}>
      <Button variant="ghost" size="sm" className="mb-4 -ml-2" onClick={() => setStep('tcg-path')}>
        <ArrowLeft className="h-4 w-4 mr-1" />Back
      </Button>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Brand / Game</Label>
          <Select value={d.brand || 'POKEMON'} onValueChange={v => set('brand', v)}>
            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              {TCG_BRANDS.map(b => <SelectItem key={b} value={b}>{b.replace('_', ' ')}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Language</Label>
          <Input className="mt-1" value={d.language || 'English'} onChange={e => set('language', e.target.value)} />
        </div>
        <div className="col-span-2">
          <Label>Set Name</Label>
          <Input className="mt-1" value={d.setName || ''} onChange={e => set('setName', e.target.value)} placeholder="e.g. Base Set, Scarlet & Violet" />
        </div>
        <div>
          <Label>Card Name</Label>
          <Input className="mt-1" value={d.cardName || ''} onChange={e => set('cardName', e.target.value)} placeholder="e.g. Charizard" />
        </div>
        <div>
          <Label>Card Number</Label>
          <Input className="mt-1" value={d.cardNumber || ''} onChange={e => set('cardNumber', e.target.value)} placeholder="e.g. 4/102" />
        </div>
        <div>
          <Label>Rarity</Label>
          <Input className="mt-1" value={d.rarity || ''} onChange={e => set('rarity', e.target.value)} placeholder="e.g. Rare Holo" />
        </div>
        <div>
          <Label>Edition</Label>
          <Input className="mt-1" value={d.edition || ''} onChange={e => set('edition', e.target.value)} placeholder="e.g. 1st Edition, Unlimited" />
        </div>
        <div className="flex items-center gap-4 mt-2">
          <div className="flex items-center gap-2">
            <Checkbox id="isFoil" checked={d.isFoil || false} onCheckedChange={v => set('isFoil', v)} />
            <Label htmlFor="isFoil">Foil</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="isHolo" checked={d.isHolo || false} onCheckedChange={v => set('isHolo', v)} />
            <Label htmlFor="isHolo">Holo</Label>
          </div>
        </div>
        {isGraded && (
          <>
            <div>
              <Label>Grading Company</Label>
              <Input className="mt-1" value={d.gradingCompany || ''} onChange={e => set('gradingCompany', e.target.value)} placeholder="e.g. PSA, BGS, CGC" />
            </div>
            <div>
              <Label>Grade</Label>
              <Input className="mt-1" value={d.grade || ''} onChange={e => set('grade', e.target.value)} placeholder="e.g. 10, 9.5" />
            </div>
            <div>
              <Label>Cert Number</Label>
              <Input className="mt-1" value={d.certNumber || ''} onChange={e => set('certNumber', e.target.value)} />
            </div>
          </>
        )}
        <div className="col-span-2">
          <Label>Condition Notes</Label>
          <Input className="mt-1" value={d.conditionNotes || ''} onChange={e => set('conditionNotes', e.target.value)} />
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <Button onClick={() => setStep('images-references')}>Continue</Button>
      </div>
    </WizardLayout>
  )
}
