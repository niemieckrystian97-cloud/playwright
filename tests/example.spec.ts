import { test, expect } from '@playwright/test';
import { text } from 'stream/consumers';

//https://automationexercise.com/test_cases

//Interfaces
interface SingleProduct {
  name: string;
  price: string;
}

interface User {
  firstName: string;
  lastName: string;
  company: string;
  address: string;
  address2: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
  mobileNumber: string;
  mail: string;
  password: string
}

//Helper functions and variables
const WebsiteAddres = 'https://automationexercise.com/';
let DeleteFlag = true;

//User
const user: User = {
  firstName: 'Jan',
  lastName: 'Kowalski',
  company: 'Firma',
  address: 'Brudna',
  address2: '42/5',
  city: 'InoWrocław',
  state: 'Slask',
  zipcode: '09-876',
  country: 'Canada',
  mobileNumber: '222333444',
  mail: 'JasiekKowalski@xfasd.com',
  password: '123456789'
}



async function createUser(page) {
  await page.goto(WebsiteAddres);
  const consentBtn = page.getByRole('button', { name: 'Consent' });
  if (await consentBtn.isVisible()) {
    await consentBtn.click();
  }
  await page.getByRole('link', { name: /signup/i }).click();
  await expect(page.getByText(/new user signup/i)).toBeVisible();
  const signupSection = page.getByText('New User Signup!').locator('..');
  await signupSection.getByPlaceholder(/Name/).fill(user.firstName);
  await signupSection.getByPlaceholder(/Email/).fill(user.mail);
  await signupSection.getByRole('button').nth(0).click();

  await expect(page.getByText('ENTER ACCOUNT INFORMATION')).toBeVisible();
  let tempLocator = await page.getByText('Title').locator('..');
  await tempLocator.getByRole('radio', { name: 'Mr.' }).click();

  tempLocator = await page.getByText('Password *').nth(0).locator('..');
  await tempLocator.getByRole('textbox').first().fill(user.password);

  tempLocator = await page.getByText('First name *').nth(0).locator('..');
  await tempLocator.getByRole('textbox').first().fill(user.firstName);

  tempLocator = await page.getByText('Last name *').nth(0).locator('..');
  await tempLocator.getByRole('textbox').first().fill(user.lastName);

  await page.getByRole('checkbox', { name: 'Sign up for our newsletter!' }).click();
  await page.getByRole('checkbox', { name: 'Receive special offers from our partners!' }).click();
  tempLocator = await page.getByText('Company').nth(0).locator('..');
  await tempLocator.getByRole('textbox').first().fill(user.company);
  tempLocator = await page.getByText('Address *').first().locator('..');
  await tempLocator.getByRole('textbox').first().fill(user.address);
  tempLocator = await page.getByText('Address 2').first().locator('..');
  await tempLocator.getByRole('textbox').first().fill(user.address2);
  tempLocator = await page.getByText('Country').first().locator('..');
  await tempLocator.locator('label').first().selectOption(user.country);
  tempLocator = await page.getByText('State *').first().locator('..');
  await tempLocator.getByRole('textbox').first().fill(user.state);
  tempLocator = await page.getByText('City *').first().locator('..');
  await tempLocator.getByRole('textbox').first().fill(user.city);
  tempLocator = await page.getByText('Zipcode *').first().locator('..');
  await tempLocator.getByRole('textbox').first().fill(user.zipcode);
  tempLocator = await page.getByText('Mobile Number *').first().locator('..');
  await tempLocator.getByRole('textbox').first().fill(user.mobileNumber);
  await page.getByRole('button', { name: 'Create Account' }).click();
  await expect(page.getByText('ACCOUNT CREATED!')).toBeVisible();
  await page.getByRole('link', { name: /Continue/i }).click();
}

