// 薪资计算器主应用
import { useState, useEffect } from 'react';
import SalaryInputForm from './components/SalaryInput';
import MonthlyTable from './components/MonthlyTable';
import SalaryChart from './components/SalaryChart';
import YearlySummaryCard from './components/YearlySummary';
import { SalaryInput, SalaryResult } from './types/salary';
import { calculateAnnualSalary } from './utils/salaryCalculator';
import { Calculator, Trash2 } from 'lucide-react';

// localStorage 键名
const RESULT_STORAGE_KEY = 'salary_calculator_result';
const INPUT_STORAGE_KEY = 'salary_calculator_input';

function App() {
  const [result, setResult] = useState<SalaryResult | null>(null);
  const [savedInput, setSavedInput] = useState<SalaryInput | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // 页面加载时从 localStorage 读取上次的计算结果和输入配置
  useEffect(() => {
    // 读取计算结果
    const savedResult = localStorage.getItem(RESULT_STORAGE_KEY);
    if (savedResult) {
      try {
        const parsedResult = JSON.parse(savedResult);
        // 数据兼容性检查：确保有专项附加扣除字段
        if (
          parsedResult.yearlySummary &&
          parsedResult.yearlySummary.totalSpecialDeduction !== undefined &&
          parsedResult.monthlySalaries &&
          parsedResult.monthlySalaries.length > 0 &&
          parsedResult.monthlySalaries[0].specialDeduction !== undefined
        ) {
          setResult(parsedResult);
        } else {
          // 旧数据格式不兼容，清除
          localStorage.removeItem(RESULT_STORAGE_KEY);
        }
      } catch (e) {
        console.error('Failed to parse saved result:', e);
        localStorage.removeItem(RESULT_STORAGE_KEY);
      }
    }

    // 读取输入配置
    const savedInputStr = localStorage.getItem(INPUT_STORAGE_KEY);
    if (savedInputStr) {
      try {
        const parsedInput = JSON.parse(savedInputStr);
        setSavedInput(parsedInput);
      } catch (e) {
        console.error('Failed to parse saved input:', e);
        localStorage.removeItem(INPUT_STORAGE_KEY);
      }
    }

    setIsLoaded(true);
  }, []);

  const handleCalculate = (input: SalaryInput) => {
    const calculationResult = calculateAnnualSalary(input);
    setResult(calculationResult);
    setSavedInput(input);
    // 保存到 localStorage
    localStorage.setItem(RESULT_STORAGE_KEY, JSON.stringify(calculationResult));
    localStorage.setItem(INPUT_STORAGE_KEY, JSON.stringify(input));
  };

  const handleClear = () => {
    setResult(null);
    setSavedInput(null);
    localStorage.removeItem(RESULT_STORAGE_KEY);
    localStorage.removeItem(INPUT_STORAGE_KEY);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* 头部 */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg">
              <Calculator className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                智能薪资计算器
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                详细计算工资、奖金、加班费、五险一金及个税（结果仅供参考，存在一定误差）
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* 主内容 */}
      <main className="container mx-auto px-4 py-8">
        {/* 输入表单 */}
        {isLoaded && (
          <SalaryInputForm 
            onCalculate={handleCalculate} 
            onClear={handleClear}
            showClearButton={result !== null}
            initialValues={savedInput}
          />
        )}

        {/* 计算结果 */}
        {result && (
          <div className="space-y-8 animate-fadeIn">
            {/* 年度汇总 */}
            <YearlySummaryCard data={result.yearlySummary} />

            {/* 月度明细表格 */}
            <MonthlyTable data={result.monthlySalaries} />

            {/* 可视化图表 */}
            <SalaryChart data={result.monthlySalaries} />
          </div>
        )}

        {/* 空状态提示 */}
        {!result && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calculator className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              准备开始计算
            </h3>
            <p className="text-gray-600">
              请在上方输入您的薪资信息，点击"开始计算"按钮查看详细结果
            </p>
          </div>
        )}
      </main>

      {/* 页脚 */}
      <footer className="bg-white border-t mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-600">
          <p className="mb-1">© 2026 智能薪资计算器 - 计算结果仅供参考，实际薪资以单位发放为准</p>
          <p className="text-xs text-gray-400">本工具仅供个人学习参考使用，不承担任何法律责任</p>
        </div>
      </footer>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}

export default App;
