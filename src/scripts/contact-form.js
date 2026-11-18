// Contact form: validation, subject prefill and sending.
//
// Prefill: any link with data-subject (e.g. "Book a consultation") that points at
// #contact fills the Subject field and puts the cursor in Name. A ?subject= query
// on the page does the same (service pages link to contact/?subject=Payroll).
//
// Sending: if site.formEndpoint is set (a Formspree-style endpoint that accepts
// JSON), the message is posted there. Until then, Send opens the visitor's email
// app with the message filled in, so the form still works.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function init(form) {
  const card = form.parentElement;
  const sent = card.querySelector('[data-form-sent]');
  const sentTitle = card.querySelector('[data-form-sent-title]');
  const sentBody = card.querySelector('[data-form-sent-body]');
  const resetBtn = card.querySelector('[data-form-reset]');
  const status = form.querySelector('.contact-form__status');
  const submitBtn = form.querySelector('button[type="submit"]');
  const fields = {
    name: form.elements.namedItem('name'),
    email: form.elements.namedItem('email'),
    subject: form.elements.namedItem('subject'),
    message: form.elements.namedItem('message'),
  };
  const endpoint = form.dataset.endpoint;
  const to = form.dataset.email;
  const defaultSentBody = sentBody.textContent;

  function setError(input, message) {
    const error = document.getElementById(`${input.id}-error`);
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
    if (!error) return;
    error.hidden = !message;
    error.querySelector('span').textContent = message || '';
  }

  function validate() {
    const name = fields.name.value.trim();
    const email = fields.email.value.trim();
    const nameError = name ? '' : 'Enter your name';
    const emailError = !email
      ? 'Enter your email address'
      : EMAIL_RE.test(email)
        ? ''
        : 'Enter an email address like name@example.com';
    setError(fields.name, nameError);
    setError(fields.email, emailError);
    if (nameError) fields.name.focus();
    else if (emailError) fields.email.focus();
    return !nameError && !emailError;
  }

  // Clear a field's error as soon as it's corrected
  for (const input of [fields.name, fields.email]) {
    input.addEventListener('input', () => {
      if (input.getAttribute('aria-invalid') === 'true') setError(input, '');
    });
  }

  function showSent() {
    const first = fields.name.value.trim().split(/\s+/)[0];
    sentTitle.textContent = first ? `Thanks, ${first}` : 'Thanks';
    sentBody.textContent = defaultSentBody;
    // Clear what was sent so reopening the form can't resend it
    form.reset();
    form.hidden = true;
    sent.hidden = false;
    sent.focus();
  }

  function showStatus(message, tone = 'error') {
    status.textContent = message;
    status.hidden = !message;
    status.classList.toggle('contact-form__status--info', tone === 'info');
  }

  function prefill(subject, { focus = true } = {}) {
    form.hidden = false;
    sent.hidden = true;
    if (subject) fields.subject.value = subject;
    // Wait for the smooth scroll to land before moving focus
    if (focus) setTimeout(() => fields.name.focus({ preventScroll: true }), 500);
  }

  resetBtn.addEventListener('click', () => {
    form.reset();
    setError(fields.name, '');
    setError(fields.email, '');
    showStatus('');
    sent.hidden = true;
    form.hidden = false;
    fields.name.focus();
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    showStatus('');
    if (!validate()) return;
    // Spam trap filled: act as if sent, but send nothing. If a browser's autofill
    // ever fills it for a real person, they still see a response, not a dead button.
    if (form.elements.namedItem('_gotcha').value) {
      showSent();
      return;
    }

    const data = {
      name: fields.name.value.trim(),
      email: fields.email.value.trim(),
      subject: fields.subject.value.trim() || 'Website enquiry',
      message: fields.message.value.trim(),
    };

    if (!endpoint) {
      const body = `${data.message}\n\n${data.name}\n${data.email}`;
      window.location.href = `mailto:${to}?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(body)}`;
      // We can't tell whether an email app opened, so keep the message on screen
      // and say how to reach us if it didn't
      showStatus(`Your email app should open with your message ready to send. If it doesn't, email ${to} or call us.`, 'info');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.setAttribute('aria-busy', 'true');
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...data, _replyto: data.email, _subject: `Website: ${data.subject}` }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      showSent();
    } catch {
      showStatus(`Your message didn't send. Try again, or email ${to}.`);
    } finally {
      submitBtn.disabled = false;
      submitBtn.removeAttribute('aria-busy');
    }
  });

  // Links like "Book a consultation" carry the subject they want
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[data-subject]');
    if (link) prefill(link.dataset.subject);
  });

  // contact/?subject=Payroll from a service page
  const fromQuery = new URLSearchParams(window.location.search).get('subject');
  if (fromQuery) prefill(fromQuery.slice(0, 120), { focus: false });
}

document.querySelectorAll('[data-contact-form]').forEach(init);