async function consentBtn(page) {
  const consentBtn = page.getByRole('button', { name: 'Consent' });
  if (await consentBtn.isVisible()) {
    await consentBtn.click();
  }
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
  await page.goto(WebsiteAddres);
}
test('TC2 Login User', async ({ page }) => {
  DeleteFlag = false;
  await createUser(page);
  await logOut(page);
  await page.getByRole('link', { name: /signup/i }).click();

  const signupSection = page.getByText('Login to your account').locator('..');
  await signupSection.getByPlaceholder(/Email/).fill(user.mail);
  await signupSection.getByPlaceholder(/Password/).fill(user.password);
  await signupSection.getByRole('button').nth(0).click();
  await page.getByRole('link', { name: /Delete/i }).click();
  await expect(page.getByText('ACCOUNT DELETED!')).toBeVisible();
  await page.getByRole('link', { name: /Continue/i }).click();
})
test('TC3 Inncorrect Email', async ({ page }) => {
  await page.goto(WebsiteAddres);
  const consentBtn = page.getByRole('button', { name: 'Consent' });
  if (await consentBtn.isVisible()) {
    await consentBtn.click();
  }


  await page.getByRole('link', { name: /signup/i }).click();
  await expect(page.getByText(/new user signup/i)).toBeVisible();
  const signupSection = page.getByText('Login to your account').locator('..');
  await signupSection.getByPlaceholder(/Email/).fill('bad@wrong.com');
  await signupSection.getByPlaceholder(/Password/).fill(user.password);
  await signupSection.getByRole('button').nth(0).click();
  await expect(page.getByText('Your email or password is incorrect!')).toBeVisible();

}
)
test('TC4 Logout User', async ({ page }) => {

  // Fix needed!

  // DeleteFlag = false;
  // await createUser(page);
  // await logOut(page);
  // await page.getByRole('link', { name: /signup/i }).click();

  await page.goto(WebsiteAddres);
  const consentBtn = page.getByRole('button', { name: 'Consent' });
  if (await consentBtn.isVisible()) {
    await consentBtn.click();
  }

  await page.getByRole('link', { name: /signup/i }).click();
  await expect(page.getByText('Login to your account')).toBeVisible();
  const signupSection = page.getByText('Login to your account').locator('..');
  await signupSection.getByPlaceholder(/Email/).fill(user.mail);
  await signupSection.getByPlaceholder(/Password/).fill(user.password);
  await signupSection.getByRole('button').nth(0).click();

  await expect(page.getByText(`Logged in as ${user.firstName}`)).toBeVisible();
  await expect(page.getByRole('link', { name: /logout/i })).toBeVisible();

  await page.getByRole('link', { name: /logout/i }).click();
  await expect(page).toHaveURL(WebsiteAddres + 'login');
})

test('TC5 Register User with existing email', async ({ page }) => {
  await page.goto(WebsiteAddres);
  const consentBtn = page.getByRole('button', { name: 'Consent' });
  if (await consentBtn.isVisible()) {
    await consentBtn.click();
  }

  // Assuming we already have an account
  await page.getByRole('link', { name: /signup/i }).click();
  await expect(page.getByText('New User Signup!')).toBeVisible();
  const signupSection = page.getByText('New User Signup!').locator('..');
  await signupSection.getByRole('textbox', { name: /Name/i }).fill(user.firstName);
  await signupSection.getByPlaceholder(/Email/).fill(user.mail);
  await signupSection.getByRole('button', { name: /Signup/i }).click();
  await expect(signupSection.getByText('Email Address already exist!')).toBeVisible();
})

test('TC6 Contact Us Form', async ({ page }) => {
  await page.goto(WebsiteAddres);
  const consentBtn = page.getByRole('button', { name: 'Consent' });
  if (await consentBtn.isVisible()) {
    await consentBtn.click();
  }

  await page.getByRole('link', { name: /Contact us/i }).click();
  await expect(page.getByText('GET IN TOUCH')).toBeVisible();
  const formSection = page.getByText('GET IN TOUCH').locator('..');
  await formSection.getByRole('textbox', { name: /Name/i }).fill(user.firstName);
  await formSection.getByRole('textbox', { name: /Email/i }).fill(user.mail);
  await formSection.getByRole('textbox', { name: /Subject/i }).fill('xyz');
  await formSection.getByRole('textbox', { name: /Your message here/i }).fill('zyx');
  await formSection.getByRole('button', { name: /Choose file/i }).setInputFiles('C:/Users/kniemie/Desktop/Test.jpg');
  page.once('dialog', async dialog => {
    await dialog.accept();
  });
  await formSection.getByRole('button', { name: /Submit/i }).click();
  const section = page.locator('#contact-page');
  await expect(section.getByText('Success! Your details have been submitted successfully.')).toBeVisible({ timeout: 9000 });
  await section.getByText(/Home/i).click();
})

