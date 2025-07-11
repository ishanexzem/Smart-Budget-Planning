"use client"

import { useState, useEffect } from "react"
import Button from "../../../components/button"

interface Debt {
  id: number
  name: string
  balance: number
  rate: number
  minimum: number
  originalBalance: number
}

interface PayoffResult {
  totalMonths: number
  totalInterestPaid: number
  payoffSchedule: Array<{
    name: string
    month: number
    originalBalance: number
  }>
  totalPaid: number
  monthlyPayment: number
}

export default function DebtPayoffCalculator() {
  const [debts, setDebts] = useState<Debt[]>([
    {
      id: 1,
      name: "Credit Card 1",
      balance: 8547,
      rate: 24.99,
      minimum: 225,
      originalBalance: 8547,
    },
    {
      id: 2,
      name: "Student Loan",
      balance: 35492,
      rate: 6.5,
      minimum: 387,
      originalBalance: 35492,
    },
  ])

  const [extraPayment, setExtraPayment] = useState(200)
  const [strategy, setStrategy] = useState("avalanche")
  const [results, setResults] = useState<{
    chosen: PayoffResult | null
    avalanche: PayoffResult | null
    snowball: PayoffResult | null
  }>({
    chosen: null,
    avalanche: null,
    snowball: null,
  })
  const [debtCounter, setDebtCounter] = useState(2)
  const [showResults, setShowResults] = useState(false)

  const addDebt = () => {
    const newId = debtCounter + 1
    setDebtCounter(newId)
    setDebts([
      ...debts,
      {
        id: newId,
        name: "",
        balance: 0,
        rate: 0,
        minimum: 0,
        originalBalance: 0,
      },
    ])
  }

  const removeDebt = (id: number) => {
    if (debts.length > 1) {
      setDebts(debts.filter((debt) => debt.id !== id))
    } else {
      alert("You must have at least one debt entry.")
    }
  }

  const updateDebt = (id: number, field: keyof Debt, value: string | number) => {
    setDebts(
      debts.map((debt) => {
        if (debt.id === id) {
          const updatedDebt = { ...debt, [field]: value }
          if (field === "balance") {
            updatedDebt.originalBalance = Number(value)
          }
          return updatedDebt
        }
        return debt
      }),
    )
  }

  const calculateDebtPayoff = (debts: Debt[], extraPayment: number, strategy: string): PayoffResult => {
    const validDebts = debts.filter((debt) => debt.balance > 0)
    if (validDebts.length === 0) {
      return {
        totalMonths: 0,
        totalInterestPaid: 0,
        payoffSchedule: [],
        totalPaid: 0,
        monthlyPayment: 0,
      }
    }

    // Create a copy of debts for calculation
    const debtsCopy = validDebts.map((debt) => ({
      ...debt,
      rate: debt.rate / 100 / 12, // Convert to monthly decimal
    }))

    // Sort debts based on strategy
    if (strategy === "avalanche") {
      debtsCopy.sort((a, b) => b.rate - a.rate)
    } else if (strategy === "snowball") {
      debtsCopy.sort((a, b) => a.balance - b.balance)
    }

    let month = 0
    let totalInterestPaid = 0
    const payoffSchedule: Array<{ name: string; month: number; originalBalance: number }> = []
    const totalMinimumPayments = debtsCopy.reduce((sum, debt) => sum + debt.minimum, 0)

    while (debtsCopy.length > 0 && month < 600) {
      // Safety check for infinite loops
      month++
      const remainingExtraPayment = extraPayment

      // Apply minimum payments and interest to all debts
      for (let i = debtsCopy.length - 1; i >= 0; i--) {
        const debt = debtsCopy[i]

        // Calculate interest for this month
        const interestPayment = debt.balance * debt.rate
        totalInterestPaid += interestPayment

        // Apply minimum payment
        const principalPayment = Math.min(debt.minimum - interestPayment, debt.balance)
        debt.balance -= principalPayment

        // If debt is paid off, remove it and add to schedule
        if (debt.balance <= 0) {
          payoffSchedule.push({
            name: debt.name,
            month: month,
            originalBalance: debt.originalBalance,
          })
          debtsCopy.splice(i, 1)
        }
      }

      // Apply extra payment to first debt (highest priority)
      if (debtsCopy.length > 0 && remainingExtraPayment > 0) {
        const firstDebt = debtsCopy[0]
        const extraPrincipal = Math.min(remainingExtraPayment, firstDebt.balance)
        firstDebt.balance -= extraPrincipal

        if (firstDebt.balance <= 0) {
          payoffSchedule.push({
            name: firstDebt.name,
            month: month,
            originalBalance: firstDebt.originalBalance,
          })
          debtsCopy.splice(0, 1)
        }
      }
    }

    return {
      totalMonths: month,
      totalInterestPaid: totalInterestPaid,
      payoffSchedule: payoffSchedule,
      totalPaid: validDebts.reduce((sum, debt) => sum + debt.originalBalance, 0) + totalInterestPaid,
      monthlyPayment: totalMinimumPayments + extraPayment,
    }
  }

  const calculatePayoff = () => {
    const avalancheResults = calculateDebtPayoff(debts, extraPayment, "avalanche")
    const snowballResults = calculateDebtPayoff(debts, extraPayment, "snowball")
    const chosenResults = strategy === "snowball" ? snowballResults : avalancheResults

    setResults({
      chosen: chosenResults,
      avalanche: avalancheResults,
      snowball: snowballResults,
    })
    setShowResults(true)
  }

  // Initial calculation - don't show results initially
  useEffect(() => {
    const avalancheResults = calculateDebtPayoff(debts, extraPayment, "avalanche")
    const snowballResults = calculateDebtPayoff(debts, extraPayment, "snowball")
    const chosenResults = strategy === "snowball" ? snowballResults : avalancheResults

    setResults({
      chosen: chosenResults,
      avalanche: avalancheResults,
      snowball: snowballResults,
    })
  }, [debts, extraPayment, strategy])

  const totalDebt = debts.reduce((sum, debt) => sum + debt.balance, 0)
  const totalMinimums = debts.reduce((sum, debt) => sum + debt.minimum, 0)

  const formatDate = (monthsFromNow: number) => {
    const date = new Date()
    date.setMonth(date.getMonth() + monthsFromNow)
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
  }

  const formatFullDate = (monthsFromNow: number) => {
    const date = new Date()
    date.setMonth(date.getMonth() + monthsFromNow)
    return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
  }

  return (
    <div className="min-h-screen bg-white p-5 font-sans">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white p-8 text-center">
          <h1 className="text-xl font-bold mb-3 lg:text-4xl md:text-2xl  ">💰 Interactive Debt Payoff Calculator</h1>
          <p className="text-sm opacity-90 lg:text-lg md:text-sm ">Plan your path to financial freedom with precision and confidence</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
          {/* Input Section */}
          <div className="p-8 bg-gray-50 border-r border-gray-200">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 pb-3 border-b-2 border-blue-500">
              📊 Your Debt Information
            </h2>

            {/* Debt Entries */}
            <div className="space-y-4 mb-6">
              {debts.map((debt, index) => (
                <div key={debt.id} className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
                  <h4 className="text-slate-800 font-semibold mb-4">Debt #{index + 1}</h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex flex-col">
                      <label className="text-sm font-semibold text-slate-800  mb-1">Debt Name</label>
                      <input
                        type="text"
                        value={debt.name}
                        onChange={(e) => updateDebt(debt.id, "name", e.target.value)}
                        placeholder="e.g., Credit Card 1"
                        className="p-3 border-2 border-gray-200 rounded-md focus:border-blue-500 focus:outline-none text-base transition-colors text-slate-800"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-sm font-semibold text-slate-800 mb-1">Current Balance ($)</label>
                      <input
                        type="number"
                        value={debt.balance}
                        onChange={(e) => updateDebt(debt.id, "balance", Number.parseFloat(e.target.value) || 0)}
                        placeholder="8547"
                        step="0.01"
                        className="p-3 border-2 border-gray-200 rounded-md focus:border-blue-500 focus:outline-none text-base transition-colors text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex flex-col">
                      <label className="text-sm font-semibold text-slate-800 mb-1">Interest Rate (%)</label>
                      <input
                        type="number"
                        value={debt.rate}
                        onChange={(e) => updateDebt(debt.id, "rate", Number.parseFloat(e.target.value) || 0)}
                        placeholder="24.99"
                        step="0.01"
                        className="p-3 border-2 border-gray-200 rounded-md focus:border-blue-500 focus:outline-none text-base transition-colors text-slate-800"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-sm text-slate-800  font-semibold mb-1">Minimum Payment ($)</label>
                      <input
                        type="number"
                        value={debt.minimum}
                        onChange={(e) => updateDebt(debt.id, "minimum", Number.parseFloat(e.target.value) || 0)}
                        placeholder="225"
                        step="0.01"
                        className="p-3 border-2 border-gray-200 rounded-md focus:border-blue-500 focus:outline-none text-base transition-colors text-slate-800 "
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => removeDebt(debt.id)}
                    className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-200 transform hover:-translate-y-1"
                  >
                    Remove Debt
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={addDebt}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-md font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 transform hover:-translate-y-1 mb-6"
            >
              + Add Another Debt
            </button>

            {/* Extra Payment Input */}
            <div className="bg-blue-50 border-2 border-blue-500 rounded-lg p-6 mb-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4">
                <label className="text-lg font-semibold text-slate-800 mb-2 lg:mb-0 lg:flex-shrink-0">
                  💪 Extra Monthly Payment Available ($)
                </label>
                <div className="flex-1">
                  <input
                    type="number"
                    value={extraPayment}
                    onChange={(e) => setExtraPayment(Number.parseFloat(e.target.value) || 0)}
                    placeholder="200"
                    step="0.01"
                    className="w-full p-3 border-2 border-gray-200 rounded-md focus:border-blue-500 focus:outline-none text-base transition-colors text-slate-800 bg-white"
                  />
                </div>
              </div>
              <small className="text-gray-600 mt-2 block">
                This amount will be applied to accelerate your debt payoff
              </small>
            </div>

            {/* Strategy Selection */}
            <div className="bg-white border-2 border-blue-500 rounded-lg p-6 mb-6">
              <h4 className="text-lg font-semibold text-slate-800 mb-4">🎯 Choose Your Payoff Strategy</h4>

              <div className="space-y-3">
                <label className="flex items-center p-3 rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="strategy"
                    value="avalanche"
                    checked={strategy === "avalanche"}
                    onChange={(e) => setStrategy(e.target.value)}
                    className="mr-3 w-4 h-4"
                  />
                  <div>
                    <div className="font-extrabold text-slate-900">Debt Avalanche</div>
                    <div className="text-sm text-gray-600 font-medium">Pay highest interest rate first (saves most money)</div>
                  </div>
                </label>

                <label className="flex items-center p-3 rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="strategy"
                    value="snowball"
                    checked={strategy === "snowball"}
                    onChange={(e) => setStrategy(e.target.value)}
                    className="mr-3 w-4 h-4"
                  />
                  <div>
                    <div className="font-extrabold text-slate-900" >Debt Snowball</div>
                    <div className="text-sm text-gray-600 font-medium">Pay smallest balance first (psychological wins)</div>
                  </div>
                </label>

                <label className="flex items-center p-3 rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="strategy"
                    value="custom"
                    checked={strategy === "custom"}
                    onChange={(e) => setStrategy(e.target.value)}
                    className="mr-3 w-4 h-4"
                  />
                  <div>
                    <div className="font-extrabold text-md text-slate-900">Custom Order</div>
                    <div className="text-sm text-gray-600 font-medium">Choose your own priority order</div>
                  </div>
                </label>
              </div>
            </div>

            <button
              onClick={calculatePayoff}
              className="max-w-4xl w-auto bg-blue-400 text-white px-8 py-4 rounded-md text-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:-translate-y-1"
            >
              🚀 Calculate My Debt Freedom Plan
            </button>
          </div>

         {/* Results Section */}
          <div className="p-8 bg-white">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 pb-3 border-b-2 border-blue-500">📈 Your Results</h2>

            {!showResults || !results.chosen || results.chosen.totalMonths === 0 ? (
              <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 px-4 py-3 rounded-lg font-semibold">
                Enter your debt information and click "Calculate" to see your personalized debt freedom plan!
              </div>
            ) : (
              <div className="space-y-6">
                {/* Success Alert */}
                <div className="bg-green-100 border border-green-300 text-green-800 px-4 py-3 rounded-lg font-semibold">
                  🎉 Your debt freedom plan is ready! You'll be debt-free in {results.chosen.totalMonths} months!
                </div>


                {/* Results Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-6 text-center border-l-4 border-blue-500">
    <div className="text-3xl font-bold text-slate-800 mb-2">${totalDebt.toLocaleString()}</div>
    <div className="text-gray-600 text-sm">Total Debt</div>
  </div>
  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-6 text-center border-l-4 border-blue-500">
    <div className="text-3xl font-bold text-slate-800 mb-2">{results.chosen.totalMonths}</div>
    <div className="text-gray-600 text-sm">Months to Freedom</div>
  </div>
  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-6 text-center border-l-4 border-blue-500">
    <div className="text-3xl font-bold text-slate-800 mb-2">
      ${results.chosen.totalInterestPaid.toLocaleString()}
    </div>
    <div className="text-gray-600 text-sm">Total Interest Paid</div>
  </div>
  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-6 text-center border-l-4 border-blue-500">
    <div className="text-3xl font-bold text-slate-800 mb-2">
      ${results.chosen.monthlyPayment.toLocaleString()}
    </div>
    <div className="text-gray-600 text-sm">Monthly Payment</div>
  </div>
</div>


                {/* Comparison Table */}
                {results.avalanche && results.snowball && (
  <div className="overflow-x-auto">
    <div className="min-w-[600px] bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
      <table className="w-full">
        <thead className="bg-slate-800 text-white">
          <tr>
            <th className="px-4 py-4 text-left">Strategy</th>
            <th className="px-4 py-4 text-left">Time to Freedom</th>
            <th className="px-4 py-4 text-left">Total Interest</th>
            <th className="px-4 py-4 text-left">Interest Saved</th>
          </tr>
        </thead>
        <tbody>
          <tr
            className={`border-b border-gray-100 hover:bg-gray-50 ${
              strategy === "avalanche" ? "bg-blue-50 font-bold text-black" : ""
            }`}
          >
            <td className="px-4 py-3 text-slate-700">🔥 Debt Avalanche</td>
            <td className="px-4 py-3 text-slate-700">{results.avalanche.totalMonths} months</td>
            <td className="px-4 py-3 text-slate-700">${results.avalanche.totalInterestPaid.toLocaleString()}</td>
            <td className="px-4 py-3 text-slate-700">
              ${Math.abs(results.snowball.totalInterestPaid - results.avalanche.totalInterestPaid).toLocaleString()}
            </td>
          </tr>
          <tr
            className={`border-b border-gray-100 hover:bg-gray-50 ${
              strategy === "snowball" ? "bg-blue-50 font-bold text-black" : ""
            }`}
          >
            <td className="px-4 py-3 text-slate-700">⛄ Debt Snowball</td>
            <td className="px-4 py-3 text-slate-700">{results.snowball.totalMonths} months</td>
            <td className="px-4 py-3 text-slate-700">${results.snowball.totalInterestPaid.toLocaleString()}</td>
            <td className="px-4 py-3 text-slate-700">
              ${Math.abs(results.avalanche.totalInterestPaid - results.snowball.totalInterestPaid).toLocaleString()}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
)}


                {/* Payoff Schedule */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-slate-800 mb-4">📅 Your Debt Payoff Schedule</h3>
                  <div className="space-y-3">
                    {results.chosen.payoffSchedule.map((debt, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center py-3 border-b border-gray-200 last:border-b-0"
                      >
                        <div>
                          <div className="font-semibold text-slate-800">{debt.name}</div>
                          <div className="text-sm text-gray-600">
                            Original Balance: ${debt.originalBalance.toLocaleString()}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-green-600">{formatDate(debt.month)}</div>
                          <div className="text-sm text-gray-600">Month {debt.month}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Insights */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-bold text-slate-800 mb-4">💡 Key Insights</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>
                      <strong>Debt-Free Date:</strong> {formatFullDate(results.chosen.totalMonths)}
                    </li>
                    <li>
                      <strong>Total Amount Paid:</strong> ${results.chosen.totalPaid.toLocaleString()} (principal +
                      interest)
                    </li>
                    <li>
                      <strong>Monthly Commitment:</strong> ${results.chosen.monthlyPayment.toLocaleString()} ($
                      {totalMinimums.toLocaleString()} minimum + ${extraPayment.toLocaleString()} extra)
                    </li>
                    <li>
                      <strong>Strategy Used:</strong>{" "}
                      {strategy === "avalanche"
                        ? "Debt Avalanche (Highest Interest First)"
                        : "Debt Snowball (Smallest Balance First)"}
                    </li>
                  </ul>
                </div>

                {/* Action Buttons */}
                <Button/>

              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
