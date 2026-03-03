(function () {
  // Contact Form 7 is WordPress-only; on a static site we intercept and open a mailto.
  function encode(v) {
    return encodeURIComponent((v || '').toString().trim());
  }

  document.addEventListener('submit', function (e) {
    var form = e.target;
    if (!form || !form.classList || !form.classList.contains('wpcf7-form')) return;

    e.preventDefault();

    var data = new FormData(form);
    // Try common CF7 field names used on the site
    var name = data.get('your-name') || data.get('name') || '';
    var email = data.get('your-email') || data.get('email') || '';
    var subject = data.get('your-subject') || data.get('subject') || 'Website enquiry';
    var message = data.get('your-message') || data.get('message') || '';

    var body =
      'Name: ' + name + '\n' +
      'Email: ' + email + '\n\n' +
      message;

    // Update this email if you want enquiries to go elsewhere
    var to = 'info@nakisuites.com';

    var mailto =
      'mailto:' + encode(to) +
      '?subject=' + encode(subject) +
      '&body=' + encode(body);

    window.location.href = mailto;
  }, true);
})();
