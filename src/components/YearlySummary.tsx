// 年度薪资汇总组件
import { YearlySummary } from '../types/salary';
import { formatCurrency } from '../utils/salaryCalculator';
import { 
  Wallet, 
  PiggyBank, 
  Building2, 
  Receipt, 
  Banknote,
  TrendingUp,
  Briefcase,
  Clock,
  Gift
} from 'lucide-react';

interface YearlySummaryProps {
  data: YearlySummary;
}

export default function YearlySummaryCard({ data }: YearlySummaryProps) {
  const incomeCards = [
    {
      title: '全年总收入',
      value: data.totalSalary,
      icon: Wallet,
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100',
      textColor: 'text-blue-600'
    },
    {
      title: '全年基本工资',
      value: data.totalBaseSalary,
      icon: Briefcase,
      gradient: 'from-indigo-500 to-indigo-600',
      bgGradient: 'from-indigo-50 to-indigo-100',
      textColor: 'text-indigo-600'
    },
    {
      title: '全年加班费',
      value: data.totalOvertimePay,
      icon: Clock,
      gradient: 'from-red-500 to-red-600',
      bgGradient: 'from-red-50 to-red-100',
      textColor: 'text-red-600'
    },
    {
      title: '全年年终奖',
      value: data.totalYearEndBonus,
      icon: Gift,
      gradient: 'from-orange-500 to-orange-600',
      bgGradient: 'from-orange-50 to-orange-100',
      textColor: 'text-orange-600'
    }
  ];

  const deductionCards = [
    {
      title: '全年五险总额',
      value: data.totalSocialInsurance,
      icon: PiggyBank,
      gradient: 'from-cyan-500 to-cyan-600',
      bgGradient: 'from-cyan-50 to-cyan-100',
      textColor: 'text-cyan-600'
    },
    {
      title: '全年公积金总额',
      value: data.totalHousingFund,
      icon: Building2,
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-50 to-purple-100',
      textColor: 'text-purple-600'
    },
    {
      title: '全年专项附加扣除',
      value: data.totalSpecialDeduction,
      icon: Gift,
      gradient: 'from-yellow-500 to-yellow-600',
      bgGradient: 'from-yellow-50 to-yellow-100',
      textColor: 'text-yellow-600'
    },
    {
      title: '全年个税总额',
      value: data.totalTax,
      icon: Receipt,
      gradient: 'from-amber-500 to-amber-600',
      bgGradient: 'from-amber-50 to-amber-100',
      textColor: 'text-amber-600'
    },
    {
      title: '全年到手总额',
      value: data.totalNetSalary,
      icon: Banknote,
      gradient: 'from-green-500 to-green-600',
      bgGradient: 'from-green-50 to-green-100',
      textColor: 'text-green-600'
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        <div className="bg-gradient-to-br from-green-500 to-green-600 p-2 rounded-lg">
          <TrendingUp className="w-6 h-6 text-white" />
        </div>
        年度薪资汇总
      </h2>

      {/* 收入部分 */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <div className="w-1 h-5 bg-blue-500 rounded-full"></div>
          收入构成
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {incomeCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div 
                key={index}
                className={`bg-gradient-to-br ${card.bgGradient} rounded-xl p-5 hover:shadow-lg transition-shadow`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-600">
                    {card.title}
                  </span>
                  <div className={`bg-gradient-to-br ${card.gradient} p-2 rounded-lg`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className={`text-2xl font-bold ${card.textColor} mb-1`}>
                  ¥ {formatCurrency(card.value)}
                </div>
                <div className="text-xs text-gray-500">
                  ≈ {(card.value / 10000).toFixed(2)} 万
                  {card.title !== '全年总收入' && data.totalSalary > 0 && (
                    <span className="ml-1">
                      ({((card.value / data.totalSalary) * 100).toFixed(1)}%)
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 扣除部分 */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <div className="w-1 h-5 bg-orange-500 rounded-full"></div>
          扣除与实得
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {deductionCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div 
                key={index}
                className={`bg-gradient-to-br ${card.bgGradient} rounded-xl p-5 hover:shadow-lg transition-shadow`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-600">
                    {card.title}
                  </span>
                  <div className={`bg-gradient-to-br ${card.gradient} p-2 rounded-lg`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className={`text-2xl font-bold ${card.textColor} mb-1`}>
                  ¥ {formatCurrency(card.value)}
                </div>
                <div className="text-xs text-gray-500">
                  ≈ {(card.value / 10000).toFixed(2)} 万
                  {data.totalSalary > 0 && (
                    <span className="ml-1">
                      ({((card.value / data.totalSalary) * 100).toFixed(1)}%)
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 详细分析 */}
      <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          收入分析
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <div className="bg-white p-4 rounded-lg">
            <div className="text-gray-600 mb-1">税后收入占比</div>
            <div className="text-2xl font-bold text-green-600">
              {data.totalSalary > 0 ? ((data.totalNetSalary / data.totalSalary) * 100).toFixed(1) : 0}%
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <div className="text-gray-600 mb-1">实际扣税比例</div>
            <div className="text-2xl font-bold text-orange-600">
              {data.totalSalary > 0 ? ((data.totalTax / data.totalSalary) * 100).toFixed(1) : 0}%
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <div className="text-gray-600 mb-1">月均到手收入</div>
            <div className="text-2xl font-bold text-blue-600">
              ¥ {formatCurrency(data.totalNetSalary / 12)}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <div className="text-gray-600 mb-1">加班费占比</div>
            <div className="text-2xl font-bold text-red-600">
              {data.totalSalary > 0 ? ((data.totalOvertimePay / data.totalSalary) * 100).toFixed(1) : 0}%
            </div>
          </div>
        </div>
      </div>

      {/* 温馨提示 */}
      <div className="mt-6 p-4 border-l-4 border-blue-500 bg-blue-50 rounded-r-lg">
        <p className="text-sm text-blue-800">
          <span className="font-bold">注意：</span>
          以上计算结果仅供参考，实际薪资以单位发放为准。
          不同地区五险一金缴纳基数和比例可能有所不同。
          加班费按2倍日薪计算，年终奖按单独计税方式计算。
          专项附加扣除包括子女教育、继续教育、大病医疗、住房贷款利息、住房租金、赡养老人、个人养老金、税优健康险等项目。
        </p>
      </div>
    </div>
  );
}
