'use client'

import React from 'react'
import { useWizard, WizardStep } from './WizardState'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

const STEP_ORDER: WizardStep[] = [
  'broad-type', 'coin-path', 'tcg-path', 'currency-path',
  'coin-graded', 'coin-ungraded', 'tcg-single', 'tcg-sealed',
  'images-references', 'pricing', 'review',
]

function getStepNumber(step: WizardStep): number {
  return STEP_ORDER.indexOf(step)
}

const progressSteps = [
  { label: 'Type', steps: ['broad-type', 'coin-path', 'tcg-path', 'currency-path'] as WizardStep[] },
  { label: 'Details', steps: ['coin-graded', 'coin-ungraded', 'tcg-single', 'tcg-sealed'] as WizardStep[] },
  { label: 'Media', steps: ['images-references'] as WizardStep[] },
  { label: 'Pricing', steps: ['pricing'] as WizardStep[] },
  { label: 'Review', steps: ['review'] as WizardStep[] },
]

interface WizardLayoutProps {
  children: React.ReactNode
  title?: string
}

export function WizardLayout({ children, title }: WizardLayoutProps) {
  const { step } = useWizard()
  const currentStepNum = getStepNumber(step)

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress indicator */}
      <div className="flex items-center justify-between mb-8">
        {progressSteps.map((ps, idx) => {
          const isActive = ps.steps.includes(step)
          const maxStepInGroup = Math.max(...ps.steps.map(s => getStepNumber(s)))
          const isDone = currentStepNum > maxStepInGroup
          return (
            <React.Fragment key={ps.label}>
              <div className="flex flex-col items-center gap-1">
                <div className={cn(
                  'h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
                  isDone ? 'bg-green-500 text-white' : isActive ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                )}>
                  {isDone ? <Check className="h-4 w-4" /> : idx + 1}
                </div>
                <span className={cn(
                  'text-xs font-medium hidden sm:block',
                  isActive ? 'text-blue-700' : isDone ? 'text-green-600' : 'text-gray-400'
                )}>
                  {ps.label}
                </span>
              </div>
              {idx < progressSteps.length - 1 && (
                <div className={cn('flex-1 h-0.5 mx-2', isDone ? 'bg-green-400' : 'bg-gray-200')} />
              )}
            </React.Fragment>
          )
        })}
      </div>

      {/* Step content */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sm:p-8">
        {title && (
          <h2 className="text-xl font-bold text-gray-900 mb-6">{title}</h2>
        )}
        {children}
      </div>
    </div>
  )
}
