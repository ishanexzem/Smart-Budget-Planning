import React, { useState } from 'react'




interface BudgetData {
  primaryIncome: number
  sideIncome: number
  investmentIncome: number
  otherIncome: number
  housing: number
  utilities: number
  groceries: number
  transportation: number
  insurance: number
  minimumDebt: number
  diningOut: number
  entertainment: number
  shopping: number
  subscriptions: number
  personalCare: number
  hobbies: number
  emergencyFund: number
  retirement: number
  investments: number
  extraDebt: number
}
const Anaylsis = () => {
    
     const [budgetData, setBudgetData] = useState<BudgetData>({
        primaryIncome: 5000,
        sideIncome: 0,
        investmentIncome: 0,
        otherIncome: 0,
        housing: 1250,
        utilities: 200,
        groceries: 400,
        transportation: 300,
        insurance: 250,
        minimumDebt: 100,
        diningOut: 300,
        entertainment: 200,
        shopping: 250,
        subscriptions: 50,
        personalCare: 100,
        hobbies: 150,
        emergencyFund: 500,
        retirement: 400,
        investments: 200,
        extraDebt: 300,
      })
      
  const getRecommendations = () => {
    const recommendations = []

    if (summary.needsPercentage > 50) {
      recommendations.push("Your needs exceed 50% of income. Consider reducing housing or transportation costs.")
    }
    if (summary.wantsPercentage > 30) {
      recommendations.push("Your wants exceed 30% of income. Try cutting back on dining out or entertainment.")
    }
    if (summary.savingsPercentage < 20) {
      recommendations.push("Increase your savings rate to at least 20% for better financial security.")
    }
    if (summary.remaining < 0) {
      recommendations.push("You're spending more than you earn. Review and cut unnecessary expenses immediately.")
    }
    if (summary.savingsPercentage >= 20 && summary.needsPercentage <= 50 && summary.wantsPercentage <= 30) {
      recommendations.push("Excellent! You're following the 50/30/20 rule perfectly.")
    }

    return recommendations.length > 0
      ? recommendations
      : ["Enter your budget information to receive personalized recommendations"]
  }
   const calculateBudgetSummary = () => {
    const totalIncome =
      budgetData.primaryIncome + budgetData.sideIncome + budgetData.investmentIncome + budgetData.otherIncome

    const needs =
      budgetData.housing +
      budgetData.utilities +
      budgetData.groceries +
      budgetData.transportation +
      budgetData.insurance +
      budgetData.minimumDebt
    const wants =
      budgetData.diningOut +
      budgetData.entertainment +
      budgetData.shopping +
      budgetData.subscriptions +
      budgetData.personalCare +
      budgetData.hobbies
    const savings = budgetData.emergencyFund + budgetData.retirement + budgetData.investments + budgetData.extraDebt

    const totalExpenses = needs + wants + savings
    const remaining = totalIncome - totalExpenses

    const needsPercentage = totalIncome > 0 ? (needs / totalIncome) * 100 : 0
    const wantsPercentage = totalIncome > 0 ? (wants / totalIncome) * 100 : 0
    const savingsPercentage = totalIncome > 0 ? (savings / totalIncome) * 100 : 0

    return {
      totalIncome,
      totalExpenses,
      remaining,
      needs,
      wants,
      savings,
      needsPercentage,
      wantsPercentage,
      savingsPercentage,
    }
  }
  const summary = calculateBudgetSummary()
   const getBudgetHealthScore = () => {
    let score = 100

    if (summary.needsPercentage > 50) score -= 20
    if (summary.wantsPercentage > 30) score -= 15
    if (summary.savingsPercentage < 20) score -= 25
    if (summary.remaining < 0) score -= 40

    return Math.max(0, score)
  }

  return (
    <div>
      
          <div className="p-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">📊 Budget Analysis & Insights</h2>

            {/* Recommendations */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <h4 className="text-lg font-bold text-slate-800 mb-4">💡 Personalized Recommendations</h4>
              <ul className="space-y-3">
                {getRecommendations().map((recommendation, index) => (
                  <li key={index} className="text-gray-700 pb-3 border-b border-blue-100 last:border-b-0">
                    {recommendation}
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Category Analysis */}
              <div>
                <h4 className="text-lg font-bold text-slate-800 mb-4">Category Spending Analysis</h4>
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span className="font-semibold text-slate-800">Needs</span>
                      <div className="text-right">
                        <div className="font-bold  text-gray-700">${summary.needs.toLocaleString()}</div>
                        <div className="text-sm text-gray-600">{summary.needsPercentage.toFixed(1)}%</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span className="font-semibold text-slate-800">Wants</span>
                      <div className="text-right">
                        <div className="font-bold text-gray-700">${summary.wants.toLocaleString()}</div>
                        <div className="text-sm text-gray-600">{summary.wantsPercentage.toFixed(1)}%</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span className="font-semibold text-slate-800">Savings & Debt</span>
                      <div className="text-right">
                        <div className="font-bold  text-gray-700">${summary.savings.toLocaleString()}</div>
                        <div className="text-sm text-gray-600">{summary.savingsPercentage.toFixed(1)}%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Budget Health Score */}
              <div>
                <h4 className="text-lg font-bold text-slate-800 mb-4">Budget Health Score</h4>
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="text-center">
                    <div
                      className={`text-6xl font-bold mb-4 ${
                        getBudgetHealthScore() >= 80
                          ? "text-green-600"
                          : getBudgetHealthScore() >= 60
                            ? "text-yellow-600"
                            : "text-red-600"
                      }`}
                    >
                      {getBudgetHealthScore()}
                    </div>
                    <div className="text-gray-600 mb-4">out of 100</div>
                    <div
                      className={`px-4 py-2 rounded-full text-white font-semibold ${
                        getBudgetHealthScore() >= 80
                          ? "bg-green-500"
                          : getBudgetHealthScore() >= 60
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                    >
                      {getBudgetHealthScore() >= 80
                        ? "Excellent"
                        : getBudgetHealthScore() >= 60
                          ? "Good"
                          : "Needs Improvement"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        
    </div>
  )
}

export default Anaylsis
