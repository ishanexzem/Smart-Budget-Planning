"use client"

import { useState, useEffect } from "react"
import Button from "../../../components/button"

interface ExpenseInputs {
  housing: number
  utilities: number
  groceries: number
  transportation: number
  insurance: number
  debtPayments: number
  otherEssential: number
  currentSavings: number
  monthlyContribution: number
}

interface CalculationResults {
  monthlyEssentials: number
  targetAmount: number
  amountNeeded: number
  monthsToTarget: number
  progressPercentage: number
  targetMonths: number
  scenarioName: string
}

interface TimelineItem {
  month: string
  amount: number
  isTarget: boolean
}

interface SavingsStrategy {
  title: string
  monthly: number
  months: number
  description: string
}

export default function EmergencyFundBuilder() {
  const [scenario, setScenario] = useState("single-stable")
  const [selectedPlan, setSelectedPlan] = useState(0)
  const [hasCalculated, setHasCalculated] = useState(false)

  const [expenses, setExpenses] = useState<ExpenseInputs>({
    housing: 1500,
    utilities: 200,
    groceries: 400,
    transportation: 300,
    insurance: 250,
    debtPayments: 500,
    otherEssential: 150,
    currentSavings: 2000,
    monthlyContribution: 400,
  })

  const [results, setResults] = useState<CalculationResults | null>(null)

  const scenarios = [
    {
      id: "single-stable",
      title: "Single Income, Stable Job",
      description: "3-6 months of expenses recommended",
      months: 6,
    },
    {
      id: "dual-stable",
      title: "Dual Income, Both Stable",
      description: "3 months of expenses recommended",
      months: 3,
    },
    {
      id: "variable-income",
      title: "Variable/Commission Income",
      description: "6-9 months of expenses recommended",
      months: 6,
    },
    {
      id: "self-employed",
      title: "Self-Employed/Business Owner",
      description: "9-12 months of expenses recommended",
      months: 9,
    },
  ]

  const calculateEmergencyFund = () => {
    const monthlyEssentials = Object.values(expenses).slice(0, 7).reduce((sum, val) => sum + val, 0)
    const selectedScenario = scenarios.find((s) => s.id === scenario)!
    const targetMonths = selectedScenario.months
    const targetAmount = monthlyEssentials * targetMonths
    const amountNeeded = Math.max(0, targetAmount - expenses.currentSavings)
    const monthsToTarget = expenses.monthlyContribution > 0 ? Math.ceil(amountNeeded / expenses.monthlyContribution) : 0
    const progressPercentage = targetAmount > 0 ? Math.min((expenses.currentSavings / targetAmount) * 100, 100) : 0

    setResults({
      monthlyEssentials,
      targetAmount,
      amountNeeded,
      monthsToTarget,
      progressPercentage,
      targetMonths,
      scenarioName: selectedScenario.title,
    })

    setHasCalculated(true)
  }

  const generateTimeline = (): TimelineItem[] => {
    if (!results || expenses.monthlyContribution <= 0 || expenses.currentSavings >= results.targetAmount) return []

    const timelineItems: TimelineItem[] = []
    let currentAmount = expenses.currentSavings
    const months = Math.min(results.monthsToTarget, 12)

    for (let i = 1; i <= months; i++) {
      currentAmount += expenses.monthlyContribution
      if (currentAmount > results.targetAmount) currentAmount = results.targetAmount

      const date = new Date()
      date.setMonth(date.getMonth() + i)

      timelineItems.push({
        month: date.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
        amount: currentAmount,
        isTarget: currentAmount >= results.targetAmount,
      })

      if (currentAmount >= results.targetAmount) break
    }

    return timelineItems
  }

  const generateSavingsStrategies = (): SavingsStrategy[] => {
    if (!results) return []

    return [
      {
        title: "Current Plan",
        monthly: expenses.monthlyContribution,
        months: results.monthsToTarget,
        description: "Continue with your current savings rate",
      },
      {
        title: "Accelerated Plan",
        monthly: expenses.monthlyContribution * 1.5,
        months: Math.ceil(results.amountNeeded / (expenses.monthlyContribution * 1.5)),
        description: "Increase savings by 50% to reach goal faster",
      },
      {
        title: "Fast Track",
        monthly: expenses.monthlyContribution * 2,
        months: Math.ceil(results.amountNeeded / (expenses.monthlyContribution * 2)),
        description: "Double your savings rate for rapid progress",
      },
    ]
  }

  const handleInputChange = (field: keyof ExpenseInputs, value: string) => {
    setExpenses((prev) => ({
      ...prev,
      [field]: Number.parseFloat(value) || 0,
    }))
    setHasCalculated(false)
  }

  useEffect(() => {
    setHasCalculated(false)
  }, [scenario])

  const timeline = hasCalculated ? generateTimeline() : []
  const strategies = hasCalculated ? generateSavingsStrategies() : []



  return (
    <div className="min-h-screen bg-white p-5 font-sans">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-green-400 text-white p-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">🛡️ Emergency Fund Builder Tool</h1>
          <p className="text-lg opacity-90">Build your financial safety net with confidence and clarity</p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-0 min-h-[600px]">
          {/* Input Section */}
          <div className="p-8 bg-gray-50 border-r border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-green-500">
              💰 Calculate Your Emergency Fund
            </h2>

            {/* Scenario Selector */}
            <div className="bg-white border-2 border-green-500 rounded-lg p-6 mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Choose Your Situation</h4>
              <div className="space-y-3">
                {scenarios.map((scenarioOption) => (
                  <label
                    key={scenarioOption.id}
                    className="flex items-center p-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <input
                      type="radio"
                      name="scenario"
                      value={scenarioOption.id}
                      checked={scenario === scenarioOption.id}
                      onChange={(e) => setScenario(e.target.value)}
                      className="mr-4 w-4 h-4 text-green-600"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800">{scenarioOption.title}</div>
                      <div className="text-sm text-gray-600">{scenarioOption.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Essential Monthly Expenses */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">🏠 Essential Monthly Expenses</h4>

              <div className="space-y-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-2">Housing (Rent/Mortgage)</label>
                  <input
                    type="number"
                    value={expenses.housing}
                    onChange={(e) => handleInputChange("housing", e.target.value)}
                    className="w-full p-3 border-2 text-slate-800 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none text-lg"
                    step="0.01"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-2">Utilities</label>
                    <input
                      type="number"
                      value={expenses.utilities}
                      onChange={(e) => handleInputChange("utilities", e.target.value)}
                      className="w-full p-3 border-2 text-slate-800 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none text-lg"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-2">Groceries</label>
                    <input
                      type="number"
                      value={expenses.groceries}
                      onChange={(e) => handleInputChange("groceries", e.target.value)}
                      className="w-full p-3 border-2 text-slate-800 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none text-lg"
                      step="0.01"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-2">Transportation</label>
                    <input
                      type="number"
                      value={expenses.transportation}
                      onChange={(e) => handleInputChange("transportation", e.target.value)}
                      className="w-full  text-slate-800 p-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none text-lg"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-2">Insurance</label>
                    <input
                      type="number"
                      value={expenses.insurance}
                      onChange={(e) => handleInputChange("insurance", e.target.value)}
                      className="w-full p-3 text-slate-800 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none text-lg"
                      step="0.01"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-2">Minimum Debt Payments</label>
                    <input
                      type="number"
                      value={expenses.debtPayments}
                      onChange={(e) => handleInputChange("debtPayments", e.target.value)}
                      className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none text-lg text-slate-800"
                      step="0.01" placeholder=""
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-2">Other Essential Expenses</label>
                    <input
                      type="number"
                      value={expenses.otherEssential}
                      onChange={(e) => handleInputChange("otherEssential", e.target.value)}
                      className="w-full p-3 border-2 border-gray-200 rounded-lg text-slate-800 focus:border-green-500 focus:outline-none text-lg "
                      step="0.01"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Current Emergency Fund Status */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">💳 Current Emergency Fund Status</h4>

              <div className="space-y-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-2">Current Emergency Savings</label>
                  <input
                    type="number"
                    value={expenses.currentSavings}
                    onChange={(e) => handleInputChange("currentSavings", e.target.value)}
                    className="w-full p-3 border-2 border-gray-200 text-slate-800 rounded-lg focus:border-green-500 focus:outline-none text-lg"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-2">Monthly Savings Capacity</label>
                  <input
                    type="number"
                    value={expenses.monthlyContribution}
                    onChange={(e) => handleInputChange("monthlyContribution", e.target.value)}
                    className="w-full p-3 border-2 border-gray-200 text-slate-800 rounded-lg focus:border-green-500 focus:outline-none text-lg"
                    step="0.01"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={calculateEmergencyFund}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-8 rounded-lg font-semibold text-lg hover:from-green-600 hover:to-green-700 transform hover:-translate-y-1 transition-all duration-200 shadow-lg"
            >
              🚀 Calculate My Emergency Fund Plan
            </button>
          </div>

          {/* Results Section */}
          
          <div className="p-8 bg-white">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-green-500">
              📊 Your Emergency Fund Plan
            </h2>

            {hasCalculated &&  results ? (

              <div className="space-y-6">
                {/* Success Alert */}
                <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg font-semibold">
                  🎯 Your emergency fund target: ${results.targetAmount.toLocaleString()} ({results.targetMonths} months
                  of essential expenses)
                </div>

                {/* Summary Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-5 text-center border-l-4 border-green-500">
                    <div className="text-3xl font-bold text-gray-800 mb-1">
                      ${results.monthlyEssentials.toLocaleString()}
                    </div>
                    <div className="text-gray-600 text-sm">Monthly Essential Expenses</div>
                  </div>
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-5 text-center border-l-4 border-green-500">
                    <div className="text-3xl font-bold text-gray-800 mb-1">
                      ${results.targetAmount.toLocaleString()}
                    </div>
                    <div className="text-gray-600 text-sm">Emergency Fund Target</div>
                  </div>
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-5 text-center border-l-4 border-green-500">
                    <div className="text-3xl font-bold text-gray-800 mb-1">
                      ${expenses.currentSavings.toLocaleString()}
                    </div>
                    <div className="text-gray-600 text-sm">Current Savings</div>
                  </div>
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-5 text-center border-l-4 border-green-500">
                    <div className="text-3xl font-bold text-gray-800 mb-1">{results.monthsToTarget}</div>
                    <div className="text-gray-600 text-sm">Months to Goal</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="relative bg-gray-200 rounded-full h-8 overflow-hidden">
  <div
    className="bg-gradient-to-r from-green-500 to-green-600 h-full text-white font-bold text-sm transition-all duration-500 pl-3 flex items-center"
    style={{ width: `${results.progressPercentage}%`, minWidth: "4rem" }} // Ensures visibility
  >
    {results.progressPercentage.toFixed(1)}% Complete
  </div>

  {/* Milestone markers */}
  {[25, 50, 75, 100].map((percent) => (
    <div
      key={percent}
      className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10"
      style={{ left: `${percent}%` }}
    >
      <div className="absolute -top-6 -left-4 bg-red-500 text-white text-xs px-1 rounded">
        {percent}%
      </div>
    </div>
  ))}
</div>


                {/* Savings Strategies or Congratulations */}
                {results.amountNeeded > 0 ? (
                  <div className="bg-green-50 border border-green-500 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-green-700 mb-4">📈 Accelerated Savings Strategies</h4>
                    <div className="space-y-3">
                      {strategies.map((strategy, index) => (
                        <div
                          key={index}
                          onClick={() => setSelectedPlan(index)}
                          className={`bg-white rounded-lg p-4 border-l-4 cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-1 ${
                            selectedPlan === index ? "border-green-600 bg-green-500 shadow-md" : "border-green-500"
                          }`}
                        >
                          <div className="font-semibold text-gray-800 mb-1">{strategy.title}</div>
                          <div className="text-gray-600 text-sm">
                            Save ${strategy.monthly.toLocaleString()}/month → Complete in {strategy.months} months
                            <br />
                            {strategy.description}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-green-50 border border-green-200 text-green-800 p-6 rounded-lg">
                    <div className="text-lg font-semibold mb-3">
                      🎉 Congratulations! You've already reached your emergency fund goal!
                    </div>
                    <div className="font-semibold mb-2">Recommendations:</div>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Keep your emergency fund in a high-yield savings account</li>
                      <li>Consider increasing your target if your situation changes</li>
                      <li>Start focusing on other financial goals like debt payoff or investing</li>
                    </ul>
                  </div>
                )}

                {/* Timeline */}
                {timeline.length > 0 && (
                  <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">📅 Your Savings Timeline</h4>
                    <div className="space-y-3">
                      {timeline.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0"
                        >
                          <div className="font-semibold text-green-600">{item.month}</div>
                          <div className={`font-semibold ${item.isTarget ? "text-green-600" : "text-gray-800"}`}>
                            ${item.amount.toLocaleString()}
                            {item.isTarget && " 🎯"}
                          </div>
                        </div>
                      ))}
                      {results.monthsToTarget > 12 && (
                        <div className="text-center text-gray-500 py-3">...continuing beyond 12 months</div>
                      )}
                    </div>
                  </div>
                )}

                {/* Best Practices */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">💡 Emergency Fund Best Practices</h4>
                  <ul className="space-y-3">
                    {[
                      {
                        icon: "💰",
                        title: "High-Yield Savings",
                        desc: "Keep your emergency fund in a separate, easily accessible account that earns interest",
                      },
                      {
                        icon: "🔄",
                        title: "Automate Savings",
                        desc: "Set up automatic transfers to build your fund consistently",
                      },
                      {
                        icon: "🎯",
                        title: "Start Small",
                        desc: "Even $500 can cover many unexpected expenses while you build toward your full goal",
                      },
                      {
                        icon: "📊",
                        title: "Review Regularly",
                        desc: "Update your target amount when your expenses or life situation changes",
                      },
                      {
                        icon: "🛡️",
                        title: "Separate from Investments",
                        desc: "Emergency funds should prioritize safety and liquidity over growth",
                      },
                      {
                        icon: "🔄",
                        title: "Replace When Used",
                        desc: "If you use emergency funds, prioritize rebuilding them quickly",
                      },
                    ].map((tip, index) => (
                      <li
                        key={index}
                        className="flex items-start space-x-3 py-2 border-b border-gray-200 last:border-b-0"
                      >
                        <span className="text-lg">{tip.icon}</span>
                        <div>
                          <span className="font-semibold text-gray-800">{tip.title}:</span>
                          <span className="text-gray-600 ml-1">{tip.desc}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Summary */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">📋 Your Emergency Fund Summary</h4>
                  <div className="text-gray-700 space-y-2 leading-relaxed">
                    <div>
                      <span className="font-semibold">Scenario:</span> {results.scenarioName}
                    </div>
                    <div>
                      <span className="font-semibold">Target Amount:</span> ${results.targetAmount.toLocaleString()} (
                      {results.targetMonths} months of expenses)
                    </div>
                    <div>
                      <span className="font-semibold">Amount Still Needed:</span> $
                      {results.amountNeeded.toLocaleString()}
                    </div>
                    <div>
                      <span className="font-semibold">Monthly Savings:</span> $
                      {expenses.monthlyContribution.toLocaleString()}
                    </div>
                    <div>
                      <span className="font-semibold">Estimated Completion:</span>{" "}
                      {results.monthsToTarget > 0 ? `${results.monthsToTarget} months` : "Goal already achieved!"}
                    </div>
                    <div>
                      <span className="font-semibold">Current Progress:</span> {results.progressPercentage.toFixed(1)}%
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
              <Button/>



              </div>


            ) : (
              <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg">
                Enter your expenses and current savings to see your personalized emergency fund strategy!
              </div>
            )}
          </div>
          
          
        </div>



      </div>
    </div>
  )
}
