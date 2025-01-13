const Dashboard = () => {
  return (
    <>
      <p className="text-sm text-gray-600 mb-6">
        Your snapshot for today, {new Date().toLocaleDateString('en-US', { 
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        })} at {new Date().toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        })} (Accra / GMT)
      </p>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 hover:shadow-lg transition-shadow duration-300 transform hover:scale-105">
          <p className="text-lg font-medium">GHS 0.00</p>
          <p className="text-sm text-gray-500">Gross payments</p>
        </div>

        <div className="bg-white rounded-lg p-6 hover:shadow-lg transition-shadow duration-300 transform hover:scale-105">
          <p className="text-lg font-medium">GHS 0.00</p>
          <p className="text-sm text-gray-500">Total refunds</p>
        </div>

        <div className="bg-[#00C9A7] text-white rounded-lg p-6 hover:shadow-lg transition-shadow duration-300 transform hover:scale-105">
          <p className="text-lg font-medium">GHS 0.00</p>
          <p className="text-sm">Net payments</p>
        </div>
      </div>

      <div className="bg-white rounded-lg p-8 text-center transform transition-all duration-300 hover:shadow-lg">
        <img src="/images/no-data.svg" alt="No data" className="w-24 h-24 mx-auto mb-4" />
        <p className="text-gray-500">
          You are seeing this because there is no data yet for this set period.
        </p>
      </div>
    </>
  );
};

export default Dashboard; 