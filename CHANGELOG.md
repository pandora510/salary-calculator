# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2026-06-27

### Added
- 月度薪资明细计算（12个月）
- 五险一金自动计算（养老、医疗、失业保险及公积金）
- 个税累计预扣法实现
- 加班费计算（支持周六/周日加班，可配置倍数）
- 年终奖单独计税
- 8项专项附加扣除支持：
  - 子女教育
  - 继续教育
  - 大病医疗
  - 住房贷款利息
  - 住房租金
  - 赡养老人
  - 个人养老金
  - 税优健康险
- 数据可视化图表（堆叠面积图、堆叠柱状图）
- 本地存储功能（自动保存和恢复计算结果）
- 响应式设计
- 年度汇总卡片展示

### Features
- `SalaryInput` - 薪资参数输入组件
- `TaxDeductionInput` - 专项附加扣除输入面板
- `MonthlyTable` - 月度薪资明细表格
- `YearlySummary` - 年度薪资汇总卡片
- `SalaryChart` - 薪资数据可视化图表
