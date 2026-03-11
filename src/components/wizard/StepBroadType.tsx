'use client'

import { useWizard } from './WizardState'
import { WizardLayout } from './WizardLayout'
import { cn } from '@/lib/utils'
import { Coins, CreditCard, Package2 } from 'lucide-react'

const BROAD_TYPES = [
  {
    id: 'coin',
    label: 'Coin',
    description: 'Graded (NGC/PCGS) or raw coins, US or foreign, precious or non-precious',
    icon: Coins,
    color: 'yellow',
  },
  {
    id: 'currency',
    label: 'Paper Currency',
    description: 'Banknotes, paper money, currency notes from any country',
    icon: CreditCard,
    color: 'green',
  },
  {
    id: 'tcg',
    label: 'Trading Card Game',
    description: 'Pokémon, Magic: The Gathering, Yu-Gi-Oh!, sports cards — graded, raw, or sealed',
    icon: Package2,
    color: 'blue',
  },
]

export function StepBroadType() {
  const { setStep, updateData } = useWizard()

  const handleSelect = (typeId: string) => {
    if (typeId === 'coin') {
      setStep('coin-path')
    } else if (typeId === 'currency') {
      updateData({ itemTypeCode: 'paper_currency' })
      setStep('currency-path')
    } else if (typeId === 'tcg') {
      setStep('tcg-path')
    }
  }

  return (
    <WizardLayout title="What type of item is this?">
      <div className="grid grid-cols-1 gap-4">
        {BROAD_TYPES.map((type) => {
          const Icon = type.icon
          return (
            <button
              key={type.id}
              onClick={() => handleSelect(type.id)}
              className={cn(
                'flex items-start gap-4 p-5 rounded-lg border-2 text-left transition-all hover:border-blue-400 hover:bg-blue-50',
                'border-gray-200 bg-white'
              )}
            >
              <div className={cn(
                'h-12 w-12 rounded-lg flex items-center justify-center flex-shrink-0',
                type.color === 'yellow' ? 'bg-yellow-100' :
                type.color === 'green' ? 'bg-green-100' : 'bg-blue-100'
              )}>
                <Icon className={cn(
                  'h-6 w-6',
                  type.color === 'yellow' ? 'text-yellow-600' :
                  type.color === 'green' ? 'text-green-600' : 'text-blue-600'
                )} />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-base">{type.label}</p>
                <p className="text-sm text-gray-500 mt-0.5">{type.description}</p>
              </div>
            </button>
          )
        })}
      </div>
    </WizardLayout>
  )
}
