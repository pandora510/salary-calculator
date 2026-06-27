// 薪资计算工具函数
import { SalaryInput, MonthlySalary, YearlySummary, SalaryResult, OvertimeDayType } from '../types/salary';

// 五险一金个人缴纳比例
const SOCIAL_INSURANCE_RATIOS = {
  pension: 0.08,      // 养老保险 8%
  medical: 0.02,      // 医疗保险 2%
  unemployment: 0.005, // 失业保险 0.5%
};

// 个税起征点
const TAX_THRESHOLD = 5000;

// 综合所得个税税率表（年度累计）
const TAX_BRACKETS = [
  { max: 36000, rate: 0.03, deduction: 0 },
  { max: 144000, rate: 0.10, deduction: 2520 },
  { max: 300000, rate: 0.20, deduction: 16920 },
  { max: 420000, rate: 0.25, deduction: 31920 },
  { max: 660000, rate: 0.30, deduction: 52920 },
  { max: 960000, rate: 0.35, deduction: 85920 },
  { max: Infinity, rate: 0.45, deduction: 181920 },
];

// 年终奖月度税率表（单独计税用）
const MONTHLY_TAX_BRACKETS = [
  { max: 3000, rate: 0.03, deduction: 0 },
  { max: 12000, rate: 0.10, deduction: 210 },
  { max: 25000, rate: 0.20, deduction: 1410 },
  { max: 35000, rate: 0.25, deduction: 2660 },
  { max: 55000, rate: 0.30, deduction: 4410 },
  { max: 80000, rate: 0.35, deduction: 7160 },
  { max: Infinity, rate: 0.45, deduction: 15160 },
];

/**
 * 获取指定月份的工作日天数（简单计算：按平均每月22个工作日）
 * 更精确的可以用日历计算，这里简化处理
 */
function getWorkDaysInMonth(year: number, month: number): number {
  // 简化处理：每月约22个工作日
  const daysInMonth = new Date(year, month, 0).getDate();
  let workDays = 0;
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    const dayOfWeek = date.getDay();
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      workDays++;
    }
  }
  return workDays;
}

/**
 * 计算当月加班天数
 */
function getOvertimeDaysInMonth(year: number, month: number, overtimeDay: OvertimeDayType): number {
  if (overtimeDay === 'none') return 0;
  
  const daysInMonth = new Date(year, month, 0).getDate();
  let overtimeDays = 0;
  const targetDay = overtimeDay === 'saturday' ? 6 : 0; // 6=周六, 0=周日
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    if (date.getDay() === targetDay) {
      overtimeDays++;
    }
  }
  
  return overtimeDays;
}

/**
 * 计算综合所得税额
 * @param taxableIncome 应纳税所得额（年度累计）
 * @returns 应缴个税
 */
function calculateComprehensiveTax(taxableIncome: number): number {
  if (taxableIncome <= 0) return 0;
  
  for (const bracket of TAX_BRACKETS) {
    if (taxableIncome <= bracket.max) {
      return taxableIncome * bracket.rate - bracket.deduction;
    }
  }
  
  return 0;
}

/**
 * 计算年终奖个税（单独计税）
 * @param bonusAmount 年终奖金额
 * @returns 年终奖个税
 */
function calculateYearEndBonusTax(bonusAmount: number): number {
  if (bonusAmount <= 0) return 0;
  
  // 年终奖按月折算后查找税率
  const monthlyBonus = bonusAmount / 12;
  
  for (const bracket of MONTHLY_TAX_BRACKETS) {
    if (monthlyBonus <= bracket.max) {
      return bonusAmount * bracket.rate - bracket.deduction;
    }
  }
  
  return 0;
}

/**
 * 计算年度薪资
 * @param input 薪资输入参数
 * @returns 薪资计算结果
 */
