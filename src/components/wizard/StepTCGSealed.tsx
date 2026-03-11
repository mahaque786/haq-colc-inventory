'use client'

import React from 'react'
import { useWizard } from './WizardState'
import { WizardLayout } from './WizardLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft } from 'lucide-react'

const TCG_BRANDS = ['POKEMON', 'MTG', 'YUGIOH', 'SPORTS_CARDS', 'OTHER']
const PRODUCT_TYPES = [
  'Booster Box', 'Elite Trainer Box', 'Blister Pack', 'Bundle',
  'Collection Box', 'Premium Collection', 'Ultra Premium Collection',
  'Tin', 'Binder', 'Theme Deck', 'Starter Deck', 'Gift Box',
]

export function StepTCGSealed() {
  const { setStep, data, updateDetails } = useWizard()
  const isPack = data.itemTypeCode === 'tcg_sealed_pack'
  const detailKey = isPack ? 'tcgSealedPack' : 'tcgSealedProduct'
  const d = data.details[detailKey] || {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const set = (key: string, val: any) => {
    updateDetails(detailKey, { ...d, [key]: val })
  }

  return (
    <WizardLayout title={`Sealed ${isPack ? 'Pack' : 'Product'} Details`}>
      <Button variant="ghost" size="sm" className="mb-4 -ml-2" onClick={() => setStep('tcg-path')}>
        <ArrowLeft className="h-4 w-4 mr-1" />Back
      </Button>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Brand</Label>
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
          <Input className="mt-1" value={d.setName || ''} onChange={e => set('setName', e.target.value)} placeholder="e.g. Scarlet & Violet" />
        </div>
        <div className="col-span-2">
          <Label>Product Name</Label>
          <Input className="mt-1" value={d.productName || ''} onChange={e => set('productName', e.target.value)} placeholder="e.g. Scarlet & Violet Booster Box" />
        </div>
        {!isPack && (
          <div>
            <Label>Product Type</Label>
            <Select value={d.productType || ''} onValueChange={v => set('productType', v)}>
              <SelectTrigger className="mt-1"><SelectValue placeholder="Select type" /></SelectTrigger>
              <SelectContent>
                {PRODUCT_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        )}
        <div>
          <Label>Release Year</Label>
          <Input className="mt-1" value={d.releaseYear || ''} onChange={e => set('releaseYear', e.target.value)} placeholder="e.g. 2023" />
        </div>
        <div>
          <Label>Seal Condition</Label>
          <Input className="mt-1" value={d.sealCondition || ''} onChange={e => set('sealCondition', e.target.value)} placeholder="e.g. Mint, Intact" />
        </div>
        {!isPack && (
          <>
            <div>
              <Label>Pack Count</Label>
              <Input type="number" className="mt-1" value={d.packCount || ''} onChange={e => set('packCount', e.target.value)} />
            </div>
            <div>
              <Label>Cards Per Pack</Label>
              <Input type="number" className="mt-1" value={d.cardsPerPack || ''} onChange={e => set('cardsPerPack', e.target.value)} />
            </div>
            <div>
              <Label>Box Condition</Label>
              <Input className="mt-1" value={d.boxCondition || ''} onChange={e => set('boxCondition', e.target.value)} />
            </div>
          </>
        )}
        <div>
          <Label>UPC Barcode</Label>
          <Input className="mt-1" value={d.upcBarcode || ''} onChange={e => set('upcBarcode', e.target.value)} />
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <Button onClick={() => setStep('images-references')}>Continue</Button>
      </div>
    </WizardLayout>
  )
}
