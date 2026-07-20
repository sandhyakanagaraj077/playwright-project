import { test } from '@playwright/test';

export async function validateResponseData(responseBody, requestPayload, parentKey = '') {

  for (const key in requestPayload) {

    const fullKey = parentKey ? `${parentKey}.${key}` : key;

    if (typeof requestPayload[key] === 'object' && requestPayload[key] !== null) {

      await validateResponseData(responseBody[key], requestPayload[key], fullKey);

    } else {

      const expected = requestPayload[key];

      const actual = responseBody?.[key];

      await test.step(

        `Validate ${fullKey} | Expected: ${expected} | Actual: ${actual}`,

        async () => {

          if (actual !== undefined && actual !== expected) {

            throw new Error(

              `Validation Failed | Field: ${fullKey} | Expected: ${expected} | Actual: ${actual}`

            );

          }

        }

      );

    }

  }

}
 