export function calculateAnnualSalary(input: SalaryInput): SalaryResult {
  const { monthlySalary, yearEndBonusMonths, housingFundRatio, overtimeDay, overtimeMultiplier = 1, taxDeductions } = input;
  
  const monthlySalaries: MonthlySalary[] = [];
  
  // 累计值追踪
  let cumulativeIncome = 0;           // 累计工资收入（基本工资+加班费，不含年终奖）
  let cumulativeDeductions = 0;       // 累计五险一金+公积金
  let cumulativeTaxPaid = 0;          // 累计已缴纳个税
  
  // 专项附加扣除（按月均摊，大病医疗为年度总额）
  const monthlySpecialDeductions = taxDeductions ? (
    taxDeductions.childrenEducation +
    taxDeductions.continuingEducation +
    taxDeductions.housingLoanInterest +
    taxDeductions.housingRent +
    taxDeductions.elderCare +
    taxDeductions.personalPension +
    taxDeductions.taxHealthInsurance
  ) : 0;
  
  // 大病医疗按月均摊
  const monthlySeriousIllnessDeduction = taxDeductions ? Math.round(taxDeductions.seriousIllness / 12) : 0;
  
  // 按当年计算（使用当前年份）
  const currentYear = new Date().getFullYear();
  
  for (let month = 1; month <= 12; month++) {
    // 当月基本薪资
    const baseSalary = monthlySalary;
    
    // 当月工作日和加班天数
    const workDays = getWorkDaysInMonth(currentYear, month);
    const overtimeDays = getOvertimeDaysInMonth(currentYear, month, overtimeDay);
    
    // 日均薪资（基本薪资/当月工作日）
    const dailySalary = baseSalary / workDays;
    
    // 加班费（日均薪资 × 加班天数 × 加班倍数）
    const overtimePay = overtimeDays > 0 ? dailySalary * overtimeDays * overtimeMultiplier : 0;
    
    // 当月工资（不含年终奖）
    const monthIncome = baseSalary + overtimePay;
    
    // 五险一金（按基本薪资计算基数，通常以基本工资为基数）
    const socialInsurance = baseSalary * (
      SOCIAL_INSURANCE_RATIOS.pension +
      SOCIAL_INSURANCE_RATIOS.medical +
      SOCIAL_INSURANCE_RATIOS.unemployment
    );
    const housingFund = baseSalary * housingFundRatio;
    const monthlyDeduction = socialInsurance + housingFund;
    
    // 当月专项附加扣除总额
    const specialDeduction = monthlySpecialDeductions + monthlySeriousIllnessDeduction;
    
    // 累计工资收入（含加班费，不含年终奖）
    cumulativeIncome += monthIncome;
    
    // 累计专项扣除（五险一金+公积金+专项附加扣除）
    cumulativeDeductions += monthlyDeduction + specialDeduction;
    
    // 累计减除费用（5000元/月）
    const cumulativeBasicDeduction = TAX_THRESHOLD * month;
    
    // 累计应纳税所得额（综合所得，不含年终奖）
    const cumulativeTaxableIncome = cumulativeIncome - cumulativeBasicDeduction - cumulativeDeductions;
    
    // 截至本月累计应缴个税
    const cumulativeTax = calculateComprehensiveTax(cumulativeTaxableIncome);
    
    // 当月应预扣个税 = 累计应缴 - 已缴
    const monthlyTax = Math.max(0, cumulativeTax - cumulativeTaxPaid);
    
    // 更新累计已缴
    cumulativeTaxPaid = cumulativeTax;
    
    // 12月处理年终奖
    const yearEndBonus = month === 12 && yearEndBonusMonths > 0 ? monthlySalary * yearEndBonusMonths : 0;
    
    // 当月总薪资
    let totalSalary = monthIncome;
    let totalTax = monthlyTax;
    
    if (yearEndBonus > 0) {
      totalSalary += yearEndBonus;
      const bonusTax = calculateYearEndBonusTax(yearEndBonus);
      totalTax += bonusTax;
    }
    
    // 单月应纳税所得额（仅供展示）
    const monthlyTaxableIncome = monthIncome - monthlyDeduction - specialDeduction - TAX_THRESHOLD;
    
    // 到手金额
    const netSalary = totalSalary - monthlyDeduction - totalTax;
    
    monthlySalaries.push({
      month,
      baseSalary,
      overtimePay,
      yearEndBonus,
      totalSalary,
      socialInsurance,
      housingFund,
      specialDeduction,
      tax: totalTax,
      netSalary,
      taxableIncome: monthlyTaxableIncome,
      workDays,
      overtimeDays,
    });
  }
  
  // 计算年度汇总
  const yearlySummary: YearlySummary = {
    totalSalary: monthlySalaries.reduce((sum, m) => sum + m.totalSalary, 0),
    totalBaseSalary: monthlySalaries.reduce((sum, m) => sum + m.baseSalary, 0),
    totalOvertimePay: monthlySalaries.reduce((sum, m) => sum + m.overtimePay, 0),
    totalYearEndBonus: monthlySalaries.reduce((sum, m) => sum + m.yearEndBonus, 0),
    totalSocialInsurance: monthlySalaries.reduce((sum, m) => sum + m.socialInsurance, 0),
    totalHousingFund: monthlySalaries.reduce((sum, m) => sum + m.housingFund, 0),
    totalSpecialDeduction: monthlySalaries.reduce((sum, m) => sum + m.specialDeduction, 0),
    totalTax: monthlySalaries.reduce((sum, m) => sum + m.tax, 0),
    totalNetSalary: monthlySalaries.reduce((sum, m) => sum + m.netSalary, 0),
  };
  
  return {
    monthlySalaries,
    yearlySummary,
  };
}

/**
 * 格式化金额显示
 * @param amount 金额
 * @returns 格式化后的字符串
 */
export function formatCurrency(amount: number): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '0.00';
  }
  return amount.toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
