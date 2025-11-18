import { test, expect } from '@playwright/test';
import { text } from 'stream/consumers';

//https://automationexercise.com/test_cases
//Helper functions and variables
let DeleteFlag = true;
//User
const UserName = 'Jan';
const UserSurname = 'Kowalski';
const UserE_mail = 'JasiekKowalski@xfasd.com';
const UserPassword = '123456789'

async function createUser(page) {
  await page.goto('https://automationexercise.com/');
  const consentBtn = page.getByRole('button', { name: 'Consent' });
  if (await consentBtn.isVisible()) {
    await consentBtn.click();
  }
  await page.getByRole('link', { name: /signup/i }).click();
  await expect(page.getByText(/new user signup/i)).toBeVisible();
  const signupSection = page.getByText('New User Signup!').locator('..'); //locator .. bierze wszystko co jest rodzicem new users signup
  await signupSection.getByPlaceholder(/Name/).fill(UserName);
  await signupSection.getByPlaceholder(/Email/).fill(UserE_mail);
  await signupSection.getByRole('button').nth(0).click();

  await expect(page.getByText('ENTER ACCOUNT INFORMATION')).toBeVisible();
  let tempLocator = await page.getByText('Title').locator('..');
  await tempLocator.getByRole('radio', { name: 'Mr.' }).click();

  tempLocator = await page.getByText('Password *').nth(0).locator('..');
  await tempLocator.getByRole('textbox').first().fill(UserPassword);

  tempLocator = await page.getByText('First name *').nth(0).locator('..');
  await tempLocator.getByRole('textbox').first().fill(UserName);

  tempLocator = await page.getByText('Last name *').nth(0).locator('..');
  await tempLocator.getByRole('textbox').first().fill(UserSurname);

  await page.getByRole('checkbox', { name: 'Sign up for our newsletter!' }).click();
  await page.getByRole('checkbox', { name: 'Receive special offers from our partners!' }).click();
  tempLocator = await page.getByText('Company').nth(0).locator('..');
  await tempLocator.getByRole('textbox').first().fill('XYZ');
  tempLocator = await page.getByText('Address *').first().locator('..');
  await tempLocator.getByRole('textbox').first().fill('XYZ');
  tempLocator = await page.getByText('Address 2').first().locator('..');
  await tempLocator.getByRole('textbox').first().fill('XYZ');
  tempLocator = await page.getByText('Country').first().locator('..');
  await tempLocator.locator('label').first().selectOption('Canada');
  tempLocator = await page.getByText('State *').first().locator('..');
  await tempLocator.getByRole('textbox').first().fill('XYZ');
  tempLocator = await page.getByText('City *').first().locator('..');
  await tempLocator.getByRole('textbox').first().fill('XYZ');
  tempLocator = await page.getByText('Zipcode *').first().locator('..');
  await tempLocator.getByRole('textbox').first().fill('00-000');
  tempLocator = await page.getByText('Mobile Number *').first().locator('..');
  await tempLocator.getByRole('textbox').first().fill('444444444');
  await page.getByRole('button', { name: 'Create Account' }).click();
  await expect(page.getByText('ACCOUNT CREATED!')).toBeVisible();
  await page.getByRole('link', { name: /Continue/i }).click();
}

test('TC1 Register User', async ({ page }) => {
  await createUser(page);
  if (DeleteFlag) {
    await page.getByRole('link', { name: /Delete/i }).click();
    await expect(page.getByText('ACCOUNT DELETED!')).toBeVisible();
    await page.getByRole('link', { name: /Continue/i }).click();
  }

})
async function logOut(page) {
  await page.getByRole('link', { name: /Logout/i }).click();
  await page.goto('https://automationexercise.com/');
}
test('TC2 Login User', async ({ page }) => {
  DeleteFlag = false;
  await createUser(page);
  await logOut(page);
  await page.getByRole('link', { name: /signup/i }).click();

  const signupSection = page.getByText('Login to your account').locator('..');
  await signupSection.getByPlaceholder(/Email/).fill(UserE_mail);
  await signupSection.getByPlaceholder(/Password/).fill(UserPassword);
  await signupSection.getByRole('button').nth(0).click();
  await page.getByRole('link', { name: /Delete/i }).click();
  await expect(page.getByText('ACCOUNT DELETED!')).toBeVisible();
  await page.getByRole('link', { name: /Continue/i }).click();
})
test('TC3 Inncorrect Email', async ({ page }) => {
  await page.goto('https://automationexercise.com/');
  const consentBtn = page.getByRole('button', { name: 'Consent' });
  if (await consentBtn.isVisible()) {
    await consentBtn.click();
  }


  await page.getByRole('link', { name: /signup/i }).click();
  await expect(page.getByText(/new user signup/i)).toBeVisible();
  const signupSection = page.getByText('Login to your account').locator('..');
  await signupSection.getByPlaceholder(/Email/).fill('bad@wrong.com');
  await signupSection.getByPlaceholder(/Password/).fill(UserPassword);
  await signupSection.getByRole('button').nth(0).click();
  await expect(page.getByText('Your email or password is incorrect!')).toBeVisible();

}
)
test('TC4 VeryfiyLogin', async ({ page }) => {
  DeleteFlag = false;
  await createUser(page);
  await logOut(page);
  await page.getByRole('link', { name: /signup/i }).click();

  await expect(page.getByText('Login to your account')).toBeVisible();
  const signupSection = page.getByText('Login to your account').locator('..');
  await signupSection.getByPlaceholder(/Email/).fill(UserE_mail);
  await signupSection.getByPlaceholder(/Password/).fill(UserPassword);
  await signupSection.getByRole('button').nth(0).click();

  await expect(page.getByText(`Logged in as ${UserName}`)).toBeVisible();
  await expect(page.getByRole('link', { name: /logout/i })).toBeVisible();

  await page.getByRole('link', { name: /logout/i }).click();
  await expect(page).toHaveURL('https://automationexercise.com/');
})