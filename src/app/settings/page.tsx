'use client'

import { useState, useEffect } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2 } from 'lucide-react'

export default function SettingsPage() {
  const [itemTypes, setItemTypes] = useState<any[]>([])
  const [sealedTypes, setSealedTypes] = useState<any[]>([])
  const [platforms, setPlatforms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/lookup/item-types').then(r => r.json()),
      fetch('/api/lookup/sealed-product-types').then(r => r.json()),
      fetch('/api/lookup/pricing-platforms').then(r => r.json()),
    ]).then(([types, sealed, plats]) => {
      setItemTypes(types.itemTypes || [])
      setSealedTypes(sealed.sealedProductTypes || [])
      setPlatforms(plats.pricingPlatforms || [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-blue-500" /></div>

  return (
    <div>
      <PageHeader title="Settings" description="Manage lookup tables and application configuration" />

      <Tabs defaultValue="item-types">
        <TabsList className="mb-4">
          <TabsTrigger value="item-types">Item Types</TabsTrigger>
          <TabsTrigger value="sealed-products">Sealed Products</TabsTrigger>
          <TabsTrigger value="platforms">Pricing Platforms</TabsTrigger>
        </TabsList>

        <TabsContent value="item-types">
          <Card>
            <CardHeader><CardTitle className="text-base">Item Types ({itemTypes.length})</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2">
                {itemTypes.map((t) => (
                  <div key={t.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{t.label}</p>
                      {t.description && <p className="text-xs text-gray-400">{t.description}</p>}
                    </div>
                    <Badge variant="secondary" className="font-mono text-xs">{t.code}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sealed-products">
          <Card>
            <CardHeader><CardTitle className="text-base">Sealed Product Types ({sealedTypes.length})</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2">
                {sealedTypes.map((t) => (
                  <div key={t.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <p className="text-sm font-medium text-gray-800">{t.name}</p>
                    <Badge variant="secondary">{t.brand}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="platforms">
          <Card>
            <CardHeader><CardTitle className="text-base">Pricing Platforms ({platforms.length})</CardTitle></CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-2 pr-4 font-medium text-gray-500">Platform</th>
                      <th className="text-right py-2 pr-4 font-medium text-gray-500">Platform Fee</th>
                      <th className="text-right py-2 pr-4 font-medium text-gray-500">Payment Fee %</th>
                      <th className="text-right py-2 pr-4 font-medium text-gray-500">Payment Fixed</th>
                      <th className="text-right py-2 font-medium text-gray-500">Promoted %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {platforms.map((p) => (
                      <tr key={p.id} className="border-b border-gray-50 last:border-0">
                        <td className="py-2 pr-4 font-medium text-gray-800">{p.name}</td>
                        <td className="py-2 pr-4 text-right text-gray-600">{(parseFloat(p.feePercent) * 100).toFixed(2)}%</td>
                        <td className="py-2 pr-4 text-right text-gray-600">{(parseFloat(p.paymentFeePercent) * 100).toFixed(2)}%</td>
                        <td className="py-2 pr-4 text-right text-gray-600">${parseFloat(p.paymentFeeFixed).toFixed(2)}</td>
                        <td className="py-2 text-right text-gray-600">{p.promotedListingPercent ? `${(parseFloat(p.promotedListingPercent) * 100).toFixed(1)}%` : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
