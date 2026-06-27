// 专项附加扣除输入组件
import { useState, useEffect } from 'react';
import { TaxDeductions } from '../types/salary';
import { ChevronDown, ChevronUp, Users, Book, Heart, Home, Building, Gift, Shield } from 'lucide-react';

interface TaxDeductionInputProps {
  value: TaxDeductions;
  onChange: (deductions: TaxDeductions) => void;
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

export default function TaxDeductionInput({ value, onChange }: TaxDeductionInputProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [deductions, setDeductions] = useState<TaxDeductions>(value || defaultDeductions);

  // 当外部值变化时更新
  useEffect(() => {
    if (value) {
      setDeductions(value);
    }
  }, [value]);

  // 计算每月专项附加扣除总额
  const monthlyTotal = 
    deductions.childrenEducation +
    deductions.continuingEducation +
    deductions.housingLoanInterest +
    deductions.housingRent +
    deductions.elderCare +
    deductions.personalPension +
    deductions.taxHealthInsurance;

  // 大病医疗按年计算，显示为每月均摊
  const monthlySeriousIllness = Math.round(deductions.seriousIllness / 12);

  const handleChange = (field: keyof TaxDeductions, fieldValue: number) => {
    const newDeductions = { ...deductions, [field]: fieldValue };
    setDeductions(newDeductions);
    onChange(newDeductions);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-2 rounded-lg">
            <Gift className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">专项附加扣除</h3>
            <p className="text-sm text-gray-500">
              {monthlyTotal > 0 || deductions.seriousIllness > 0
                ? `月均扣除 ¥${(monthlyTotal + monthlySeriousIllness).toLocaleString()}（年扣除 ¥${((monthlyTotal * 12) + deductions.seriousIllness).toLocaleString()}）`
                : '点击展开添加可抵扣项目'}
            </p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-6 h-6 text-gray-400" />
        ) : (
          <ChevronDown className="w-6 h-6 text-gray-400" />
        )}
      </button>

      {isExpanded && (
        <div className="mt-6">
          <p className="text-xs text-gray-500 bg-yellow-50 p-3 rounded-lg mb-4">
            💡 专项附加扣除可在税前扣除，降低应纳税所得额，从而减少个税
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 子女教育 */}
            <div className="space-y-1.5 p-4 bg-blue-50 rounded-xl">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                <label className="text-sm font-semibold text-gray-700">子女教育</label>
              </div>
              <select
                value={deductions.childrenEducation}
                onChange={(e) => handleChange('childrenEducation', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none bg-white transition-all text-base font-medium"
              >
                <option value="0">无</option>
                <option value="1000">1个孩子 (1000元/月)</option>
                <option value="2000">2个孩子 (2000元/月)</option>
                <option value="3000">3个孩子 (3000元/月)</option>
              </select>
              <p className="text-xs text-gray-500">每个子女1000元/月</p>
            </div>

            {/* 继续教育 */}
            <div className="space-y-1.5 p-4 bg-purple-50 rounded-xl">
              <div className="flex items-center gap-2">
                <Book className="w-4 h-4 text-purple-600" />
                <label className="text-sm font-semibold text-gray-700">继续教育</label>
              </div>
              <select
                value={deductions.continuingEducation}
                onChange={(e) => handleChange('continuingEducation', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none bg-white transition-all text-base font-medium"
              >
                <option value="0">无</option>
                <option value="400">学历教育 (400元/月)</option>
                <option value="300">取证 (3600元/年)</option>
              </select>
              <p className="text-xs text-gray-500">学历400元/月 or 取证3600元/年</p>
            </div>

            {/* 大病医疗 */}
            <div className="space-y-1.5 p-4 bg-red-50 rounded-xl">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-600" />
                <label className="text-sm font-semibold text-gray-700">大病医疗</label>
              </div>
              <input
                type="number"
                value={deductions.seriousIllness || ''}
                onChange={(e) => handleChange('seriousIllness', parseInt(e.target.value) || 0)}
                placeholder="年金额"
                className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none transition-all text-base font-medium"
              />
              <p className="text-xs text-gray-500">每年最多扣除80000元</p>
            </div>

            {/* 住房贷款利息 */}
            <div className="space-y-1.5 p-4 bg-green-50 rounded-xl">
              <div className="flex items-center gap-2">
                <Home className="w-4 h-4 text-green-600" />
                <label className="text-sm font-semibold text-gray-700">住房贷款利息</label>
              </div>
              <select
                value={deductions.housingLoanInterest}
                onChange={(e) => handleChange('housingLoanInterest', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none bg-white transition-all text-base font-medium"
              >
                <option value="0">无</option>
                <option value="1000">有 (1000元/月)</option>
              </select>
              <p className="text-xs text-gray-500">首套房，1000元/月</p>
            </div>

            {/* 住房租金 */}
            <div className="space-y-1.5 p-4 bg-teal-50 rounded-xl">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-teal-600" />
                <label className="text-sm font-semibold text-gray-700">住房租金</label>
              </div>
              <select
                value={deductions.housingRent}
                onChange={(e) => handleChange('housingRent', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:outline-none bg-white transition-all text-base font-medium"
              >
                <option value="0">无</option>
                <option value="1500">一线/省会 (1500元/月)</option>
                <option value="1100">二线城市 (1100元/月)</option>
                <option value="800">其他城市 (800元/月)</option>
              </select>
              <p className="text-xs text-gray-500">省会/一线1500，二线1100，其他800</p>
            </div>

            {/* 赡养老人 */}
            <div className="space-y-1.5 p-4 bg-orange-50 rounded-xl">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-orange-600" />
                <label className="text-sm font-semibold text-gray-700">赡养老人</label>
              </div>
              <select
                value={deductions.elderCare}
                onChange={(e) => handleChange('elderCare', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none bg-white transition-all text-base font-medium"
              >
                <option value="0">无</option>
                <option value="2000">独生子女 (2000元/月)</option>
                <option value="1000">分摊 (1000元/月)</option>
              </select>
              <p className="text-xs text-gray-500">独生子女2000元/月，非独均摊</p>
            </div>

            {/* 个人养老金 */}
            <div className="space-y-1.5 p-4 bg-indigo-50 rounded-xl">
              <div className="flex items-center gap-2">
                <Gift className="w-4 h-4 text-indigo-600" />
                <label className="text-sm font-semibold text-gray-700">个人养老金</label>
              </div>
              <input
                type="number"
                value={deductions.personalPension || ''}
                onChange={(e) => handleChange('personalPension', parseInt(e.target.value) || 0)}
                placeholder="年金额"
                className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition-all text-base font-medium"
              />
              <p className="text-xs text-gray-500">年缴纳上限12000元</p>
            </div>

            {/* 税优健康险 */}
            <div className="space-y-1.5 p-4 bg-teal-50 rounded-xl">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-teal-600" />
                <label className="text-sm font-semibold text-gray-700">税优健康险</label>
              </div>
              <input
                type="number"
                value={deductions.taxHealthInsurance || ''}
                onChange={(e) => handleChange('taxHealthInsurance', parseInt(e.target.value) || 0)}
                placeholder="年金额"
                className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:outline-none transition-all text-base font-medium"
              />
              <p className="text-xs text-gray-500">年扣除上限2400元</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
