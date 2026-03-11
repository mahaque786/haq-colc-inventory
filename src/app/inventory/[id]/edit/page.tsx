'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'

export default function EditItemPage() {
  const { id } = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [item, setItem] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<any>({})

  useEffect(() => {
    if (!id) return
    fetch(`/api/items/${id}`)
      .then(r => r.json())
      .then(data => {
        setItem(data)
        setForm({
          customTitle: data.customTitle || '',
          status: data.status || 'DRAFT',
          marketValue: data.marketValue || '',
          listingPrice: data.listingPrice || '',
          targetNetProceeds: data.targetNetProceeds || '',
          shippingCost: data.shippingCost || '',
          pricingNotes: data.pricingNotes || '',
          publicTitle: data.publicTitle || '',
          publicDescription: data.publicDescription || '',
          conditionSummary: data.conditionSummary || '',
          isPublicReady: data.isPublicReady || false,
        })
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/items/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        toast({ title: 'Saved', description: 'Item updated successfully.' })
        router.push(`/inventory/${id}`)
      } else {
        const err = await res.json()
        toast({ title: 'Error', description: err.error || 'Failed to save.', variant: 'destructive' })
      }
    } finally {
      setSaving(false)
    }
  }

  const set = (key: string, value: any) => setForm((f: any) => ({ ...f, [key]: value }))

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-blue-500" /></div>
  if (!item) return <div className="text-center py-20 text-gray-500">Item not found.</div>

  return (
    <div>
      <PageHeader title="Edit Item" description={`SKU: ${item.sku}`}>
        <Link href={`/inventory/${id}`}>
          <Button variant="outline" size="sm"><ArrowLeft className="h-4 w-4 mr-2" />Cancel</Button>
        </Link>
        <Button size="sm" onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          Save
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">General</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Status</Label>
              <Select value={form.status} onValueChange={v => set('status', v)}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="SOLD">Sold</SelectItem>
                  <SelectItem value="ARCHIVED">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Custom Title</Label>
              <Input className="mt-1" value={form.customTitle} onChange={e => set('customTitle', e.target.value)} placeholder={item.suggestedTitle} />
            </div>
            <div>
              <Label>Condition Summary</Label>
              <Input className="mt-1" value={form.conditionSummary} onChange={e => set('conditionSummary', e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Pricing</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Market Value ($)</Label>
              <Input type="number" className="mt-1" value={form.marketValue} onChange={e => set('marketValue', e.target.value)} />
            </div>
            <div>
              <Label>Listing Price ($)</Label>
              <Input type="number" className="mt-1" value={form.listingPrice} onChange={e => set('listingPrice', e.target.value)} />
            </div>
            <div>
              <Label>Target Net Proceeds ($)</Label>
              <Input type="number" className="mt-1" value={form.targetNetProceeds} onChange={e => set('targetNetProceeds', e.target.value)} />
            </div>
            <div>
              <Label>Shipping Cost ($)</Label>
              <Input type="number" className="mt-1" value={form.shippingCost} onChange={e => set('shippingCost', e.target.value)} />
            </div>
            <div>
              <Label>Pricing Notes</Label>
              <Textarea className="mt-1" value={form.pricingNotes} onChange={e => set('pricingNotes', e.target.value)} rows={2} />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Public Listing</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Public Title</Label>
              <Input className="mt-1" value={form.publicTitle} onChange={e => set('publicTitle', e.target.value)} />
            </div>
            <div>
              <Label>Public Description</Label>
              <Textarea className="mt-1" value={form.publicDescription} onChange={e => set('publicDescription', e.target.value)} rows={4} />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="isPublicReady" checked={form.isPublicReady} onChange={e => set('isPublicReady', e.target.checked)} className="h-4 w-4 rounded border-gray-300" />
              <Label htmlFor="isPublicReady">Mark as Public Ready</Label>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
