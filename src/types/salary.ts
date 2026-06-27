// 薪资计算器类型定义

// 加班日类型
export type OvertimeDayType = 'saturday' | 'sunday' | 'none';

// 专项附加扣除
export interface TaxDeductions {
  // 子女教育：0-3个孩子，每个孩子1000元/月
  childrenEducation: number;
  // 继续教育：学历教育400元/月 or 取证当年3600元
  continuingEducation: number;
  // 大病医疗：每年扣除，超过15000的部分，最多80000
  seriousIllness: number;
  // 住房贷款利息：1000元/月，首套房
  housingLoanInterest: number;
  // 住房租金：城市级别 1500/1100/800元/月
  housingRent: number;
  // 赡养老人：2000元/月（独生子女）或分摊
  elderCare: number;
  // 个人养老金：每年缴纳上限12000元
  personalPension: number;
  // 税优健康险：每年扣除上限2400元
  taxHealthInsurance: number;
}

// 输入参数
export interface SalaryInput {
  monthlySalary: number;          // 月基本薪资
  yearEndBonusMonths: number;     // 年终奖月数
  housingFundRatio: number;       // 公积金缴纳比例 (0.05-0.12)
  overtimeDay: OvertimeDayType;   // 固定加班日
  overtimeMultiplier: number;     // 加班日薪资倍数 (默认1倍，如2倍工资输入2)
  taxDeductions?: TaxDeductions;  // 专项附加扣除
}

// 月度薪资明细
export interface MonthlySalary {
  month: number;                  // 月份 (1-12)
  baseSalary: number;             // 基本薪资
  overtimePay: number;            // 加班费
  yearEndBonus: number;           // 年终奖（12月发放）
  totalSalary: number;            // 当月总薪资
  socialInsurance: number;        // 五险一金（个人部分）
  housingFund: number;            // 公积金（个人部分）
  specialDeduction: number;        // 专项附加扣除（本月）
  taxableIncome: number;          // 应纳税所得额
  tax: number;                    // 个人所得税
  netSalary: number;              // 到手金额
  workDays: number;               // 当月工作日天数
  overtimeDays: number;           // 当月加班天数
}

// 年度汇总
export interface YearlySummary {
  totalSalary: number;            // 全年总收入
  totalBaseSalary: number;        // 全年基本薪资
  totalOvertimePay: number;       // 全年加班费
  totalYearEndBonus: number;      // 全年年终奖
  totalSocialInsurance: number;   // 全年五险一金总额
  totalHousingFund: number;       // 全年公积金总额
  totalSpecialDeduction: number;  // 全年专项附加扣除总额
  totalTax: number;               // 全年个税总额
  totalNetSalary: number;         // 全年到手总额
}

// 薪资计算结果
export interface SalaryResult {
  monthlySalaries: MonthlySalary[]; // 12个月薪资明细
  yearlySummary: YearlySummary;   // 年度汇总
}
