
var validateForm = function(form) {
	var self = this;
	var container;
	var $container;

	if (form instanceof $) {
		container = form[0];
		$container = form;
		if (!container) {
			console.error('form validation: Empty jQuery object');
			return;
		}
	} else if (form instanceof HTMLElement) {
		container = form;
		$container = $(form);
	} else {
		console.error('form validation: Argument is not a container. Must be called with HTMLElement or jQuery object');
		return;
	}

	var $fields = $container.find('[required]');

	if (!$fields[0]) {
		console.error('form validation: no required fields found');
		return;
	}

	if ('noValidate' in container) {
		if (!container.noValidate) {
			console.error('form validation: the form has no noValidate attribute');
		}
	} else {
		var $form = $container.find('form');

		if ($form.length > 1) {
			console.error('form validation: more than one form found');
			return;
		} else {
			if (!$form[0].noValidate) {
				console.error('form validation: the form has no noValidate attribute');
			}
		}
	}

	$container.removeClass('invalid invalid-check invalid-select invalid-text invalid-email invalid-phone');

	$fields
		.off('.checkValidity')
		.on('input.checkValidity change.checkValidity', function() {
			$(this).removeClass('invalid invalid-check invalid-select invalid-text invalid-email invalid-phone');
		});

	var valid = true;
	var firstFocused = false;
	var emailRegexp = new RegExp(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]+$/);
	window.errorMessages = [];

	var markInvalid = function(className) {
		var $input = $(this);

		$input.addClass('invalid invalid-' + className);
		var message = this.getAttribute('data-validation-message');

		if (!~errorMessages.indexOf(message)) {
			errorMessages.push(message);
		}
		$container.addClass('invalid invalid-' + className);

		valid = false;
		if (!firstFocused) {
			$input.focus();
			firstFocused = true;
		}
	};

	$fields
		.filter('.invalid').removeClass('invalid').end()
		.each(function() {
			var type = this.type;
			if (type === 'checkbox' && !this.checked) {
				markInvalid.call(this, 'check');
				return;
			}

			if (type === 'radio' && !this.checked) {
				if (
					!$container.find(':radio[name="' + this.name + '"]').map(function() {
						return this.checked || null;
					}).length
				) {
					markInvalid.call(this, 'radio');
				}
				return;
			}

			if ((type === 'select-one' || type === 'select-multiple') && !~this.selectedIndex) {
				markInvalid.call(this, 'select');
				return;
			}

			if (!$.trim(this.value)) {
				markInvalid.call(this, 'text');
				return; // !!!
			}

			if (this.type === 'email' && !this.value.match(emailRegexp)) {
				markInvalid.call(this, 'email');
			}

			if (this.type === 'tel' && !this.value.match(new RegExp(this.getAttribute('data-regexp')))) {
				markInvalid.call(this, 'tel');
			}
		});

	return valid;
};

$('.validate')
	.each(function() {
		var $this = $(this);

		if ('noValidate' in this) {
			this.noValidate = true;
		}

		$this.find('[required]').on('input', function() {
			$(this).removeClass('invalid');
		});
	})
	.submit(function(e) {
		e.preventDefault();
		if (checkValidity.call(this)) {
			submitForm.call(this, this.id);
		} else {

		}
	});

var $messagesContainer = $('.o-messages');
var $messages = $('.om-body-text');
var $formContainer = $('.o-form');

$('.om-hide').click(function() {
	$messagesContainer.removeClass('visible');
});

$('.of-back').click(function() {
	$formContainer.removeClass('form-sent');
});

$('form')
	.each(function() {
		if ('noValidate' in this) {
			this.noValidate = true;
		}
	})
	.submit(function(e) {
		if (validateForm(this)) {
			$.ajax({
				dataType: 'json',
				data: $(this).serialize(),
				type: this.method || 'post',
				url: this.action || '/',
				success: function(data) {
					$formContainer.addClass('form-sent');
				},
				error: function(err) {

				},
				complete: function() {

				}
			});
		} else {
			$messagesContainer.addClass('visible');
			$messages
				.empty()
				.append(
					window.errorMessages.map(function(el) {
						return '<p>' + el + '</p>';
					})
				);
		}
		e.preventDefault();
	});



var initInputs = function() {

	var $inputs = $('input');

	var checkInput = function() {
		if ($.trim(this.value).length > 0) {
			$(this).removeClass('empty').addClass('filled');
		} else {
			$(this).removeClass('filled').addClass('empty');
		}
	};

	$inputs
		.each(function() {
			checkInput.call(this);
		})
		.on('input', function() {
			checkInput.call(this);
		});
};

initInputs();