const TransactionHistory = () => {
  return (
    <div>
      <h2 className="text-2xl font-medium mb-6">Transaction History</h2>
      <div className="bg-white rounded-lg p-8 text-center">
        <img src="/images/no-data.svg" alt="No data" className="w-24 h-24 mx-auto mb-4" />
        <p className="text-gray-500">No transactions available.</p>
      </div>
    </div>
  );
};

export default TransactionHistory; 