import React from 'react'

import { useState } from 'react'

interface Goal {
  id: string
  name: string
  target: number
  current: number
  targetDate: string
}

const Goals = () => {
      const [goals, setGoals] = useState<Goal[]>([])

        const [goalForm, setGoalForm] = useState({
    name: "",
    target: "",
    current: "",
    targetDate: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  })
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
  return (
    <div>
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
    </div>
  )
}

export default Goals
