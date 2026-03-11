'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Plus, Search, Filter, Eye, Edit, Loader2 } from 'lucide-react'

const STATUS_COLORS: Record<string, 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline'> = {
  DRAFT: 'secondary',
  ACTIVE: 'success',
  SOLD: 'outline',
  ARCHIVED: 'warning',
}

export default function InventoryPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [typeFilter, setTypeFilter] = useState('ALL')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortDir, setSortDir] = useState('desc')

  const fetchItems = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (statusFilter !== 'ALL') params.set('status', statusFilter)
      if (typeFilter !== 'ALL') params.set('type', typeFilter)
      params.set('sortBy', sortBy)
      params.set('sortDir', sortDir)
      const res = await fetch(`/api/items?${params}`)
      const data = await res.json()
      setItems(data.items || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [search, statusFilter, typeFilter, sortBy, sortDir])

  useEffect(() => {
    const timer = setTimeout(fetchItems, 300)
    return () => clearTimeout(timer)
  }, [fetchItems])

  return (
    <div>
      <PageHeader title="Inventory" description={`${items.length} items`}>
        <Link href="/wizard">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </Link>
      </PageHeader>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search items..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="SOLD">Sold</SelectItem>
                <SelectItem value="ARCHIVED">Archived</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Types</SelectItem>
                <SelectItem value="coin_ngc">NGC Graded</SelectItem>
                <SelectItem value="coin_pcgs">PCGS Graded</SelectItem>
                <SelectItem value="coin_us_precious">US Precious</SelectItem>
                <SelectItem value="coin_us_non_precious">US Non-Precious</SelectItem>
                <SelectItem value="coin_foreign_precious">Foreign Precious</SelectItem>
                <SelectItem value="coin_foreign_non_precious">Foreign Non-Precious</SelectItem>
                <SelectItem value="paper_currency">Paper Currency</SelectItem>
                <SelectItem value="tcg_single_graded">TCG Graded</SelectItem>
                <SelectItem value="tcg_single_ungraded">TCG Ungraded</SelectItem>
                <SelectItem value="tcg_sealed_product">TCG Sealed</SelectItem>
                <SelectItem value="tcg_sealed_pack">TCG Pack</SelectItem>
              </SelectContent>
            </Select>
            <Select value={`${sortBy}-${sortDir}`} onValueChange={(v) => {
              const [field, dir] = v.split('-')
              setSortBy(field)
              setSortDir(dir)
            }}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt-desc">Newest First</SelectItem>
                <SelectItem value="createdAt-asc">Oldest First</SelectItem>
                <SelectItem value="marketValue-desc">Value: High to Low</SelectItem>
                <SelectItem value="marketValue-asc">Value: Low to High</SelectItem>
                <SelectItem value="sku-asc">SKU A–Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      ) : items.length === 0 ? (
        <Card>
          <CardContent className="py-20 text-center text-gray-400">
            <p className="mb-4">No items found.</p>
            <Link href="/wizard"><Button variant="outline">Add Your First Item</Button></Link>
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Market Value</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Listing Price</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-xs font-mono text-gray-500">{item.sku}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900 text-sm max-w-xs truncate">
                      {item.customTitle || item.suggestedTitle || '—'}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{item.itemTypeCode}</td>
                  <td className="px-4 py-3">
                    <Badge variant={STATUS_COLORS[item.status] || 'secondary'}>{item.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(item.marketValue)}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(item.listingPrice)}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{formatDate(item.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Link href={`/inventory/${item.id}`}>
                        <Button variant="ghost" size="icon" title="View">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/inventory/${item.id}/edit`}>
                        <Button variant="ghost" size="icon" title="Edit">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