test('TC7 Verify Test Cases Page', async ({ page }) => {
  await page.goto(WebsiteAddres);
  await consentBtn(page);
  const navLocator = page.locator('div').nth(2);
  await navLocator.getByRole('link', { name: /Test cases/i }).click();
  await expect(page).toHaveURL(WebsiteAddres + 'test_cases');
})
test('TC8 Verify All Products and product detail page', async ({ page }) => {
  await page.goto(WebsiteAddres);
  await consentBtn(page);
  const navLocator = page.locator('div').nth(2);
  await navLocator.getByRole('link', { name: /Products/i }).click();
  await expect(page).toHaveURL(WebsiteAddres + 'products');
  await expect(page.getByText('ALL PRODUCTS')).toBeVisible();
  const productListSection = page.getByText('ALL PRODUCTS').locator('..');
  const product = productListSection.locator('.single-products').first();
  const productName = await product.locator('.productinfo p').innerText();
  await productListSection.getByText(/View Product/).nth(0).click();
  const productInformation = page.locator('.product-information').first();
  const productName2 = await productInformation.locator('h2').innerText();
  expect(productName2.trim()).toBe(productName.trim()); //Check name from product list to actual product
  await expect(productInformation.getByText(/Category:/)).toBeVisible();
  await expect(productInformation.getByText(/Availability:/)).toBeVisible();
  await expect(productInformation.getByText(/Condition:/)).toBeVisible();
  await expect(productInformation.getByText(/Brand:/)).toBeVisible();
})

test('TC9 Search Product', async ({ page }) => {
  const searchProductName = 'Blue';

  await page.goto(WebsiteAddres);
  await consentBtn(page);
  const navLocator = page.locator('div').nth(2);
  await navLocator.getByRole('link', { name: /Products/i }).click();
  await expect(page).toHaveURL(WebsiteAddres + 'products');
  await expect(page.getByText('ALL PRODUCTS')).toBeVisible();

  await page.locator('#search_product').nth(0).fill(searchProductName);
  await page.locator('#submit_search').nth(0).click();
  await expect(page.getByText('SEARCHED PRODUCTS')).toBeVisible();
  const productListSection = page.getByText('SEARCHED PRODUCTS').locator('..');
  const countElements = await productListSection.locator('.single-products').count();
  for (let i = 0; i < countElements; i++) {
    const product = productListSection.locator('.single-products').nth(i);
    const productName = await product.locator('.productinfo p').innerText();
    if (!(productName.toLowerCase().includes(searchProductName.toLowerCase()))) {
      throw new Error('Search doesn t work correctly.');
    }

  }
})

test('TC10 Verify Subscription in home page', async ({ page }) => {
  await page.goto(WebsiteAddres);
  await consentBtn(page);

  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });

  await page.waitForTimeout(300);
  const footerText = page.locator('xpath=//*[contains(text(), "Subscription")]');

  const isInViewport = await footerText.evaluate((node) => {
    const rect = node.getBoundingClientRect();
    return rect.bottom > 0 && rect.top < window.innerHeight;
  });
  if (!isInViewport) {
    throw new Error('Search doesn t work correctly.');
  }

  await page.getByRole('textbox', { name: /Your email address/ }).fill('xyz@xyz.com');
  await page.locator('#subscribe').click();
  await expect(page.getByText('You have been successfully subscribed!')).toBeVisible();
});

test('TC11 Verify Subscription in Cart page', async ({ page }) => {
  await page.goto(WebsiteAddres);
  await consentBtn(page);

  const navLocator = page.locator('div').nth(2);
  await navLocator.getByRole('link', { name: /Cart/i }).click();

  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });
  await page.waitForTimeout(300);
  const footerText = page.locator('xpath=//*[contains(text(), "Subscription")]');
  const isInViewport = await footerText.evaluate((node) => {
    const rect = node.getBoundingClientRect();
    return rect.bottom > 0 && rect.top < window.innerHeight;
  });
  if (!isInViewport) {
    throw new Error('Search doesn t work correctly.');
  }

  await page.getByRole('textbox', { name: /Your email address/ }).fill('xyz@xyz.com');
  await page.locator('#subscribe').click();
  await expect(page.getByText('You have been successfully subscribed!')).toBeVisible();
})

test('TC12 Add Products in Cart', async ({ page }) => {
  await page.goto(WebsiteAddres);
  await consentBtn(page);

  const navLocator = page.locator('div').nth(2);
  await navLocator.getByRole('link', { name: /Products/i }).click();

  let products: SingleProduct[] = [];

  const firstElement = await page.locator('.single-products').nth(0);
  products.push({
    name: (await firstElement.locator('.productinfo p').innerText()).toString().trim(),
    price: (await firstElement.locator('.productinfo h2').innerText()).toString().trim()
  })

  await firstElement.getByText(/Add to cart/i).first().click();
  await page.getByRole('button', { name: /Continue Shopping/i }).click();



  const secondElement = await page.locator('.single-products').nth(1);
  products.push({
    name: (await secondElement.locator('.productinfo p').innerText()).toString().trim(),
    price: (await secondElement.locator('.productinfo h2').innerText()).toString().trim()
  })

  await secondElement.getByText(/Add to cart/i).first().click();
  await page.getByRole('link', { name: /View cart/i }).click();

  console.log(products);

  for (let i = 1; i < 3; i++) {
    const productListLocator = page.locator(`#product-${i}`);
    const productName = (await productListLocator.locator('.cart_description a').innerText()).toString().trim();
    const productPrice = (await productListLocator.locator('.cart_price p').innerText()).toString().trim();

    if (!(productName.toLowerCase().includes(products[i - 1].name.toLowerCase()))) {
      throw new Error('Search doesn t work correctly.');
    }
    if (!(productPrice.toLowerCase().includes(products[i - 1].price.toLowerCase()))) {
      throw new Error('Search doesn t work correctly.');
    }
  }

})

