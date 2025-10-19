export default function TestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Tailwind CSS Test</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4">Test Card 1</h2>
            <p className="text-gray-300 mb-4">This is a test card to verify Tailwind CSS is working properly.</p>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
              Test Button
            </button>
          </div>
          
          <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Test Card 2</h2>
            <p className="text-purple-100 mb-4">Gradient background test with proper text contrast.</p>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="text-sm text-white">Status: Working</span>
            </div>
          </div>
          
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4">Test Card 3</h2>
            <p className="text-gray-300 mb-4">Responsive grid layout test.</p>
            <div className="space-y-2">
              <div className="w-full bg-gray-700 rounded h-2">
                <div className="bg-purple-500 h-2 rounded" style={{width: '75%'}}></div>
              </div>
              <span className="text-sm text-gray-400">Progress: 75%</span>
            </div>
          </div>
        </div>
        
        <div className="mt-8 p-6 bg-green-600/20 border border-green-500 rounded-xl">
          <h3 className="text-lg font-bold text-green-400 mb-2">✅ Tailwind CSS Status</h3>
          <p className="text-green-200">
            If you can see this styled content, Tailwind CSS is working correctly!
          </p>
        </div>
      </div>
    </div>
  );
}
