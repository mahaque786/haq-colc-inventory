'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'

export type WizardStep =
  | 'broad-type'
  | 'coin-path'
  | 'tcg-path'
  | 'currency-path'
  | 'coin-graded'
  | 'coin-ungraded'
  | 'tcg-single'
  | 'tcg-sealed'
  | 'images-references'
  | 'pricing'
  | 'review'

export interface WizardData {
  itemTypeCode: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  details: Record<string, any>
  pricing: {
    marketValue?: string
    listingPrice?: string
    targetNetProceeds?: string
    platformFeePercent?: string
    paymentFeePercent?: string
    paymentFeeFixed?: string
    shippingCost?: string
    promotedPercent?: string
    pricingNotes?: string
  }
  notes: Array<{ noteType: string; body: string; isPublic: boolean }>
  references: Array<{ refType: string; label?: string; url?: string; value?: string; notes?: string }>
  images: Array<{ slotKey?: string; label?: string; storageUrl?: string; storagePath?: string }>
}

interface WizardContextType {
  step: WizardStep
  data: WizardData
  setStep: (step: WizardStep) => void
  updateData: (updates: Partial<WizardData>) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateDetails: (key: string, value: any) => void
  updatePricing: (key: string, value: string) => void
  addNote: (note: WizardData['notes'][0]) => void
  removeNote: (index: number) => void
  addReference: (ref: WizardData['references'][0]) => void
  removeReference: (index: number) => void
  reset: () => void
}

const initialData: WizardData = {
  itemTypeCode: '',
  details: {},
  pricing: {},
  notes: [],
  references: [],
  images: [],
}

const WizardContext = createContext<WizardContextType | null>(null)

export function WizardProvider({ children }: { children: React.ReactNode }) {
  const [step, setStep] = useState<WizardStep>('broad-type')
  const [data, setData] = useState<WizardData>(initialData)

  const updateData = useCallback((updates: Partial<WizardData>) => {
    setData(prev => ({ ...prev, ...updates }))
  }, [])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateDetails = useCallback((key: string, value: any) => {
    setData(prev => ({
      ...prev,
      details: { ...prev.details, [key]: value },
    }))
  }, [])

  const updatePricing = useCallback((key: string, value: string) => {
    setData(prev => ({
      ...prev,
      pricing: { ...prev.pricing, [key]: value },
    }))
  }, [])

  const addNote = useCallback((note: WizardData['notes'][0]) => {
    setData(prev => ({ ...prev, notes: [...prev.notes, note] }))
  }, [])

  const removeNote = useCallback((index: number) => {
    setData(prev => ({ ...prev, notes: prev.notes.filter((_, i) => i !== index) }))
  }, [])

  const addReference = useCallback((ref: WizardData['references'][0]) => {
    setData(prev => ({ ...prev, references: [...prev.references, ref] }))
  }, [])

  const removeReference = useCallback((index: number) => {
    setData(prev => ({ ...prev, references: prev.references.filter((_, i) => i !== index) }))
  }, [])

  const reset = useCallback(() => {
    setStep('broad-type')
    setData(initialData)
  }, [])

  return (
    <WizardContext.Provider value={{
      step, data, setStep, updateData, updateDetails,
      updatePricing, addNote, removeNote, addReference, removeReference, reset,
    }}>
      {children}
    </WizardContext.Provider>
  )
}

export function useWizard() {
  const ctx = useContext(WizardContext)
  if (!ctx) throw new Error('useWizard must be used within WizardProvider')
  return ctx
}
