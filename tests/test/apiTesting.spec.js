import { test } from '@playwright/test';
import apiData from '../testData/api.json';
import { APIService } from '../pages/apiTesting';

test.describe('API Automation Testing', () => {
  test('API - CRUD Operations Validation', async ({ request }) => {
    if (!apiData.get && !apiData.post && !apiData.put && !apiData.delete) {
      test.skip();
    }
    const api = new APIService(request, apiData);
    await api.runPositiveFlow();
  });

  test('API - CRUD Error Validation', async ({ request }) => {
    if (!apiData.negative) {
      test.skip();
    }
    const api = new APIService(request, apiData);
    await api.runNegativeTests();
  });
});
