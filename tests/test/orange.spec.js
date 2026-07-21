import { test } from '@playwright/test';
import { OrangeHRMPage } from '../pages/orangeHRMpage';
import login from '../testcases/smoke/login.json';
import invalidLogin from '../testcases/regression/invalidLogin.json';
import addEmployee from '../testcases/regression/addEmployee.json';
import searchAdmin from '../testcases/sanity/searchAdmin.json';
import editInfo from '../testcases/sanity/editInfo.json';
import logout from '../testcases/logout.json';
import { step } from 'allure-js-commons';

async function runTest(page, testCaseJson) {
  const orange = new OrangeHRMPage(page);
  for (const stepData of testCaseJson.testCase.steps) {
    const stepName = `Step ${stepData.stepNumber}: ${stepData.stepDescription}`;
    //console.log(stepName);
    await step(stepName, async () => {
      await orange.executeStep(stepData);
    });
  }
}

test.only('Login to the application @smoke', async ({ page }) => {
  await runTest(page, login);
});

test('Login with invalid credentials @regression', async ({ page }) => {
  await runTest(page, invalidLogin);
});

test('Add employee with valid details and upload photo @regression', async ({
  page,
}) => {
  await runTest(page, addEmployee);
});

test('Search Admin User @sanity', async ({ page }) => {
  await runTest(page, searchAdmin);
});

test('Update My Info - Gender and Marital Status @sanity', async ({ page }) => {
  await runTest(page, editInfo);
});

test('Logout from the application @general', async ({ page }) => {
  await runTest(page, logout);
});
