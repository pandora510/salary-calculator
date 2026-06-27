// 月度薪资明细表格组件
import { MonthlySalary } from '../types/salary';
import { formatCurrency } from '../utils/salaryCalculator';
import { Table, TrendingUp, Clock, Gift } from 'lucide-react';

interface MonthlyTableProps {
  data: MonthlySalary[];
}

const monthNames = [
  '一月', '二月', '三月', '四月', '五月', '六月',
  '七月', '八月', '九月', '十月', '十一月', '十二月'
];

export default function MonthlyTable({ data }: MonthlyTableProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        <div className="bg-gradient-to-br from-green-500 to-green-600 p-2 rounded-lg">
          <Table className="w-6 h-6 text-white" />
        </div>
        月度薪资明细
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1200px]">
          <thead>
            <tr className="bg-gradient-to-r from-blue-50 to-blue-100">
              <th className="px-3 py-3 text-left text-sm font-bold text-blue-800 border-b-2 border-blue-200">
                月份
              </th>
              <th className="px-3 py-3 text-right text-sm font-bold text-blue-800 border-b-2 border-blue-200">
                基本薪资
              </th>
              <th className="px-3 py-3 text-right text-sm font-bold text-blue-800 border-b-2 border-blue-200">
                加班费
              </th>
              <th className="px-3 py-3 text-right text-sm font-bold text-blue-800 border-b-2 border-blue-200">
                年终奖
              </th>
              <th className="px-3 py-3 text-right text-sm font-bold text-blue-800 border-b-2 border-blue-200">
                五险
              </th>
              <th className="px-3 py-3 text-right text-sm font-bold text-blue-800 border-b-2 border-blue-200">
                公积金
              </th>
              <th className="px-3 py-3 text-right text-sm font-bold text-orange-800 border-b-2 border-orange-200">
                专项附加扣除
              </th>
              <th className="px-3 py-3 text-right text-sm font-bold text-blue-800 border-b-2 border-blue-200">
                个税
              </th>
              <th className="px-3 py-3 text-right text-sm font-bold text-green-800 border-b-2 border-green-200">
                到手金额
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr 
                key={item.month}
                className={`${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                } hover:bg-blue-50 transition-colors`}
              >
                <td className="px-3 py-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-800">
                      {monthNames[item.month - 1]}
                    </span>
                    {item.yearEndBonus > 0 && (
                      <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
                        <Gift className="w-3 h-3" />
                        年终奖
                      </span>
                    )}
                    {item.overtimeDays > 0 && (
                      <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.overtimeDays}天
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-3 py-3 text-right border-b border-gray-100 font-medium text-gray-700">
                  ¥ {formatCurrency(item.baseSalary)}
                </td>
                <td className="px-3 py-3 text-right border-b border-gray-100 text-red-600">
                  {item.overtimePay > 0 ? (
                    <span className="font-medium">+ ¥ {formatCurrency(item.overtimePay)}</span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="px-3 py-3 text-right border-b border-gray-100 text-orange-600">
                  {item.yearEndBonus > 0 ? (
                    <span className="font-medium">+ ¥ {formatCurrency(item.yearEndBonus)}</span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="px-3 py-3 text-right border-b border-gray-100 text-blue-600">
                  - {formatCurrency(item.socialInsurance)}
                </td>
                <td className="px-3 py-3 text-right border-b border-gray-100 text-purple-600">
                  - {formatCurrency(item.housingFund)}
                </td>
                <td className="px-3 py-3 text-right border-b border-gray-100 text-orange-600">
                  {item.specialDeduction > 0 ? (
                    <span className="font-medium">- ¥ {formatCurrency(item.specialDeduction)}</span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="px-3 py-3 text-right border-b border-gray-100 text-orange-600">
                  - {formatCurrency(item.tax)}
                </td>
                <td className="px-3 py-3 text-right border-b border-gray-100 font-bold text-green-600 bg-green-50">
                  <div className="flex items-center justify-end gap-1">
                    <TrendingUp className="w-4 h-4" />
                    ¥ {formatCurrency(item.netSalary)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 底部说明 */}
      <div className="mt-6 p-4 bg-gradient-to-r from-gray-100 to-gray-50 rounded-xl">
        <div className="flex flex-wrap gap-4 text-sm text-gray-600 justify-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            到手金额
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            加班费（按倍数日薪）
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            年终奖（单独计税）
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            五险（养老8%+医疗2%+失业0.5%）
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            公积金（个人部分）
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            专项附加扣除（子女教育、继续教育、大病医疗、住房贷款利息、住房租金、赡养老人、个人养老金、税优健康险）
          </div>
        </div>
      </div>
    </div>
  );
}
