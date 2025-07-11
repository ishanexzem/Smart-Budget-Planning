"use client"

import { useState } from "react"

interface Expense {
  id: string
  date: string
  description: string
  amount: number
  category: string
}

interface Goal {
  id: string
  name: string
  target: number
  current: number
  targetDate: string
}

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

export default function BudgetPlanner() {
  const [activeTab, setActiveTab] = useState("monthly-budget")
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [goals, setGoals] = useState<Goal[]>([])
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

  const [expenseForm, setExpenseForm] = useState({
    date: new Date().toISOString().split("T")[0],
    description: "",
    amount: "",
    category: "groceries",
  })

  const [goalForm, setGoalForm] = useState({
    name: "",
    target: "",
    current: "",
    targetDate: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  })

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

  const addExpense = () => {
    if (!expenseForm.description || !expenseForm.amount) return

    const newExpense: Expense = {
      id: Date.now().toString(),
      date: expenseForm.date,
      description: expenseForm.description,
      amount: Number.parseFloat(expenseForm.amount),
      category: expenseForm.category,
    }

    setExpenses([...expenses, newExpense])
    setExpenseForm({
      ...expenseForm,
      description: "",
      amount: "",
    })
  }

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter((expense) => expense.id !== id))
  }

  const addGoal = () => {
    if (!goalForm.name || !goalForm.target) return

    const newGoal: Goal = {
      id: Date.now().toString(),
      name: goalForm.name,
      target: Number.parseFloat(goalForm.target),
      current: Number.parseFloat(goalForm.current) || 0,
      targetDate: goalForm.targetDate,
    }

    setGoals([...goals, newGoal])
    setGoalForm({
      name: "",
      target: "",
      current: "",
      targetDate: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    })
  }

  const updateBudgetField = (field: keyof BudgetData, value: string) => {
    setBudgetData({
      ...budgetData,
      [field]: Number.parseFloat(value) || 0,
    })
  }

  const summary = calculateBudgetSummary()

  const expenseStats = {
    total: expenses.reduce((sum, expense) => sum + expense.amount, 0),
    count: expenses.length,
    dailyAverage:
      expenses.length > 0 ? expenses.reduce((sum, expense) => sum + expense.amount, 0) / expenses.length : 0,
    largest: expenses.length > 0 ? Math.max(...expenses.map((e) => e.amount)) : 0,
  }

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

  const getBudgetHealthScore = () => {
    let score = 100

    if (summary.needsPercentage > 50) score -= 20
    if (summary.wantsPercentage > 30) score -= 15
    if (summary.savingsPercentage < 20) score -= 25
    if (summary.remaining < 0) score -= 40

    return Math.max(0, score)
  }

  return (
    <div className="min-h-screen bg-white p-5 font-sans">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white p-8 text-center">
          <h1 className="text-4xl font-bold mb-3">📊 Smart Budget Planning Spreadsheet</h1>
          <p className="text-lg opacity-90">Take control of your finances with our comprehensive budgeting tool</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex bg-gray-50 border-b border-gray-200">
          {[
            { id: "monthly-budget", label: "Monthly Budget" },
            { id: "expense-tracker", label: "Expense Tracker" },
            { id: "analysis", label: "Analysis & Insights" },
            { id: "goals", label: "Financial Goals" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 font-semibold text-base transition-all duration-300 border-b-4 ${
                activeTab === tab.id
                  ? "text-slate-800 bg-white border-blue-500"
                  : "text-gray-600 bg-gray-50 border-transparent hover:text-slate-800 hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Monthly Budget Tab */}
        {activeTab === "monthly-budget" && (
          <div className="p-8">
            {/* Budget Formula */}
            <div className="bg-gray-50 border-2 border-dashed border-blue-500 rounded-lg p-6 mb-8 text-center">
              <div className="text-xl font-bold text-slate-800 mb-3">🎯 The 50/30/20 Budget Rule</div>
              <div className="text-lg text-gray-700 font-mono bg-white px-4 py-2 rounded-md inline-block">
                50% Needs + 30% Wants + 20% Savings = 100% Financial Success
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Income Section */}
              <div className="bg-gray-50 rounded-xl p-6 border-l-4 border-green-500">
                <div className="text-xl font-bold text-slate-800 mb-4 flex items-center">💰 Monthly Income</div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-800 mb-1">
                        Primary Income (After Tax)
                      </label>
                      <input
                        type="number"
                        value={budgetData.primaryIncome}
                        onChange={(e) => updateBudgetField("primaryIncome", e.target.value)}
                        className="w-full p-3  border-2 text-slate-700 border-gray-200 rounded-md focus:border-blue-500 focus:outline-none text-base"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-800 mb-1">Side Income</label>
                      <input
                        type="number"
                        value={budgetData.sideIncome}
                        onChange={(e) => updateBudgetField("sideIncome", e.target.value)}
                        className="w-full p-3 border-2 text-slate-700 border-gray-200 rounded-md focus:border-blue-500 focus:outline-none text-base"
                        step="0.01"
                        
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-800 mb-1">Investment Income</label>
                      <input
                        type="number"
                        value={budgetData.investmentIncome}
                        onChange={(e) => updateBudgetField("investmentIncome", e.target.value)}
                        className="w-full text-slate-700 p-3 border-2 border-gray-200 rounded-md focus:border-blue-500 focus:outline-none text-base"
                        step="0.01"
                        placeholder="."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-800 mb-1">Other Income</label>
                      <input
                        type="number"
                        value={budgetData.otherIncome}
                        onChange={(e) => updateBudgetField("otherIncome", e.target.value)}
                        className="w-full p-3 border-2 text-slate-700  border-gray-200 rounded-md focus:border-blue-500 focus:outline-none text-base"
                        step="0.01"
                        placeholder="."
                      />
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-slate-800">Total Monthly Income:</span>
                      <span className="font-bold text-slate-800">${summary.totalIncome.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Expenses Section */}
              <div className="bg-gray-50 rounded-xl p-6 border-l-4 border-red-500">
                <div className="text-xl font-bold text-slate-800 mb-4 flex items-center">💸 Monthly Expenses</div>

                {/* Needs */}
                <div className="bg-white rounded-lg p-4 shadow-sm mb-3">
                  <div className="font-bold text-slate-800 mb-3 pb-2 border-b border-gray-200">
                    🏠 Needs (Target: 50%)
                  </div>
                  <div className="space-y-3">
                    {[
                      { key: "housing", label: "Housing (Rent/Mortgage)" },
                      { key: "utilities", label: "Utilities" },
                      { key: "groceries", label: "Groceries" },
                      { key: "transportation", label: "Transportation" },
                      { key: "insurance", label: "Insurance (Health, Auto, etc.)" },
                      { key: "minimumDebt", label: "Minimum Debt Payments" },
                    ].map((field) => (
                      <div key={field.key}>
                        <label className="block text-sm font-semibold text-slate-800 mb-1">{field.label}</label>
                        <input
                          type="number"
                          value={budgetData[field.key as keyof BudgetData]}
                          onChange={(e) => updateBudgetField(field.key as keyof BudgetData, e.target.value)}
                          className="w-full  text-slate-700 p-2 border-2 border-gray-200 rounded-md focus:border-blue-500 focus:outline-none text-sm"
                          step="0.01"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Wants */}
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="font-bold text-slate-800 mb-3 pb-2 border-b border-gray-200">
                    🎉 Wants (Target: 30%)
                  </div>
                  <div className="space-y-3">
                    {[
                      { key: "diningOut", label: "Dining Out" },
                      { key: "entertainment", label: "Entertainment" },
                      { key: "shopping", label: "Shopping" },
                      { key: "subscriptions", label: "Subscriptions" },
                      { key: "personalCare", label: "Personal Care" },
                      { key: "hobbies", label: "Hobbies" },
                    ].map((field) => (
                      <div key={field.key}>
                        <label className="block text-sm font-semibold text-slate-800 mb-1">{field.label}</label>
                        <input
                          type="number"
                          value={budgetData[field.key as keyof BudgetData]}
                          onChange={(e) => updateBudgetField(field.key as keyof BudgetData, e.target.value)}
                          className="w-full text-slate-700 p-2 border-2 border-gray-200 rounded-md focus:border-blue-500 focus:outline-none text-sm"
                          step="0.01"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Savings Section */}
              <div className="bg-gray-50 rounded-xl p-6 border-l-4 border-orange-500">
                <div className="text-xl font-bold text-slate-800 mb-4 flex items-center">
                  💳 Savings & Debt (Target: 20%)
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="font-bold text-slate-800 mb-3 pb-2 border-b border-gray-200">
                    💰 Savings & Investments
                  </div>
                  <div className="space-y-4">
                    {[
                      { key: "emergencyFund", label: "Emergency Fund" },
                      { key: "retirement", label: "Retirement (401k/IRA)" },
                      { key: "investments", label: "Other Investments" },
                      { key: "extraDebt", label: "Extra Debt Payments" },
                    ].map((field) => (
                      <div key={field.key}>
                        <label className="block text-sm font-semibold text-slate-800 mb-1">{field.label}</label>
                        <input
                          type="number"
                          value={budgetData[field.key as keyof BudgetData]}
                          onChange={(e) => updateBudgetField(field.key as keyof BudgetData, e.target.value)}
                          className="w-full  text-slate-700 p-3 border-2 border-gray-200 rounded-md focus:border-blue-500 focus:outline-none text-base"
                          step="0.01"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Summary Dashboard */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-8">
              <h3 className="text-center text-2xl font-bold text-slate-800 mb-6">📈 Budget Summary</h3>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg p-6 text-center shadow-sm">
                  <div className="text-3xl font-bold text-green-600 mb-2">${summary.totalIncome.toLocaleString()}</div>
                  <div className="text-gray-600 text-sm">Total Income</div>
                </div>
                <div className="bg-white rounded-lg p-6 text-center shadow-sm">
                  <div className="text-3xl font-bold text-slate-700 mb-2">
                    ${summary.totalExpenses.toLocaleString()}
                  </div>
                  <div className="text-gray-600 text-sm">Total Expenses</div>
                </div>
                <div className="bg-white rounded-lg p-6 text-center shadow-sm">
                  <div
                    className={`text-3xl font-bold mb-2 ${summary.remaining >= 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    ${summary.remaining.toLocaleString()}
                  </div>
                  <div className="text-gray-600 text-sm">Remaining Balance</div>
                </div>
                <div className="bg-white rounded-lg p-6 text-center shadow-sm">
                  <div className="text-3xl font-bold text-slate-700 mb-2">{summary.savingsPercentage.toFixed(1)}%</div>
                  <div className="text-gray-600 text-sm">Savings Rate</div>
                </div>
              </div>

              {/* Progress Bars */}
              <div className="space-y-6">
                <h4 className="text-slate-800 font-bold text-lg mb-4">Budget Allocation Breakdown</h4>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-700">Needs (Target: 50%)</span>
                    <span className="font-semibold">{summary.needsPercentage.toFixed(1)}%</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-6 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center text-white text-sm font-bold transition-all duration-500"
                      style={{ width: `${Math.min(summary.needsPercentage, 100)}%` }}
                    >
                      {summary.needsPercentage.toFixed(1)}%
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-700">Wants (Target: 30%)</span>
                    <span className="font-semibold">{summary.wantsPercentage.toFixed(1)}%</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-6 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center text-white text-sm font-bold transition-all duration-500"
                      style={{ width: `${Math.min(summary.wantsPercentage, 100)}%` }}
                    >
                      {summary.wantsPercentage.toFixed(1)}%
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-700">Savings & Debt (Target: 20%)</span>
                    <span className="font-semibold">{summary.savingsPercentage.toFixed(1)}%</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-6 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center text-white text-sm font-bold transition-all duration-500"
                      style={{ width: `${Math.min(summary.savingsPercentage, 100)}%` }}
                    >
                      {summary.savingsPercentage.toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Budget Alerts */}
              <div className="mt-6">
                {summary.remaining < 0 && (
                  <div className="bg-red-100 border border-red-300 text-red-800 px-4 py-3 rounded-lg font-semibold">
                    ⚠️ Warning: You're spending more than you earn!
                  </div>
                )}
                {summary.savingsPercentage >= 20 && summary.needsPercentage <= 50 && summary.wantsPercentage <= 30 && (
                  <div className="bg-green-100 border border-green-300 text-green-800 px-4 py-3 rounded-lg font-semibold">
                    ✅ Excellent! You're following the 50/30/20 rule perfectly.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Expense Tracker Tab */}
        {activeTab === "expense-tracker" && (
          <div className="p-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">📝 Daily Expense Tracker</h2>

            {/* Add Expense Form */}
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h4 className="font-bold text-lg mb-4 text-slate-900">Add New Expense</h4>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-1">Date</label>
                  <input
                    type="date"
                    value={expenseForm.date}
                    onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })}
                    className="w-full p-3 border-2 text-slate-800 border-gray-200 rounded-md focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-1">Description</label>
                  <input
                    type="text"
                    value={expenseForm.description}
                    onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                    placeholder="Coffee, lunch, etc."
                    className="w-full p-3 border-2 text-slate-800 border-gray-200 rounded-md focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-1">Amount ($)</label>
                  <input
                    type="number"
                    value={expenseForm.amount}
                    onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                    placeholder="0.00"
                    step="0.01"
                    className="w-full p-3 border-2 text-slate-800 border-gray-200 rounded-md focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-1">Category</label>
                  <select
                    value={expenseForm.category}
                    onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                    className="w-full p-3 border-2 text-slate-800 border-gray-200 rounded-md focus:border-blue-500 focus:outline-none"
                  >
                    <option value="groceries">Groceries</option>
                    <option value="dining-out">Dining Out</option>
                    <option value="transportation">Transportation</option>
                    <option value="entertainment">Entertainment</option>
                    <option value="shopping">Shopping</option>
                    <option value="utilities">Utilities</option>
                    <option value="housing">Housing</option>
                    <option value="personal-care">Personal Care</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <button
                    onClick={addExpense}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-md font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 transform hover:-translate-y-1"
                  >
                    Add Expense
                  </button>
                </div>
              </div>
            </div>

            {/* Expenses Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
              <table className="w-full">
                <thead className="bg-slate-800 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left">Date</th>
                    <th className="px-6 py-4 text-left">Description</th>
                    <th className="px-6 py-4 text-left">Category</th>
                    <th className="px-6 py-4 text-left">Amount</th>
                    <th className="px-6 py-4 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                        No expenses recorded yet. Add your first expense above!
                      </td>
                    </tr>
                  ) : (
                    expenses.map((expense) => (
                      <tr key={expense.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-6 py-4">{expense.date}</td>
                        <td className="px-6 py-4">{expense.description}</td>
                        <td className="px-6 py-4 capitalize">{expense.category.replace("-", " ")}</td>
                        <td className="px-6 py-4 font-semibold">${expense.amount.toFixed(2)}</td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => deleteExpense(expense.id)}
                            className="text-red-600 hover:text-red-800 font-semibold"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Expense Statistics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg p-6 text-center shadow-sm">
                <div className="text-3xl font-bold text-slate-700 mb-2">${expenseStats.total.toFixed(2)}</div>
                <div className="text-gray-600 text-sm">Total Tracked Expenses</div>
              </div>
              <div className="bg-white rounded-lg p-6 text-center shadow-sm">
                <div className="text-3xl font-bold text-slate-700 mb-2">${expenseStats.dailyAverage.toFixed(2)}</div>
                <div className="text-gray-600 text-sm">Daily Average</div>
              </div>
              <div className="bg-white rounded-lg p-6 text-center shadow-sm">
                <div className="text-3xl font-bold text-slate-700 mb-2">${expenseStats.largest.toFixed(2)}</div>
                <div className="text-gray-600 text-sm">Largest Expense</div>
              </div>
              <div className="bg-white rounded-lg p-6 text-center shadow-sm">
                <div className="text-3xl font-bold text-slate-700 mb-2">{expenseStats.count}</div>
                <div className="text-gray-600 text-sm">Total Transactions</div>
              </div>
            </div>
          </div>
        )}

        {/* Analysis Tab */}
        {activeTab === "analysis" && (
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
        )}

        {/* Goals Tab */}
        {activeTab === "goals" && (
          <div className="p-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">🎯 Financial Goals Tracker</h2>

            {/* Add Goal Form */}
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h4 className="font-bold text-lg mb-4 text-slate-800">Add New Goal</h4>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-1">Goal Name</label>
                  <input
                    type="text"
                    value={goalForm.name}
                    onChange={(e) => setGoalForm({ ...goalForm, name: e.target.value })}
                    placeholder="Emergency Fund, Vacation, etc."
                    className="w-full p-3 border-2 text-gray-700 border-gray-200 rounded-md focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-1">Target Amount ($)</label>
                  <input
                    type="number"
                    value={goalForm.target}
                    onChange={(e) => setGoalForm({ ...goalForm, target: e.target.value })}
                    placeholder="10000"
                    step="0.01"
                    className="w-full p-3 border-2 text-gray-700 border-gray-200 rounded-md focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-1">Current Amount ($)</label>
                  <input
                    type="number"
                    value={goalForm.current}
                    onChange={(e) => setGoalForm({ ...goalForm, current: e.target.value })}
                    placeholder="0"
                    step="0.01"
                    className="w-full p-3 text-gray-700 border-2 border-gray-200 rounded-md focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-1">Target Date</label>
                  <input
                    type="date"
                    value={goalForm.targetDate}
                    onChange={(e) => setGoalForm({ ...goalForm, targetDate: e.target.value })}
                    className="w-full p-3 border-2 text-gray-700 border-gray-200 rounded-md focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <button
                    onClick={addGoal}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-md font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 transform hover:-translate-y-1"
                  >
                    Add Goal
                  </button>
                </div>
              </div>
            </div>

            {/* Goals List */}
            <div className="space-y-6">
              {goals.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  No financial goals set yet. Add your first goal above!
                </div>
              ) : (
                goals.map((goal) => {
                  const progress = (goal.current / goal.target) * 100
                  const daysLeft = Math.ceil(
                    (new Date(goal.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
                  )

                  return (
                    <div key={goal.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-slate-800">{goal.name}</h3>
                          <p className="text-gray-600">
                            Target: {goal.targetDate} ({daysLeft > 0 ? `${daysLeft} days left` : "Overdue"})
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-slate-800">${goal.current.toLocaleString()}</div>
                          <div className="text-gray-600">of ${goal.target.toLocaleString()}</div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-semibold text-slate-700">Progress</span>
                          <span className="text-sm font-semibold text-slate-700">{progress.toFixed(1)}%</span>
                        </div>
                        <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Remaining: ${(goal.target - goal.current).toLocaleString()}</span>
                        {daysLeft > 0 && <span>Need ${((goal.target - goal.current) / daysLeft).toFixed(2)}/day</span>}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}



