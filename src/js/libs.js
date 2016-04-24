$(function() {

    if (!String.prototype.trim) {
		(function() {
			// Make sure we trim BOM and NBSP
			var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
			String.prototype.trim = function() {
				return this.replace(rtrim, '');
			};
		})();
	}

	[].slice.call(document.querySelectorAll('.form-label input, .form-label textarea')).forEach(function(inputEl) {
		// in case the input is already filled..
		if(inputEl.value.trim() !== '') {
			classie.add(inputEl.parentNode, 'focused');
		}
		// events:
		inputEl.addEventListener('focus', onInputFocus);
		inputEl.addEventListener('blur', onInputBlur);
	} );

	function onInputFocus(ev) {
		classie.add(ev.target.parentNode, 'focused');
	}

	function onInputBlur(ev) {
		if(ev.target.value.trim() === '') {
			classie.remove(ev.target.parentNode, 'focused');
		}
	}
});