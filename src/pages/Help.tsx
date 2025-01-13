const Help = () => {
  return (
    <div>
      <h2 className="text-2xl font-medium mb-6">Help & Support</h2>
      <div className="bg-white rounded-lg p-8">
        <h3 className="text-xl font-medium mb-4">Need Assistance?</h3>
        <p className="text-gray-600 mb-4">
          Contact our support team for help with any issues or questions you may have.
        </p>
        <div className="space-y-4">
          <div className="flex items-center">
            <i className="bi bi-envelope mr-3 text-[#00C9A7]"></i>
            <span>support@example.com</span>
          </div>
          <div className="flex items-center">
            <i className="bi bi-telephone mr-3 text-[#00C9A7]"></i>
            <span>+233 XX XXX XXXX</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help; 