test('TC13 Verify Product quantity in Cart', async ({ page }) => {
  await page.goto(WebsiteAddres);
  await consentBtn(page);

  const productsLocator = await page.locator('.choose').nth(0);
  await productsLocator.getByText(/View Product/i).nth(0).click();

  let incrasedValue = '4';
  await page.locator('#quantity').click();
  await page.locator('#quantity').fill(incrasedValue);
  await page.getByRole('button', { name: /Add to cart/i }).click();
  await page.getByRole('link', { name: /View cart/i }).click();

  const productListLocator = page.locator('#product-1');
  const quantityLocator = productListLocator.locator('.cart_quantity');

  const quantityButton = quantityLocator.getByRole('button');
  const quantityValue = await quantityButton.innerText();
  if (quantityValue != incrasedValue) {
    throw new Error('Search doesn t work correctly.');
  }
})

test('TC14 Place Order: Register while Checkout', async ({ page }) => {
  await page.goto(WebsiteAddres);
  await consentBtn(page);

  let numberOfProducts = 3; // The number of products that will be added to the order
  let products: SingleProduct[] = [];

  //Adding few products to cart
  for (let i = 0; i < numberOfProducts; i++) {
    const singleProductLocator = page.locator('.single-products').nth(i);
    products.push({
      name: (await singleProductLocator.locator('.productinfo p').innerText()).toString().trim(),
      price: (await singleProductLocator.locator('.productinfo h2').innerText()).toString().trim()
    })
    await singleProductLocator.getByText(/Add to cart/i).first().click();
    await page.getByRole('button', { name: /Continue Shopping/i }).click();
  }

  const headerLocator = page.locator('#header');
  await headerLocator.getByText(/Cart/i).click();
  await page.getByText(/Proceed To Checkout/i).click();
  await page.getByRole('link', { name: /Register \/ Login/i }).click();

  //Creating user
  const signupSection = page.getByText('New User Signup!').locator('..');
  await signupSection.getByPlaceholder(/Name/).fill(user.firstName);
  await signupSection.getByPlaceholder(/Email/).fill(user.mail);
  await signupSection.getByRole('button').nth(0).click();
  await expect(page.getByText('ENTER ACCOUNT INFORMATION')).toBeVisible();
  let tempLocator = await page.getByText('Title').locator('..');
  await tempLocator.getByRole('radio', { name: 'Mr.' }).click();
  tempLocator = await page.getByText('Password *').nth(0).locator('..');
  await tempLocator.getByRole('textbox').first().fill(user.password);
  tempLocator = await page.getByText('First name *').nth(0).locator('..');
  await tempLocator.getByRole('textbox').first().fill(user.firstName);
  tempLocator = await page.getByText('Last name *').nth(0).locator('..');
  await tempLocator.getByRole('textbox').first().fill(user.lastName);
  await page.getByRole('checkbox', { name: 'Sign up for our newsletter!' }).click();
  await page.getByRole('checkbox', { name: 'Receive special offers from our partners!' }).click();
  tempLocator = await page.getByText('Company').nth(0).locator('..');
  await tempLocator.getByRole('textbox').first().fill(user.company);
  tempLocator = await page.getByText('Address *').first().locator('..');
  await tempLocator.getByRole('textbox').first().fill(user.address);
  tempLocator = await page.getByText('Address 2').first().locator('..');
  await tempLocator.getByRole('textbox').first().fill(user.address2);
  tempLocator = await page.getByText('Country').first().locator('..');
  await tempLocator.locator('label').first().selectOption(user.country);
  tempLocator = await page.getByText('State *').first().locator('..');
  await tempLocator.getByRole('textbox').first().fill(user.state);
  tempLocator = await page.getByText('City *').first().locator('..');
  await tempLocator.getByRole('textbox').first().fill(user.city);
  tempLocator = await page.getByText('Zipcode *').first().locator('..');
  await tempLocator.getByRole('textbox').first().fill(user.zipcode);
  tempLocator = await page.getByText('Mobile Number *').first().locator('..');
  await tempLocator.getByRole('textbox').first().fill(user.mobileNumber);
  await page.getByRole('button', { name: 'Create Account' }).click();
  await expect(page.getByText('ACCOUNT CREATED!')).toBeVisible();
  await page.getByRole('link', { name: /Continue/i }).click();

  await expect(headerLocator.getByText(`Logged in as ${user.firstName}`)).toBeVisible();
  await headerLocator.getByText(/Cart/i).click();
  await page.getByText(/Proceed To Checkout/i).click();
  let verifyUserLocator = page.locator('#address_delivery');

  // Checking address in order summary
  for (let i = 0; i < 2; i++) {
    if (i == 1) {
      verifyUserLocator = page.locator('#address_invoice');
    }
    let firstLastNameElement = verifyUserLocator.locator('.address_firstname');
    let companyElement = verifyUserLocator.locator('.address_address1').nth(0);
    let addressElement = verifyUserLocator.locator('.address_address1').nth(1);
    let address2Element = verifyUserLocator.locator('.address_address1').nth(2);
    let addressCityElement = verifyUserLocator.locator('.address_city');
    let addressCountryElement = verifyUserLocator.locator('.address_country_name');
    let addressPhoneElement = verifyUserLocator.locator('.address_phone');
    let temp = '';
    let raw = await firstLastNameElement.textContent();
    temp = (raw ?? '').trim().replace(/^(Mr\.|Mrs\.)\s+/i, '');
    if (temp != `${user.firstName} ${user.lastName}`) {
      throw new Error('The data in the form does not match');
    }
    temp = (await companyElement.textContent())?.trim() ?? '';
    if (temp != user.company) {
      throw new Error('The data in the form does not match');
    }
    temp = (await addressElement.textContent())?.trim() ?? '';
    if (temp != user.address) {
      throw new Error('The data in the form does not match');
    }
    temp = (await address2Element.textContent())?.trim() ?? '';
    if (temp != user.address2) {
      throw new Error('The data in the form does not match');
    }
    raw = await addressCityElement.textContent();
    temp = (raw ?? '').replace(/\s+/g, ' ').trim();
    if (temp != `${user.city} ${user.state} ${user.zipcode}`) {
      throw new Error('The data in the form does not match');
    }
    temp = (await addressCountryElement.textContent())?.trim() ?? '';
    if (temp != user.country) {
      throw new Error('The data in the form does not match');
    }
    temp = (await addressPhoneElement.textContent())?.trim() ?? '';
    if (temp != user.mobileNumber) {
      throw new Error('The data in the form does not match');
    }
  }

  let expectProducts: SingleProduct[] = [];
  let reviewOrderLocator = page.locator('#cart_info');
  for (let i = 0; i < numberOfProducts; i++) {
    let singleOrderLocator = reviewOrderLocator.locator(`#product-${i + 1}`);
    expectProducts.push({
      name: (await singleOrderLocator.locator('.cart_description a').innerText()).toString().trim(),
      price: (await singleOrderLocator.locator('.cart_price p').innerText()).toString().trim()
    })
  }

  //Check oreder items in review order
  for (let i = 0; i < numberOfProducts; i++) {
    if (products[i].name != expectProducts[i].name
      || products[i].price != expectProducts[i].price
    ) {
      throw new Error('The order summary is different from the order placed');
    }
  }

  await page.locator('#ordermsg textarea').fill('Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum');
  await page.getByRole('link', { name: /Place Order/i }).click();

  await page.locator('input[name = "name_on_card"]').fill('TestCard');
  await page.locator('input[name = "card_number"]').fill('123456789');
  await page.getByRole('textbox', { name: /ex./i }).fill('311');
  await page.getByRole('textbox', { name: /MM/i }).fill('01');
  await page.getByRole('textbox', { name: /YYYY/i }).fill('2026');

  const successMessage = page.locator('#success_message .alert-success');
  await Promise.all([
    expect(page.getByText(/Your order has been placed successfully!/i)).toBeAttached(),
    await page.getByRole('button', { name: /Pay and confirm order/i }).click(),

  ]);

  await Promise.all([
    headerLocator.getByText(/Delete Account/i).click(),
    await expect(page.getByText(/ACCOUNT DELETED!/i)).toBeVisible()
  ])
  await page.getByRole('link', { name: /Continue/i }).click();

})