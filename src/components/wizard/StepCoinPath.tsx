'use client'

import React, { useState } from 'react'
import { useWizard } from './WizardState'
import { WizardLayout } from './WizardLayout'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Award, Circle } from 'lucide-react'

const GRADING_OPTIONS = [
  {
    id: 'graded',
    label: 'Professionally Graded',
    description: 'Coin is in an NGC or PCGS holder/slab',
    icon: Award,
  },
  {
    id: 'ungraded',
    label: 'Raw / Ungraded',
    description: 'Coin is not in a grading company holder',
    icon: Circle,
  },
]

const GRADED_OPTIONS = [
  { id: 'coin_ngc', label: 'NGC', description: 'Numismatic Guaranty Company' },
  { id: 'coin_pcgs', label: 'PCGS', description: 'Professional Coin Grading Service' },
]

const REGION_OPTIONS = [
  { id: 'us', label: 'United States', description: 'Minted in the US (Morgan, Peace, Eagle, etc.)' },
  { id: 'foreign', label: 'Foreign / World', description: 'Minted outside the United States' },
]

const METAL_OPTIONS = [
  { id: 'precious', label: 'Precious Metal', description: 'Gold, silver, platinum, palladium' },
  { id: 'non_precious', label: 'Non-Precious Metal', description: 'Copper, nickel, zinc, clad' },
]

type PathState = 'grading' | 'graded-company' | 'region' | 'metal'

export function StepCoinPath() {
  const { setStep, updateData } = useWizard()
  const [pathState, setPathState] = useState<PathState>('grading')
  const [region, setRegion] = useState<string | null>(null)

  const handleGrading = (id: string) => {
    if (id === 'graded') {
      setPathState('graded-company')
    } else {
      setPathState('region')
    }
  }

  const handleGradedCompany = (id: string) => {
    updateData({ itemTypeCode: id })
    setStep('coin-graded')
  }

  const handleRegion = (id: string) => {
    setRegion(id)
    setPathState('metal')
  }

  const handleMetal = (metalId: string) => {
    const typeMap: Record<string, string> = {
      'us-precious': 'coin_us_precious',
      'us-non_precious': 'coin_us_non_precious',
      'foreign-precious': 'coin_foreign_precious',
      'foreign-non_precious': 'coin_foreign_non_precious',
    }
    const key = `${region}-${metalId}`
    updateData({ itemTypeCode: typeMap[key] || 'coin_us_non_precious' })
    setStep('coin-ungraded')
  }

  const renderOptions = (options: Array<{ id: string; label: string; description?: string; icon?: React.ElementType }>, handler: (id: string) => void) => (
    <div className="grid grid-cols-1 gap-3">
      {options.map((opt) => {
        const Icon = opt.icon
        return (
          <button
            key={opt.id}
            onClick={() => handler(opt.id)}
            className="flex items-start gap-4 p-4 rounded-lg border-2 border-gray-200 bg-white text-left hover:border-blue-400 hover:bg-blue-50 transition-all"
          >
            {Icon && (
              <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                <Icon className="h-5 w-5 text-gray-600" />
              </div>
            )}
            <div>
              <p className="font-semibold text-gray-900">{opt.label}</p>
              {opt.description && <p className="text-sm text-gray-500 mt-0.5">{opt.description}</p>}
            </div>
          </button>
        )
      })}
    </div>
  )

  const titles: Record<PathState, string> = {
    'grading': 'Is the coin graded?',
    'graded-company': 'Which grading company?',
    'region': 'US or Foreign coin?',
    'metal': 'Precious or non-precious metal?',
  }

  return (
    <WizardLayout title={titles[pathState]}>
      <Button
        variant="ghost"
        size="sm"
        className="mb-4 -ml-2"
        onClick={() => {
          if (pathState === 'grading') setStep('broad-type')
          else if (pathState === 'graded-company') setPathState('grading')
          else if (pathState === 'region') setPathState('grading')
          else if (pathState === 'metal') setPathState('region')
        }}
      >
        <ArrowLeft className="h-4 w-4 mr-1" />Back
      </Button>

      {pathState === 'grading' && renderOptions(GRADING_OPTIONS, handleGrading)}
      {pathState === 'graded-company' && renderOptions(GRADED_OPTIONS, handleGradedCompany)}
      {pathState === 'region' && renderOptions(REGION_OPTIONS, handleRegion)}
      {pathState === 'metal' && renderOptions(METAL_OPTIONS, handleMetal)}
    </WizardLayout>
  )
}
