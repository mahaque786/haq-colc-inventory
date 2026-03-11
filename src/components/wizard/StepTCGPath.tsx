'use client'

import React from 'react'
import { useWizard } from './WizardState'
import { WizardLayout } from './WizardLayout'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

const TCG_TYPE_OPTIONS = [
  { id: 'tcg_single_graded', label: 'Single Card — Graded', description: 'Card is in a PSA, BGS, CGC, or other grading slab' },
  { id: 'tcg_single_ungraded', label: 'Single Card — Raw / Ungraded', description: 'Loose card, not in a grading holder' },
  { id: 'tcg_sealed_product', label: 'Sealed Product', description: 'Booster box, ETB, collection box, bundle, etc.' },
  { id: 'tcg_sealed_pack', label: 'Sealed Pack', description: 'Individual booster pack' },
]

export function StepTCGPath() {
  const { setStep, updateData } = useWizard()

  const handleSelect = (typeCode: string) => {
    updateData({ itemTypeCode: typeCode })
    if (typeCode === 'tcg_single_graded' || typeCode === 'tcg_single_ungraded') {
      setStep('tcg-single')
    } else {
      setStep('tcg-sealed')
    }
  }

  return (
    <WizardLayout title="What type of TCG item?">
      <Button variant="ghost" size="sm" className="mb-4 -ml-2" onClick={() => setStep('broad-type')}>
        <ArrowLeft className="h-4 w-4 mr-1" />Back
      </Button>
      <div className="grid grid-cols-1 gap-3">
        {TCG_TYPE_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            onClick={() => handleSelect(opt.id)}
            className="flex items-start gap-4 p-4 rounded-lg border-2 border-gray-200 bg-white text-left hover:border-blue-400 hover:bg-blue-50 transition-all"
          >
            <div>
              <p className="font-semibold text-gray-900">{opt.label}</p>
              <p className="text-sm text-gray-500 mt-0.5">{opt.description}</p>
            </div>
          </button>
        ))}
      </div>
    </WizardLayout>
  )
}
