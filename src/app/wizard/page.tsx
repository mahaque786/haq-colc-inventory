'use client'

import { WizardProvider, useWizard } from '@/components/wizard/WizardState'
import { StepBroadType } from '@/components/wizard/StepBroadType'
import { StepCoinPath } from '@/components/wizard/StepCoinPath'
import { StepTCGPath } from '@/components/wizard/StepTCGPath'
import { StepCurrencyPath } from '@/components/wizard/StepCurrencyPath'
import { StepCoinGraded } from '@/components/wizard/StepCoinGraded'
import { StepCoinUngraded } from '@/components/wizard/StepCoinUngraded'
import { StepTCGSingle } from '@/components/wizard/StepTCGSingle'
import { StepTCGSealed } from '@/components/wizard/StepTCGSealed'
import { StepImagesReferences } from '@/components/wizard/StepImagesReferences'
import { StepPricing } from '@/components/wizard/StepPricing'
import { StepReview } from '@/components/wizard/StepReview'

function WizardContent() {
  const { step } = useWizard()

  return (
    <div className="py-4">
      {step === 'broad-type' && <StepBroadType />}
      {step === 'coin-path' && <StepCoinPath />}
      {step === 'tcg-path' && <StepTCGPath />}
      {step === 'currency-path' && <StepCurrencyPath />}
      {step === 'coin-graded' && <StepCoinGraded />}
      {step === 'coin-ungraded' && <StepCoinUngraded />}
      {step === 'tcg-single' && <StepTCGSingle />}
      {step === 'tcg-sealed' && <StepTCGSealed />}
      {step === 'images-references' && <StepImagesReferences />}
      {step === 'pricing' && <StepPricing />}
      {step === 'review' && <StepReview />}
    </div>
  )
}

export default function WizardPage() {
  return (
    <WizardProvider>
      <WizardContent />
    </WizardProvider>
  )
}
