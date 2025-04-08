// Source: https://codepen.io/mehigh/pen/QwWoYpm
// Inspired by: https://css-tricks.com/form-validation-part-4-validating-mailChimp-subscribe-form/ 

// Add the novalidate attribute when the JS loads
var mailChimpForms = document.querySelectorAll( 'form[id^="mc-embedded"].validate' );
for ( var i = 0; i < mailChimpForms.length; i++ ) {
	mailChimpForms[i].setAttribute( 'novalidate', true );
}

// Validate the field
var hasError = function ( field ) {

	// Don't validate submits, buttons, file and reset inputs, and disabled fields
	if ( field.disabled || field.type === 'file' || field.type === 'reset' || field.type === 'submit' || field.type === 'button' ) return;

	// Get validity
	var validity = field.validity;

	// If valid, return null
	if ( validity.valid ) return;

	// If field is required and empty
	if ( validity.valueMissing ) return 'Please fill out this field.';

	// If not the right type
	if ( validity.typeMismatch ) {

		// Email
		if ( field.type === 'email' ) return 'Please enter an email address.';

		// URL
		if ( field.type === 'url' ) return 'Please enter a URL.';

	}

	// If too short
	if ( validity.tooShort ) return 'Please lengthen this text to ' + field.getAttribute( 'minLength' ) + ' characters or more. You are currently using ' + field.value.length + ' characters.';

	// If too long
	if ( validity.tooLong ) return 'Please shorten this text to no more than ' + field.getAttribute( 'maxLength' ) + ' characters. You are currently using ' + field.value.length + ' characters.';

	// If pattern doesn't match
	if ( validity.patternMismatch ) {

		// If pattern info is included, return custom error
		if ( field.hasAttribute( 'title' ) ) return field.getAttribute( 'title' );

		// Otherwise, generic error
		return 'Please match the requested format.';

	}

	// If number input isn't a number
	if ( validity.badInput ) return 'Please enter a number.';

	// If a number value doesn't match the step interval
	if ( validity.stepMismatch ) return 'Please select a valid value.';

	// If a number field is over the max
	if ( validity.rangeOverflow ) return 'Please select a value that is no more than ' + field.getAttribute( 'max' ) + '.';

	// If a number field is below the min
	if ( validity.rangeUnderflow ) return 'Please select a value that is no less than ' + field.getAttribute( 'min' ) + '.';

	// If all else fails, return a generic catchall error
	return 'The value you entered for this field is invalid.';

};


// Show an error message
var showError = function ( field, error ) {

	// Add error class to field
	field.classList.add( 'error' );

	// If the field is a radio button and part of a group, error all and get the last item in the group
	if ( field.type === 'radio' && field.name ) {
		var group = field.form.querySelectorAll( '[name="' + field.name + '"]' );
		if ( group.length > 0 ) {
			for ( var i = 0; i < group.length; i++ ) {
				group[i].classList.add( 'error' );
			}
			field = group[group.length - 1];
		}
	}

	// Get field id or name
	var id = field.id || field.name;
	if ( ! id ) return;

	// Check if error message field already exists
	// If not, create one
	var message = field.form.querySelector( '.mce_inline_error#error-for-' + id );
	if ( ! message ) {
		message = document.createElement( 'div' );
		message.className = 'mce_inline_error';
		message.id = 'error-for-' + id;

		// If the field is a radio button or checkbox, insert error after the label
		var label;
		if ( field.type === 'radio' || field.type === 'checkbox' ) {
			label = field.form.querySelector( 'label[for="' + id + '"]' ) || field.parentNode;
			if ( label ) {
				label.parentNode.insertBefore( message, label.nextSibling );
			}
		}

		// Otherwise, insert it after the field
		if ( ! label ) {
			field.parentNode.insertBefore( message, field.nextSibling );
		}

	}

	// Add ARIA role to the field
	field.setAttribute( 'aria-describedby', 'error-for-' + id );

	// Update error message
	message.textContent = error;

	// Show error message
	message.style.display = 'block';
	message.style.visibility = 'visible';

};


// Remove the error message
var removeError = function ( field ) {

	// Remove error class to field
	field.classList.remove( 'error' );

	// Remove ARIA role from the field
	field.removeAttribute( 'aria-describedby' );

	// If the field is a radio button and part of a group, remove error from all and get the last item in the group
	if ( field.type === 'radio' && field.name ) {
		var group = field.form.querySelectorAll( '[name="' + field.name + '"]' );
		if ( group.length > 0 ) {
			for ( var i = 0; i < group.length; i++ ) {
				group[i].classList.remove( 'error' );
			}
			field = group[group.length - 1];
		}
	}

	// Get field id or name
	var id = field.id || field.name;
	if ( ! id ) return;


	// Check if an error message is in the DOM
	var message = field.form.querySelector( '.mce_inline_error#error-for-' + id + '' );
	if ( ! message ) return;

	// If so, hide it
	message.textContent = '';
	message.style.display = 'none';
	message.style.visibility = 'hidden';

};

// Serialize the form data into a query string
// Forked and modified from https://stackoverflow.com/a/30153391/1293256
var serialize = function ( form ) {

	// Setup our serialized data
	var serialized = '';

	// Loop through each field in the form
	for ( i = 0; i < form.elements.length; i++ ) {

		var field = form.elements[i];

		// Don't serialize fields without a name, submits, buttons, file and reset inputs, and disabled fields
		if ( ! field.name || field.disabled || field.type === 'file' || field.type === 'reset' || field.type === 'submit' || field.type === 'button' ) continue;

		// Convert field data to a query string
		if ( ( field.type !== 'checkbox' && field.type !== 'radio' ) || field.checked ) {
			serialized += '&' + encodeURIComponent( field.name ) + "=" + encodeURIComponent( field.value );
		}
	}

	return serialized;

};

