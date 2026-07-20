 
const fs = require('fs');
const path = require('path');
 
const TESTCASES_FOLDER = path.join(__dirname, '../testcases');
const ALLURE_FOLDER = path.join(__dirname, '../../allure-results');
const OUTPUT_FOLDER = path.join(__dirname, '../../result-ai');
const OUTPUT_FILE = path.join(OUTPUT_FOLDER, 'ai-report.json');
 
 
function convertMsToSec(ms) {
  return (ms / 1000).toFixed(1).replace('.0', '');
}
 
function mapStatus(status) {
  if (status === 'passed') return 'pass';
  if (status === 'failed') return 'fail';
  if (status === 'broken') return 'fail';
  return status;
 
}
 
 
function getAllTestcases(folder) {
  let results = [];
  const items = fs.readdirSync(folder);
  items.forEach(item => {
    const full = path.join(folder, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      results = results.concat(getAllTestcases(full));
    } else if (item.endsWith('.json')) {
      const data = JSON.parse(fs.readFileSync(full, 'utf-8'));
      results.push({
        name: data.testCase.name,
        testcaseid: data.testCase.testCaseId,
        Priority: data.testCase.priority
      });
    }
  });
  return results;
}
 
// read allure result.json
 
function getAllureResults() {
  if (!fs.existsSync(ALLURE_FOLDER)) return [];
  const files = fs.readdirSync(ALLURE_FOLDER);
  return files
    .filter(f => f.endsWith('-result.json'))
    .map(f => {
      const c = JSON.parse(
        fs.readFileSync(path.join(ALLURE_FOLDER, f), 'utf-8')
      );
 
      const time = convertMsToSec(c.stop - c.start);
      return {
        stauts: mapStatus(c.status),
        timing: `${time}s`,
        rawName: c.name,
        start: c.start
      };
    })
    .sort((a, b) => a.start - b.start);
}
 
// main
 
module.exports = async () => {
  const inputs = getAllTestcases(TESTCASES_FOLDER);
  const results = getAllureResults();
  if (!fs.existsSync(OUTPUT_FOLDER)) {
    fs.mkdirSync(OUTPUT_FOLDER, { recursive: true });
  }
  const final = results.map(res => {
  const input = inputs.find(inp =>
    res.rawName &&
    res.rawName.toLowerCase().includes(inp.name.toLowerCase())
  );
 
  return {
    name: input ? input.name : '',
    testcaseid: input ? input.testcaseid : '',
    Priority: input ? input.Priority : '',
    stauts: res.stauts,
    timing: res.timing
  };
});
 
  const out = {
    TestcaseResult: final
  };
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(out, null, 2));
};
 
 