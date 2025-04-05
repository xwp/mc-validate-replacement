# MailChimp Validate Replacement Plugin

**Contributors:** [XWP](https://xwp.co/)
**Tags:** mailchimp, validation, performance, javascript
**Requires at least:** 6.5
**Tested up to:** 6.7.2
**Stable tag:** 1.0.0
**License:** GPLv2+
**License URI:** https://www.gnu.org/licenses/gpl-2.0.html

MC Validate Replacement is a WordPress plugin designed to replace the default MailChimp `mc-validate.js` script with a more performant, modern JavaScript solution for validating MailChimp signup forms embedded on your WordPress site.

## Description

This plugin automatically dequeues the standard MailChimp validation script (if present) and enqueues a custom validation script (`assets/js/mc-validate.min.js`) and its associated styles (`assets/css/mc-validate.css`). The primary goal is to improve front-end performance by using a potentially lighter script and loading assets efficiently (deferring JavaScript, loading CSS asynchronously).

The validation logic is inspired by modern HTML5 form validation and provides user feedback for common input errors directly on the form.

## Features

*   Replaces the default `mc-validate.js` downloaded from MailChimp.
*   Provides client-side validation for MailChimp forms using standard HTML5 validation attributes (`required`, `type="email"`, `minLength`, `maxLength`, `pattern`, etc.).
*   Displays inline error messages for invalid fields.
*   Loads the validation JavaScript using the `defer` strategy for better performance.
*   Loads the associated CSS asynchronously with a `<noscript>` fallback.
*   Handles MailChimp's JSONP response for success and error messages, including captcha redirects.

## Installation

1.  Upload the `mc-validate-replacement` folder to the `/wp-content/plugins/` directory.
2.  Turn off or disable the official mc-validate.js file (usually it's a script along the lines of mc-validate.js coming from a MailChimp CDN).
2.  Activate the plugin through the 'Plugins' menu in WordPress.
3.  Ensure your embedded MailChimp forms have the `validate` class and necessary HTML5 validation attributes on their input fields.

## Usage

Once activated, the plugin works automatically. It identifies MailChimp forms (forms with an action URL containing `list-manage.com` and the class `validate`) and applies the custom validation logic.

Ensure your MailChimp form HTML includes:
*   The `validate` class on the `<form>` tag.
*   Standard HTML5 validation attributes (e.g., `required`, `type="email"`) on your form fields (`<input>`, `<select>`, `<textarea>`).
*   The standard MailChimp response divs: `<div id="mce-error-response" class="response" style="display:none"></div>` and `<div id="mce-success-response" class="response" style="display:none"></div>`.

The custom script handles validation on field blur and form submission.

## Frequently Asked Questions

**Does this work with all MailChimp forms?**

It works with standard embedded MailChimp forms that use the `list-manage.com` endpoint and have the `validate` class applied to the form element.

**Do I need the original MailChimp script anymore?**

No, this plugin replaces it.

**How does it improve performance?**

It uses a potentially smaller JavaScript file compared to the original `mc-validate.js` which loaded jQuery and several jQuery plug-in, and employs modern loading strategies (`defer` for JS, asynchronous loading for CSS) to avoid render-blocking.

## Changelog

### 1.0.0
*   Initial release.

## Credits

*   Validation script adapted from work by Mike Crantea: [CodePen](https://codepen.io/mehigh/pen/QwWoYpm)
*   Inspired by CSS-Tricks article: [Form Validation Part 4](https://css-tricks.com/form-validation-part-4-validating-mailChimp-subscribe-form/)