// Display the form status
window.displayMailChimpStatus = function ( data ) {

	// Make sure the data is in the right format and values are strings
	if ( ! data || typeof data !== 'object' ) return;
	if ( ! data.result || typeof data.result !== 'string' ) return;
	if ( ! data.msg || typeof data.msg !== 'string' ) return;

	// Get the response containers
	var errorContainer = document.getElementById( 'mce-error-response' );
	var successContainer = document.getElementById( 'mce-success-response' );

	// If containers don't exist, exit
	if ( ! errorContainer || ! successContainer ) return;

	// Handle redirect response ( usually for captcha )
	if ( data.result === 'redirect' && data.msg === 'captcha' ) {
		// Get form action URL base ( without the /post-json part )
		var formAction = document.querySelector( 'form[id^="mc-embedded"].validate' ).getAttribute( 'action' );
		if ( ! formAction ) return;

		// Build the submission URL with all parameters
		var redirectUrl = formAction;

		// Add all params from the response
		if ( data.params && typeof data.params === 'object' ) {
			try {
				var params = Object.entries( data.params )
					.filter( function( param ) {
						// Validate param key and value are strings
						return typeof param[0] === 'string' && typeof param[1] === 'string';
					} )
					.map( function ( param ) {
						return encodeURIComponent( param[0] ) + '=' + encodeURIComponent( param[1] );
					} ).join( '&' );

				redirectUrl += params;
			} catch ( e ) {
				// If we can't process params safely, don't redirect
				console.error( 'Error processing redirect parameters:', e );
				return;
			}
		}

		// Add timestamp parameter
		redirectUrl += '&_=' + Date.now();

		// Validate the URL before opening
		try {
			// Open in new tab/window
			window.open( redirectUrl, '_blank' );
		} catch ( e ) {
			console.error( 'Invalid redirect URL:', e );
		}
		return;
	}

	// If error, show error message and hide success
	if ( data.result === 'error' ) {
		// Clean up the error message and apply strict sanitization
		var cleanErrorMsg = data.msg
			.replace( /^\d+\s*-\s*/, '' ) // Remove ID and dash prefix
			.trim()
			.substring( 0, 1000 ); // Limit length for safety
		
		// Empty any previous content
		errorContainer.textContent = '';
		// Set new content
		errorContainer.textContent = cleanErrorMsg;
		errorContainer.style.display = 'block';
		successContainer.style.display = 'none';
		return;
	}

	// Otherwise, show success message and hide error
	var successMsg = data.msg.trim().substring( 0, 1000 ); // Limit length
	
	// Empty any previous content
	successContainer.textContent = '';
	// Set new content
	successContainer.textContent = successMsg;
	successContainer.style.display = 'block';
	errorContainer.style.display = 'none';
};

// Submit the form
var submitMailChimpForm = function ( form ) {

	// Get the Submit URL
	var url = form.getAttribute( 'action' );
	url = url.replace( '/post?u=', '/post-json?u=' );
	url += serialize( form ) + '&c=displayMailChimpStatus';

	// Yield to the main thread before continuing with form submission
	setTimeout( function() {
		// Creates the script with the callback URL.
		// MailChimp does not currently offer a CORS-enabled endpoint, so we continue
		// to use the script tag like the official MailChimp script.
		var ref = window.document.getElementsByTagName( 'script' )[0];
		var script = window.document.createElement( 'script' );
		script.src = url;

		// We no longer need to store mcStatus as a global variable
		// as we're using the specific response containers by ID

		// Insert script tag into the DOM ( append to <head> )
		ref.parentNode.insertBefore( script, ref );

		// After the script is loaded ( and executed ), remove it
		script.onload = function () {
			this.remove();
		};
	}, 0 );

};

// Initialize the form validation and submit handlers.
mailChimpForms.forEach( function( mailChimpForm ) {
	// Submit handler.
	mailChimpForm.addEventListener( 'submit', function ( event ) {

		// Only run on mailChimpForms flagged for validation AND targeting MailChimp
		if ( ! event.target.classList.contains( 'validate' ) ) return;
		
		// Get the action attribute
		var actionUrl = event.target.getAttribute( 'action' );
		
		// Validate the form targets MailChimp
		if ( ! actionUrl ) return;
		
		// Prevent form from submitting
		event.preventDefault();

		// Get all of the form elements
		var fields = event.target.elements;

		// Validate each field
		// Store the first field with an error to a variable so we can bring it into focus later
		var error, hasErrors;
		for ( var i = 0; i < fields.length; i++ ) {
			error = hasError( fields[i] );
			if ( error ) {
				showError( fields[i], error );
				if ( ! hasErrors ) {
					hasErrors = fields[i];
				}
			}
		}

		// If there are errrors, don't submit form and focus on first element with error
		if ( hasErrors ) {
			hasErrors.focus();
		}

		// Otherwise, let the form submit normally
		// You could also bolt in an Ajax form submit process here
		submitMailChimpForm( event.target );

	}, false );

    // Get all input, select, and textarea elements in the form
    var fields = mailChimpForm.querySelectorAll( 'input, select, textarea' );
    
    // Add blur event listener to each field
    fields.forEach( function( field ) {
        field.addEventListener( 'blur', function( event ) {
            // Validate the field
            var error = hasError( event.target );
            
            // If there's an error, show it
            if ( error ) {
                showError( event.target, error );
                return;
            }
            
            // Otherwise, remove any existing error message
            removeError( event.target );
        } );
    } );
} );
