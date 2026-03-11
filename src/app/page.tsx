import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/layout/PageHeader'
import { Package, Plus, TrendingUp, Archive, List, Coins } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Overview of your collectibles inventory"
      >
        <Link href="/wizard">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </Link>
      </PageHeader>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Items</p>
                <p className="text-3xl font-bold text-gray-900">—</p>
              </div>
              <Package className="h-8 w-8 text-blue-500 opacity-80" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Active Listings</p>
                <p className="text-3xl font-bold text-gray-900">—</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500 opacity-80" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Drafts</p>
                <p className="text-3xl font-bold text-gray-900">—</p>
              </div>
              <Archive className="h-8 w-8 text-yellow-500 opacity-80" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Sold</p>
                <p className="text-3xl font-bold text-gray-900">—</p>
              </div>
              <Coins className="h-8 w-8 text-purple-500 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <Link href="/wizard" className="flex flex-col items-center text-center gap-3">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Plus className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Add New Item</p>
                <p className="text-sm text-gray-500 mt-1">Use the wizard to catalog a new collectible</p>
              </div>
            </Link>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <Link href="/inventory" className="flex flex-col items-center text-center gap-3">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <List className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Browse Inventory</p>
                <p className="text-sm text-gray-500 mt-1">Search and filter your collection</p>
              </div>
            </Link>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <Link href="/compare" className="flex flex-col items-center text-center gap-3">
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Compare Items</p>
                <p className="text-sm text-gray-500 mt-1">Side-by-side comparison view</p>
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Items placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-400">
            <Package className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No items yet. <Link href="/wizard" className="text-blue-600 hover:underline">Add your first item</Link></p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
