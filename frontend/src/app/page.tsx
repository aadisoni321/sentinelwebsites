'use client';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation Bar */}
      <nav className="flex items-center justify-between px-8 py-6">
        <div className="text-2xl font-bold tracking-wide">
          SENTINEL
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          <a href="#" className="text-gray-300 hover:text-white transition-colors font-medium">
            Product
          </a>
          <a href="#" className="text-gray-300 hover:text-white transition-colors font-medium">
            Security
          </a>
          <a href="#" className="text-gray-300 hover:text-white transition-colors font-medium">
            Pricing
          </a>
        </div>
        
        <button className="btn-primary">
          Get Started
        </button>
      </nav>

      {/* Hero Section */}
      <section className="text-center py-20 px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
            They Hope You Forget.
          </h1>
          <h2 className="text-6xl md:text-7xl font-bold mb-12 text-blue-500">
            We Make Sure You Don't.
          </h2>
          
          <p className="text-xl md:text-2xl mb-4 text-gray-300">
            The Subscription Manager That
          </p>
          <p className="text-xl md:text-2xl mb-16 text-gray-300">
            Makes Your Wallet Smile.
          </p>
          
          <button className="btn-primary text-xl px-10 py-4">
            Start Free Trial
          </button>
        </div>
      </section>

      {/* Ocean Image Section */}
      <section className="px-8 mb-20">
        <div className="max-w-7xl mx-auto">
          <div className="relative h-96 md:h-[600px] rounded-3xl overflow-hidden bg-gradient-to-b from-blue-300 via-blue-500 to-blue-800 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-blue-900/50 to-transparent" />
          </div>
        </div>
      </section>

      {/* UNIFY Your Finances Section */}
      <section className="px-8 mb-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-8">
              <span className="text-blue-500">UNIFY</span> Your Finances.
            </h2>
          </div>

          {/* Centered Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
            {/* Netflix Card */}
            <div className="bg-red-600 text-white rounded-lg border-2 border-red-500 p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="text-3xl font-bold">N</div>
                <div className="text-right">
                  <div className="text-lg font-bold">2</div>
                  <div className="text-sm">DAYS</div>
                </div>
              </div>
              <div className="text-sm font-semibold">Expiring</div>
              <div className="text-sm">Trial</div>
            </div>

            {/* July Card */}
            <div className="bg-blue-600 text-white rounded-lg border-2 border-blue-500 p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="text-lg font-bold">JULY</div>
                <div className="text-2xl">📑</div>
              </div>
              <div className="text-2xl font-bold">$342.89</div>
              <div className="text-sm opacity-80">Secured</div>
            </div>

            {/* Activity Card */}
            <div className="bg-orange-600 text-white rounded-lg border-2 border-orange-500 p-6 shadow-lg">
              <div className="text-sm font-bold mb-2">ACTIVITY</div>
              <div className="text-xs opacity-80 mb-2">Charges Blocked</div>
              <div className="text-2xl font-bold">$349.09</div>
              <div className="flex items-center space-x-2 mt-4">
                <div className="w-8 h-8 bg-green-500 rounded border-2 border-green-400 flex items-center justify-center">
                  <span className="text-xs font-bold">H</span>
                </div>
                <div className="w-8 h-8 bg-blue-500 rounded border-2 border-blue-400 flex items-center justify-center">
                  <span className="text-xs font-bold">A</span>
                </div>
                <div className="w-8 h-8 bg-purple-500 rounded border-2 border-purple-400 flex items-center justify-center">
                  <span className="text-xs font-bold">R</span>
                </div>
              </div>
            </div>

            {/* Spotify Card */}
            <div className="bg-green-600 text-white rounded-lg border-2 border-green-500 p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="text-2xl">🎵</div>
              </div>
              <div className="text-2xl font-bold">$9.99</div>
              <div className="text-sm font-semibold mt-2">Cancel</div>
              <div className="text-sm">You Save: $109.89</div>
            </div>

            {/* Expiring Notification */}
            <div className="bg-yellow-600 text-white rounded-lg border-2 border-yellow-500 p-6 shadow-lg">
              <div className="text-sm font-bold mb-2">⚠️ Expiring...</div>
              <div className="flex space-x-2">
                <div className="w-8 h-8 bg-green-500 rounded border-2 border-green-400"></div>
                <div className="w-8 h-8 bg-blue-500 rounded border-2 border-blue-400"></div>
                <div className="w-8 h-8 bg-purple-500 rounded border-2 border-purple-400"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Section */}
      <section className="bg-slate-900 py-20 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            
            {/* Subscriptions Cancelled */}
            <div className="card-rectangular">
              <h3 className="text-sm font-bold text-blue-400 mb-4 tracking-wide">
                SUBSCRIPTIONS CANCELLED
              </h3>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 bg-blue-400 rounded-full"></div>
                </div>
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <div className="w-6 h-6 bg-blue-400 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Reading Instructions */}
            <div className="card-rectangular">
              <h3 className="text-sm font-bold text-blue-400 mb-4 tracking-wide">
                READING INSTRUCTIONS
              </h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <span className="text-white font-bold text-lg">1.</span>
                  <span className="text-xs text-gray-300">
                    USE GET PLAN TO GET THE CUSTOMER DETAILS
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-white font-bold text-lg">2.</span>
                  <span className="text-xs text-gray-300">
                    CONFIRM PRICING
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-white font-bold text-lg">3.</span>
                  <span className="text-xs text-gray-300">
                    CONFIRM MONTHLY / ANNUAL BILL TO PROCEED
                  </span>
                </div>
              </div>
            </div>

            {/* Finances */}
            <div className="card-rectangular">
              <h3 className="text-sm font-bold text-blue-400 mb-4 tracking-wide">
                FINANCES
              </h3>
              <div className="space-y-4">
                <div className="flex items-end space-x-1 h-20">
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-blue-500 flex-1 rounded-sm"
                      style={{
                        height: `${Math.random() * 80 + 20}%`
                      }}
                    ></div>
                  ))}
                </div>
                <div className="text-xs text-gray-400">
                  Monthly spending analysis
                </div>
              </div>
            </div>

            {/* Performance */}
            <div className="card-rectangular">
              <h3 className="text-sm font-bold text-blue-400 mb-4 tracking-wide">
                PERFORMANCE
              </h3>
              <div className="relative h-20">
                <svg className="w-full h-full">
                  <polyline
                    points="0,60 20,45 40,30 60,25 80,35 100,20"
                    stroke="#3b82f6"
                    strokeWidth="3"
                    fill="none"
                  />
                </svg>
              </div>
            </div>

            {/* Total Saved */}
            <div className="card-rectangular">
              <h3 className="text-sm font-bold text-blue-400 mb-4 tracking-wide">
                TOTAL SAVED
              </h3>
              <div className="text-3xl font-bold text-green-400">
                $1,247.50
              </div>
            </div>

            {/* Active Subscriptions */}
            <div className="card-rectangular">
              <h3 className="text-sm font-bold text-blue-400 mb-4 tracking-wide">
                ACTIVE SUBSCRIPTIONS
              </h3>
              <div className="space-y-2">
                <div className="text-xs text-gray-300">• Netflix - $24.99/month</div>
                <div className="text-xs text-gray-300">• Spotify - $9.99/month</div>
                <div className="text-xs text-gray-300">• Adobe - $52.99/month</div>
              </div>
            </div>

            {/* Trial Alerts */}
            <div className="card-rectangular">
              <h3 className="text-sm font-bold text-blue-400 mb-4 tracking-wide">
                TRIAL ALERTS
              </h3>
              <div className="space-y-2">
                <div className="text-xs text-red-400">• Hulu expires in 2 days</div>
                <div className="text-xs text-yellow-400">• Disney+ expires in 5 days</div>
              </div>
            </div>

            {/* Monthly Savings */}
            <div className="card-rectangular">
              <h3 className="text-sm font-bold text-blue-400 mb-4 tracking-wide">
                MONTHLY SAVINGS
              </h3>
              <div className="text-2xl font-bold text-green-400">$127.50</div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
} 