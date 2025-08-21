import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Car, Zap, Shield, TrendingUp, Search, CheckCircle } from 'lucide-react';
import SearchAutocomplete from '@/components/search/SearchAutocomplete';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Car className="h-8 w-8 text-blue-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">Carbitrages</h1>
            </div>
            <div className="flex space-x-4">
              <Link href="/auth/login">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link href="/auth/register">
                <Button className="bg-blue-600 hover:bg-blue-700">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Revolutionary Car Buying
            <span className="text-blue-600 block">Made Simple</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Experience transparent, instant car buying with arbitrage-based pricing, 
            digital contracts, and a frictionless mobile experience. No more sales pressure, 
            no more hidden fees.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/search">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-8 py-3">
                Search Vehicles
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button size="lg" variant="outline" className="px-8 py-3">
                Get Started
              </Button>
            </Link>
            <Link href="/auth/register?role=dealer">
              <Button size="lg" variant="outline" className="px-8 py-3">
                Join as Dealer
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Search Section */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Find Your Perfect Vehicle</h2>
            <p className="text-gray-600">Search thousands of vehicles with transparent pricing</p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <SearchAutocomplete
              placeholder="Search by make, model, or location..."
              className="w-full"
              showRecentSearches={false}
            />
            
            <div className="flex flex-wrap gap-2 mt-4 justify-center">
              <span className="text-sm text-gray-500">Popular searches:</span>
              <Link href="/search?make=toyota" className="text-sm text-blue-600 hover:underline">Toyota</Link>
              <Link href="/search?make=honda" className="text-sm text-blue-600 hover:underline">Honda</Link>
              <Link href="/search?make=ford" className="text-sm text-blue-600 hover:underline">Ford</Link>
              <Link href="/search?bodyType=suv" className="text-sm text-blue-600 hover:underline">SUVs</Link>
              <Link href="/search?condition=new" className="text-sm text-blue-600 hover:underline">New Cars</Link>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <Zap className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Instant Contracts</h3>
            <p className="text-gray-600">
              Generate and sign purchase contracts with one tap using our integrated e-signature system.
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Transparent Pricing</h3>
            <p className="text-gray-600">
              See all fees and taxes calculated upfront with our real-time arbitrage-based pricing system.
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <CheckCircle className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Escrow Protection</h3>
            <p className="text-gray-600">
              Secure your purchase with our advanced escrow system and fraud prevention technology.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center bg-white rounded-lg shadow-sm p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to revolutionize your car buying experience?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of satisfied customers who have discovered a better way to buy cars.
          </p>
          <Link href="/auth/register">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-8 py-3">
              Get Started Today
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Car className="h-6 w-6 text-blue-400 mr-2" />
              <span className="text-lg font-semibold">Carbitrages</span>
            </div>
            <div className="text-sm text-gray-400">
              2025 Carbitrages. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
