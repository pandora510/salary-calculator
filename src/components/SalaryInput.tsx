// 薪资输入表单组件
import { useState, useEffect } from 'react';
import { Calculator, DollarSign, Gift, Percent, Clock, Star, Trash2 } from 'lucide-react';
import { SalaryInput, OvertimeDayType, TaxDeductions } from '../types/salary';
import TaxDeductionInput from './TaxDeductionInput';

interface SalaryInputProps {
  onCalculate: (input: SalaryInput) => void;
  onClear?: () => void;
  showClearButton?: boolean;
  initialValues?: SalaryInput | null;
}

const defaultDeductions: TaxDeductions = {
  childrenEducation: 0,
  continuingEducation: 0,
  seriousIllness: 0,
  housingLoanInterest: 0,
  housingRent: 0,
  elderCare: 0,
  personalPension: 0,
  taxHealthInsurance: 0,
};

export default function SalaryInputForm({ onCalculate, onClear, showClearButton = false, initialValues }: SalaryInputProps) {
  const [monthlySalary, setMonthlySalary] = useState<string>('10000');
  const [yearEndBonusMonths, setYearEndBonusMonths] = useState<string>('2');
  const [housingFundRatio, setHousingFundRatio] = useState<string>('12');
  const [overtimeDay, setOvertimeDay] = useState<OvertimeDayType>('none');
  const [overtimeMultiplier, setOvertimeMultiplier] = useState<string>('1');
  const [taxDeductions, setTaxDeductions] = useState<TaxDeductions>(defaultDeductions);

  // 当初始值变化时更新表单
  useEffect(() => {
    if (initialValues) {
      setMonthlySalary(initialValues.monthlySalary.toString());
      setYearEndBonusMonths(initialValues.yearEndBonusMonths.toString());
      setHousingFundRatio(Math.round(initialValues.housingFundRatio * 100).toString());
      setOvertimeDay(initialValues.overtimeDay);
      setOvertimeMultiplier(initialValues.overtimeMultiplier.toString());
      if (initialValues.taxDeductions) {
        setTaxDeductions(initialValues.taxDeductions);
      }
    } else {
      // 重置为默认值
      setMonthlySalary('10000');
      setYearEndBonusMonths('2');
      setHousingFundRatio('12');
      setOvertimeDay('none');
      setOvertimeMultiplier('1');
      setTaxDeductions(defaultDeductions);
    }
  }, [initialValues]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const input: SalaryInput = {
      monthlySalary: parseFloat(monthlySalary) || 0,
      yearEndBonusMonths: parseFloat(yearEndBonusMonths) || 0,
      housingFundRatio: (parseFloat(housingFundRatio) || 0) / 100,
      overtimeDay,
      overtimeMultiplier: parseFloat(overtimeMultiplier) || 1,
      taxDeductions,
    };
    
    onCalculate(input);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 专项附加扣除 */}
      <TaxDeductionInput
        value={taxDeductions}
        onChange={setTaxDeductions}
      />

      {/* 薪资参数设置 */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-lg">
            <Calculator className="w-6 h-6 text-white" />
          </div>
          薪资参数设置
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 月基本薪资 */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              月基本薪资 (元)
            </label>
            <input
              type="number"
              value={monthlySalary}
              onChange={(e) => setMonthlySalary(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all text-lg font-medium"
              placeholder="请输入月薪资"
              min="0"
              step="100"
            />
            <p className="text-xs text-gray-500">税前月收入，不含加班费</p>
          </div>

          {/* 年终奖月数 */}
          <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Gift className="w-4 h-4 text-orange-500" />
            年终奖月数
          </label>
          <input
            type="number"
            value={yearEndBonusMonths}
            onChange={(e) => setYearEndBonusMonths(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all text-lg font-medium"
            placeholder="请输入月数"
            min="0"
            max="12"
            step="0.5"
          />
          <p className="text-xs text-gray-500">12月单独发放，单独计税</p>
        </div>

        {/* 公积金缴纳比例 */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Percent className="w-4 h-4 text-purple-500" />
            公积金缴纳比例
          </label>
          <select
            value={housingFundRatio}
            onChange={(e) => setHousingFundRatio(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all text-lg font-medium bg-white"
          >
            <option value="5">5% (最低)</option>
            <option value="6">6%</option>
            <option value="7">7%</option>
            <option value="8">8%</option>
            <option value="9">9%</option>
            <option value="10">10%</option>
            <option value="11">11%</option>
            <option value="12">12% (最高)</option>
          </select>
          <p className="text-xs text-gray-500">个人缴纳比例，公司同比例</p>
        </div>

        {/* 固定加班日 */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Clock className="w-4 h-4 text-red-500" />
            固定加班日
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setOvertimeDay('none')}
              className={`flex-1 py-3 px-3 rounded-xl font-medium text-sm transition-all ${
                overtimeDay === 'none'
                  ? 'bg-gray-800 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              无加班
            </button>
            <button
              type="button"
              onClick={() => setOvertimeDay('saturday')}
              className={`flex-1 py-3 px-3 rounded-xl font-medium text-sm transition-all ${
                overtimeDay === 'saturday'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              周六
            </button>
            <button
              type="button"
              onClick={() => setOvertimeDay('sunday')}
              className={`flex-1 py-3 px-3 rounded-xl font-medium text-sm transition-all ${
                overtimeDay === 'sunday'
                  ? 'bg-red-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              周日
            </button>
          </div>
          <p className="text-xs text-gray-500">
            {overtimeDay === 'none' 
              ? '无固定加班' 
              : overtimeDay === 'saturday' 
                ? '每周六加班' 
                : '每周日加班'}
          </p>
        </div>

        {/* 加班薪资倍数 - 仅在选择了加班日时显示 */}
        {overtimeDay !== 'none' && (
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" />
              加班薪资倍数
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setOvertimeMultiplier('1')}
                className={`flex-1 py-3 px-3 rounded-xl font-medium text-sm transition-all ${
                  overtimeMultiplier === '1'
                    ? 'bg-yellow-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                1倍
              </button>
              <button
                type="button"
                onClick={() => setOvertimeMultiplier('1.5')}
                className={`flex-1 py-3 px-3 rounded-xl font-medium text-sm transition-all ${
                  overtimeMultiplier === '1.5'
                    ? 'bg-yellow-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                1.5倍
              </button>
              <button
                type="button"
                onClick={() => setOvertimeMultiplier('2')}
                className={`flex-1 py-3 px-3 rounded-xl font-medium text-sm transition-all ${
                  overtimeMultiplier === '2'
                    ? 'bg-yellow-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                2倍
              </button>
              <button
                type="button"
                onClick={() => setOvertimeMultiplier('3')}
                className={`flex-1 py-3 px-3 rounded-xl font-medium text-sm transition-all ${
                  overtimeMultiplier === '3'
                    ? 'bg-yellow-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                3倍
              </button>
            </div>
            <p className="text-xs text-gray-500">
              加班费 = 日薪 × {overtimeMultiplier}倍 × 天数
            </p>
          </div>
        )}
        </div>

        {/* 按钮组 */}
        <div className="mt-8 flex justify-center gap-4">
          {showClearButton && onClear && (
            <button
              type="button"
              onClick={onClear}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-3"
            >
              <Trash2 className="w-6 h-6" />
              清除记录
            </button>
          )}
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-12 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-3"
          >
            <Calculator className="w-6 h-6" />
            开始计算
          </button>
        </div>
      </div>
    </form>
  );
}
