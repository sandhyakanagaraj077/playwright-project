const fs = require('fs');
const { execSync } = require('child_process');
const reportsDir = './reports';
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir);
}

const reportType = process.argv[2] || 'test';
let resultsFolder = './allure-results';
console.log('report', reportType);

if (reportType === 'web') {
  resultsFolder = './allure-results';
}

if (reportType === 'api') {
  resultsFolder = './allure-results';
}

const existingReports =
  fs.readdirSync(reportsDir).filter((r) => r.includes(reportType)).length + 1;
const reportPath = `reports/${reportType}-report-${existingReports}`;
console.log(`Generating report: ${reportPath}`);
execSync(`allure generate ${resultsFolder} -o ${reportPath}`, {
  stdio: 'inherit',
});
execSync(`allure open ${reportPath}`, { stdio: 'inherit' });
