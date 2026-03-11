'use client'

import React from 'react'
import { useWizard } from './WizardState'
import { WizardLayout } from './WizardLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft } from 'lucide-react'

export function StepCurrencyPath() {
  const { setStep, data, updateDetails } = useWizard()
  const d = data.details.paperCurrency || {}

  const set = (key: string, val: string) => {
    updateDetails('paperCurrency', { ...d, [key]: val })
  }

  return (
    <WizardLayout title="Paper Currency Details">
      <Button variant="ghost" size="sm" className="mb-4 -ml-2" onClick={() => setStep('broad-type')}>
        <ArrowLeft className="h-4 w-4 mr-1" />Back
      </Button>

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Label>Country of Issue</Label>
          <Input className="mt-1" value={d.country || ''} onChange={e => set('country', e.target.value)} placeholder="e.g. United States" />
        </div>
        <div>
          <Label>Denomination</Label>
          <Input className="mt-1" value={d.denomination || ''} onChange={e => set('denomination', e.target.value)} placeholder="e.g. $1, £5" />
        </div>
        <div>
          <Label>Year / Series</Label>
          <Input className="mt-1" value={d.yearOrSeries || ''} onChange={e => set('yearOrSeries', e.target.value)} placeholder="e.g. 1935A" />
        </div>
        <div>
          <Label>Serial Number</Label>
          <Input className="mt-1" value={d.serialNumber || ''} onChange={e => set('serialNumber', e.target.value)} />
        </div>
        <div>
          <Label>Grade</Label>
          <Input className="mt-1" value={d.grade || ''} onChange={e => set('grade', e.target.value)} placeholder="e.g. 65EPQ" />
        </div>
        <div>
          <Label>Grading Company</Label>
          <Input className="mt-1" value={d.gradingCompany || ''} onChange={e => set('gradingCompany', e.target.value)} placeholder="e.g. PMG, PCGS Currency" />
        </div>
        <div>
          <Label>Cert Number</Label>
          <Input className="mt-1" value={d.certNumber || ''} onChange={e => set('certNumber', e.target.value)} />
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <Button onClick={() => setStep('images-references')}>Continue</Button>
      </div>
    </WizardLayout>
  )
}
