import React from 'react'

const button = () => {
  return (
    <div>
       <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => window.print()}
                    className="bg-blue-400 text-white px-6 py-3 rounded-md font-semibold hover:from-blue-600 hover:to-blue-700  transition-all duration-200 transform hover:-translate-y-1"
                  >
                    🖨️ Print Your Plan
                  </button>
                  <button
                    onClick={() =>
                      alert(
                        "PDF export feature would be implemented with a PDF library like jsPDF in a production environment. For now, you can use the print function and save as PDF.",
                      )
                    }
                    className="bg-blue-400 text-white px-6 py-3 rounded-md font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:-translate-y-1"
                  >
                    📄 Export to PDF
                  </button>
                </div>
    </div>
  )
}

export default button
