'use client'

import { useState, useEffect } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import { X, Search } from 'lucide-react'

export default function ComparePage() {
  const [selectedItems, setSelectedItems] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [searching, setSearching] = useState(false)

  const searchItems = async (q: string) => {
    if (!q.trim()) { setSearchResults([]); return }
    setSearching(true)
    try {
      const res = await fetch(`/api/items?search=${encodeURIComponent(q)}&limit=10`)
      const data = await res.json()
      setSearchResults(data.items || [])
    } finally {
      setSearching(false)
    }
  }

  useEffect(() => {
    const t = setTimeout(() => searchItems(searchQuery), 300)
    return () => clearTimeout(t)
  }, [searchQuery])

  const addItem = (item: any) => {
    if (selectedItems.find(i => i.id === item.id)) return
    if (selectedItems.length >= 4) return
    setSelectedItems([...selectedItems, item])
    setSearchQuery('')
    setSearchResults([])
  }

  const removeItem = (id: string) => setSelectedItems(selectedItems.filter(i => i.id !== id))

  const compareFields = [
    { label: 'SKU', key: 'sku' },
    { label: 'Type', key: 'itemTypeCode' },
    { label: 'Status', key: 'status' },
    { label: 'Market Value', key: 'marketValue', format: formatCurrency },
    { label: 'Listing Price', key: 'listingPrice', format: formatCurrency },
    { label: 'Suggested Price', key: 'suggestedListingPrice', format: formatCurrency },
  ]

  return (
    <div>
      <PageHeader title="Compare Items" description="Compare up to 4 items side by side" />

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search to add items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
                disabled={selectedItems.length >= 4}
              />
            </div>
          </div>
          {searchResults.length > 0 && (
            <div className="mt-2 border border-gray-200 rounded-md overflow-hidden shadow-sm">
              {searchResults.map((item) => (
                <button
                  key={item.id}
                  onClick={() => addItem(item)}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 border-b border-gray-100 last:border-0 flex items-center justify-between"
                >
                  <span className="font-medium text-gray-800">{item.customTitle || item.suggestedTitle || item.sku}</span>
                  <span className="text-xs text-gray-400">{item.sku}</span>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedItems.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-gray-400">
            <p>Search and add items above to compare them.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="w-32 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Field</th>
                {selectedItems.map((item) => (
                  <th key={item.id} className="px-4 py-3 text-left">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium text-gray-800 max-w-xs truncate">
                        {item.customTitle || item.suggestedTitle || item.sku}
                      </span>
                      <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-gray-600">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <Badge variant="secondary" className="text-xs mt-1">{item.status}</Badge>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {compareFields.map((field) => (
                <tr key={field.key} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-500 font-medium">{field.label}</td>
                  {selectedItems.map((item) => (
                    <td key={item.id} className="px-4 py-3 text-sm text-gray-900">
                      {field.format ? field.format(item[field.key]) : (item[field.key] || '—')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
