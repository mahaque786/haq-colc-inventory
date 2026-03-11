'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Edit, ArrowLeft, Loader2, ExternalLink } from 'lucide-react'

const STATUS_COLORS: Record<string, any> = {
  DRAFT: 'secondary',
  ACTIVE: 'success',
  SOLD: 'outline',
  ARCHIVED: 'warning',
}

function DetailRow({ label, value }: { label: string; value?: string | null | number }) {
  if (!value && value !== 0) return null
  return (
    <div className="flex justify-between py-1.5 border-b border-gray-50 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-900">{value}</span>
    </div>
  )
}

export default function ItemDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [item, setItem] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    fetch(`/api/items/${id}`)
      .then(r => r.json())
      .then(data => { setItem(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="flex justify-center py-20">
      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
    </div>
  )

  if (!item || item.error) return (
    <div className="text-center py-20">
      <p className="text-gray-500">Item not found.</p>
      <Link href="/inventory"><Button variant="outline" className="mt-4">Back to Inventory</Button></Link>
    </div>
  )

  const title = item.customTitle || item.suggestedTitle || item.sku

  return (
    <div>
      <PageHeader title={title} description={`SKU: ${item.sku}`}>
        <Link href="/inventory">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <Link href={`/inventory/${id}/edit`}>
          <Button size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </Link>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Main details */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Item Overview</CardTitle>
                <Badge variant={STATUS_COLORS[item.status]}>{item.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <DetailRow label="Type" value={item.itemTypeCode} />
              <DetailRow label="SKU" value={item.sku} />
              <DetailRow label="Suggested Title" value={item.suggestedTitle} />
              <DetailRow label="Custom Title" value={item.customTitle} />
              <DetailRow label="Condition" value={item.conditionSummary} />
              <DetailRow label="Created" value={formatDate(item.createdAt)} />
              <DetailRow label="Updated" value={formatDate(item.updatedAt)} />
            </CardContent>
          </Card>

          <Tabs defaultValue="details">
            <TabsList>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="images">Images ({item.images?.length || 0})</TabsTrigger>
              <TabsTrigger value="references">References ({item.references?.length || 0})</TabsTrigger>
              <TabsTrigger value="notes">Notes ({item.notes?.length || 0})</TabsTrigger>
            </TabsList>

            <TabsContent value="details">
              <Card>
                <CardContent className="pt-4">
                  {/* Coin NGC */}
                  {item.coinNgc && (
                    <>
                      <DetailRow label="Year" value={item.coinNgc.year} />
                      <DetailRow label="Mint" value={item.coinNgc.mint} />
                      <DetailRow label="Denomination" value={item.coinNgc.denomination} />
                      <DetailRow label="Country" value={item.coinNgc.authorityCountry} />
                      <DetailRow label="Grade" value={item.coinNgc.grade} />
                      <DetailRow label="Cert #" value={item.coinNgc.certNumber} />
                      <DetailRow label="Series" value={item.coinNgc.series} />
                      <DetailRow label="Composition" value={item.coinNgc.composition} />
                      <DetailRow label="Variety" value={item.coinNgc.variety} />
                      <DetailRow label="Holder Notes" value={item.coinNgc.holderNotes} />
                    </>
                  )}
                  {/* Coin PCGS */}
                  {item.coinPcgs && (
                    <>
                      <DetailRow label="Year" value={item.coinPcgs.year} />
                      <DetailRow label="Mint" value={item.coinPcgs.mint} />
                      <DetailRow label="Denomination" value={item.coinPcgs.denomination} />
                      <DetailRow label="Country" value={item.coinPcgs.authorityCountry} />
                      <DetailRow label="Grade" value={item.coinPcgs.grade} />
                      <DetailRow label="Cert #" value={item.coinPcgs.certNumber} />
                    </>
                  )}
                  {/* Ungraded coins */}
                  {(() => {
                    const c = item.coinUngradedUSPrecious || item.coinUngradedUSNonPrecious || item.coinUngradedForeignPrecious || item.coinUngradedForeignNonPrecious
                    if (!c) return null
                    return (
                      <>
                        <DetailRow label="Year" value={c.year} />
                        <DetailRow label="Mint" value={c.mint} />
                        <DetailRow label="Denomination" value={c.denomination} />
                        <DetailRow label="Country" value={c.authorityCountry} />
                        <DetailRow label="Metal" value={c.metalType} />
                        <DetailRow label="Composition" value={c.composition} />
                        <DetailRow label="Weight (g)" value={c.weightGrams} />
                        <DetailRow label="Diameter (mm)" value={c.diameterMm} />
                      </>
                    )
                  })()}
                  {/* Paper currency */}
                  {item.paperCurrency && (
                    <>
                      <DetailRow label="Country" value={item.paperCurrency.country} />
                      <DetailRow label="Denomination" value={item.paperCurrency.denomination} />
                      <DetailRow label="Year/Series" value={item.paperCurrency.yearOrSeries} />
                      <DetailRow label="Serial #" value={item.paperCurrency.serialNumber} />
                      <DetailRow label="Grade" value={item.paperCurrency.grade} />
                      <DetailRow label="Cert #" value={item.paperCurrency.certNumber} />
                    </>
                  )}
                  {/* TCG */}
                  {(item.tcgSingleGraded || item.tcgSingleUngraded) && (() => {
                    const c = item.tcgSingleGraded || item.tcgSingleUngraded
                    return (
                      <>
                        <DetailRow label="Brand" value={c.brand} />
                        <DetailRow label="Set" value={c.setName} />
                        <DetailRow label="Card Name" value={c.cardName} />
                        <DetailRow label="Card #" value={c.cardNumber} />
                        <DetailRow label="Rarity" value={c.rarity} />
                        <DetailRow label="Language" value={c.language} />
                        {item.tcgSingleGraded && <DetailRow label="Grade" value={c.grade} />}
                        {item.tcgSingleGraded && <DetailRow label="Grading Co." value={c.gradingCompany} />}
                        {item.tcgSingleGraded && <DetailRow label="Cert #" value={c.certNumber} />}
                      </>
                    )
                  })()}
                  {(item.tcgSealedProduct || item.tcgSealedPack) && (() => {
                    const c = item.tcgSealedProduct || item.tcgSealedPack
                    return (
                      <>
                        <DetailRow label="Brand" value={c.brand} />
                        <DetailRow label="Set" value={c.setName} />
                        <DetailRow label="Product" value={c.productName} />
                        {item.tcgSealedProduct && <DetailRow label="Type" value={c.productType} />}
                        <DetailRow label="Release Year" value={c.releaseYear} />
                        <DetailRow label="Language" value={c.language} />
                        <DetailRow label="Seal Condition" value={c.sealCondition} />
                      </>
                    )
                  })()}
                  {!item.coinNgc && !item.coinPcgs && !item.coinUngradedUSPrecious && !item.coinUngradedUSNonPrecious && !item.coinUngradedForeignPrecious && !item.coinUngradedForeignNonPrecious && !item.paperCurrency && !item.tcgSingleGraded && !item.tcgSingleUngraded && !item.tcgSealedProduct && !item.tcgSealedPack && (
                    <p className="text-sm text-gray-400 py-4">No detailed data available.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="images">
              <Card>
                <CardContent className="pt-4">
                  {item.images?.length === 0 ? (
                    <p className="text-sm text-gray-400 py-4">No images attached.</p>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {item.images?.map((img: any) => (
                        <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                          {img.storageUrl ? (
                            <img src={img.storageUrl} alt={img.label || ''} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">{img.label || 'Image'}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="references">
              <Card>
                <CardContent className="pt-4">
                  {item.references?.length === 0 ? (
                    <p className="text-sm text-gray-400 py-4">No references.</p>
                  ) : (
                    <div className="space-y-2">
                      {item.references?.map((ref: any) => (
                        <div key={ref.id} className="flex items-start gap-2 py-2 border-b border-gray-50 last:border-0">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-800">{ref.label || ref.refType}</p>
                            {ref.url && <a href={ref.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 flex items-center gap-1 mt-0.5 hover:underline"><ExternalLink className="h-3 w-3" />{ref.url}</a>}
                            {ref.value && <p className="text-xs text-gray-500 mt-0.5">{ref.value}</p>}
                            {ref.notes && <p className="text-xs text-gray-400 mt-0.5">{ref.notes}</p>}
                          </div>
                          <Badge variant="secondary" className="text-xs">{ref.refType}</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notes">
              <Card>
                <CardContent className="pt-4">
                  {item.notes?.length === 0 ? (
                    <p className="text-sm text-gray-400 py-4">No notes.</p>
                  ) : (
                    <div className="space-y-3">
                      {item.notes?.map((note: any) => (
                        <div key={note.id} className="p-3 rounded-md bg-gray-50 border border-gray-100">
                          <div className="flex items-center justify-between mb-1">
                            <Badge variant="secondary" className="text-xs">{note.noteType}</Badge>
                            <span className="text-xs text-gray-400">{formatDate(note.createdAt)}</span>
                          </div>
                          <p className="text-sm text-gray-700 whitespace-pre-wrap">{note.body}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right: Pricing */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Pricing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Market Value</span>
                  <span className="text-sm font-semibold text-gray-900">{formatCurrency(item.marketValue)}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Listing Price</span>
                  <span className="text-sm font-semibold text-blue-700">{formatCurrency(item.listingPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Suggested Price</span>
                  <span className="text-sm font-medium text-gray-700">{formatCurrency(item.suggestedListingPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Target Net</span>
                  <span className="text-sm text-gray-600">{formatCurrency(item.targetNetProceeds)}</span>
                </div>
                {item.pricingNotes && (
                  <>
                    <Separator />
                    <p className="text-xs text-gray-500">{item.pricingNotes}</p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Public Listing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Ready?</span>
                  <Badge variant={item.isPublicReady ? 'success' : 'secondary'}>{item.isPublicReady ? 'Yes' : 'No'}</Badge>
                </div>
                {item.publicTitle && <DetailRow label="Public Title" value={item.publicTitle} />}
                {item.publicDescription && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-400 mb-1">Description</p>
                    <p className="text-sm text-gray-700">{item.publicDescription}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
