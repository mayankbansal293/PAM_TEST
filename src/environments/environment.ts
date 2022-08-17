/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  URL_Node: "http://localhost:3002",
  // "URL_Node": "https://ecommerce.getpaypr-qa.com",
  MOBILECODE: ["+1", "+91"],
  CLIENT_CODE: "PAYPR",
  SHOWLANGBUTTON: false,
  MOBILE_MAX_LENGTH: 10,
  MOBILE_MIN_LENGTH: 8,
  ALLOWED_ULRS: [
    "/backoffice/home",
    "/backoffice/unauthorized",
    "/signin",
    "/forgotPassword",
    "/backoffice/PPL",
    "/backoffice/DGE",
    "/backoffice/SLE",
    "/backoffice/SBS",
    "/change_password",
    "/backoffice/iframe",
    "/backoffice/IGE",
    "/backoffice/SPE",
  ],
  BUILD_NAME: "RMSFrontEndOptimized",
  CAPTCHA_SITEKEY: "6LcFuTkdAAAAALB4rF9Cb2VxN0MAgmED9b_QLJjG",
  ENABLE_CAPTCHA: false,
};
