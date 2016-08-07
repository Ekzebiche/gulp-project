$(function() {

	if (!String.prototype.trim) {
		(function() {
			var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
			String.prototype.trim = function() {
				return this.replace(rtrim, '');
			};
		})();
	}

	[].slice.call(document.querySelectorAll('label input, label textarea')).forEach(function(inputEl) {
		if(inputEl.value.trim() !== '') {
			classie.add(inputEl.parentNode, 'focused');
		}

		inputEl.addEventListener('focus', onInputFocus);
		inputEl.addEventListener('blur', onInputBlur);
	});

	function onInputFocus(ev) {
		classie.add(ev.target.parentNode, 'focused');
	}

	function onInputBlur(ev) {
		if(ev.target.value.trim() === '') {
			classie.remove(ev.target.parentNode, 'focused');
		}
	}
});