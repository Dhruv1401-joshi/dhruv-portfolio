/**
 * Contact Form Controller — Web3Forms Integration
 * Framework: Vite (plain HTML/CSS/JS)
 * Access key loaded from: import.meta.env.VITE_WEB3FORMS_ACCESS_KEY
 */

class ContactForm {
  constructor() {
    this.form         = document.getElementById('contact-form');
    this.feedback     = document.getElementById('form-feedback');
    this.submitBtn    = document.getElementById('form-submit-btn');
    this.submitText   = document.getElementById('form-submit-text');
    this.submitIcon   = document.getElementById('form-submit-icon');
    this.isSubmitting = false;

    if (this.form) {
      this.init();
    }
  }

  init() {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });

    // Clear individual field error states on user input / change
    this.form.querySelectorAll('input, textarea, select').forEach(field => {
      field.addEventListener('input', () => {
        field.closest('.form-group')?.classList.remove('has-error');
      });
      field.addEventListener('change', () => {
        field.closest('.form-group')?.classList.remove('has-error');
      });
    });
  }

  // ── Sanitize (basic XSS guard) ────────────────────────────────────────────
  sanitize(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ── Validate ──────────────────────────────────────────────────────────────
  validate() {
    let isValid = true;

    const name    = this.form.querySelector('#contact-name');
    const email   = this.form.querySelector('#contact-email');
    const phone   = this.form.querySelector('#contact-phone');
    const subject = this.form.querySelector('#contact-type');
    const message = this.form.querySelector('#contact-message');

    // Full Name — required
    if (!name.value.trim()) {
      this.showError(name, 'Please enter your full name.');
      isValid = false;
    }

    // Email — required + format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim()) {
      this.showError(email, 'Please enter your email address.');
      isValid = false;
    } else if (!emailRegex.test(email.value.trim())) {
      this.showError(email, 'Please enter a valid email address.');
      isValid = false;
    }

    // Phone — optional but validated when provided
    if (phone && phone.value.trim()) {
      const phoneRegex = /^[\+]?[\d\s\-\(\)]{7,20}$/;
      if (!phoneRegex.test(phone.value.trim())) {
        this.showError(phone, 'Please enter a valid phone number (digits, spaces, +, -, () allowed).');
        isValid = false;
      }
    }

    // Subject / Service — required
    if (!subject.value) {
      this.showError(subject, 'Please select a subject or service.');
      isValid = false;
    }

    // Message — required
    if (!message.value.trim()) {
      this.showError(message, 'Please provide details about your project or inquiry.');
      isValid = false;
    }

    return isValid;
  }

  showError(inputElement, message) {
    const group = inputElement.closest('.form-group');
    if (group) {
      group.classList.add('has-error');
      const errSpan = group.querySelector('.form-error-msg');
      if (errSpan) errSpan.textContent = message;
    }
  }

  // ── UI State Helpers ──────────────────────────────────────────────────────
  setLoading(loading) {
    if (loading) {
      this.submitBtn.disabled = true;
      if (this.submitText) this.submitText.textContent = 'Sending...';
      if (this.submitIcon) this.submitIcon.style.display = 'none';
    } else {
      this.submitBtn.disabled = false;
      if (this.submitText) this.submitText.textContent = 'Send Message';
      if (this.submitIcon) this.submitIcon.style.display = '';
    }
  }

  showFeedback(type, html) {
    if (!this.feedback) return;
    this.feedback.classList.remove('success', 'error');
    this.feedback.innerHTML = html;
    this.feedback.classList.add(type);
    this.feedback.style.display = 'block';
    this.feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  hideFeedback() {
    if (!this.feedback) return;
    this.feedback.classList.remove('success', 'error');
    this.feedback.innerHTML = '';
    this.feedback.style.display = 'none';
  }

  // ── Submit Handler ────────────────────────────────────────────────────────
  async handleSubmit() {
    // Prevent duplicate submissions while processing
    if (this.isSubmitting) return;
    if (!this.validate()) return;

    // Read and sanitize values
    const name    = this.sanitize(this.form.querySelector('#contact-name').value.trim());
    const email   = this.form.querySelector('#contact-email').value.trim(); // raw for reply-to
    const phoneEl = this.form.querySelector('#contact-phone');
    const phone   = phoneEl ? this.sanitize(phoneEl.value.trim() || 'Not provided') : 'Not provided';
    const subject = this.sanitize(this.form.querySelector('#contact-type').value);
    const message = this.sanitize(this.form.querySelector('#contact-message').value.trim());

    // Access key via Vite env variable
    const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;

    if (!accessKey) {
      console.error('[ContactForm] VITE_WEB3FORMS_ACCESS_KEY is not set in .env');
      this.showFeedback('error',
        'Configuration error. Please contact me directly at ' +
        '<a href="mailto:dhruvjoshi1401@gmail.com" style="color:#fff;text-decoration:underline;">dhruvjoshi1401@gmail.com</a>.'
      );
      return;
    }

    this.isSubmitting = true;
    this.hideFeedback();
    this.setLoading(true);

    try {
      const payload = {
        access_key: accessKey,
        subject:    'New Portfolio Contact \u2014 Dhruv Joshi',
        from_name:  'Portfolio Contact Form',
        replyto:    email,
        name:       name,
        email:      email,
        phone:      phone,
        service:    subject,
        message:    message,
        botcheck:   '',   // honeypot — leave blank
      };

      const response = await fetch('https://api.web3forms.com/submit', {
        method:  'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept':       'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // ✅ Success
        this.showFeedback('success',
          '<strong>Thank you! Your message has been sent successfully.</strong><br>' +
          "I\u2019ll get back to you soon."
        );
        this.form.reset();
      } else {
        // ❌ API returned an error
        console.error('[ContactForm] Web3Forms API error:', data);
        this.showFeedback('error',
          'Something went wrong. Please try again or email me directly at ' +
          '<a href="mailto:dhruvjoshi1401@gmail.com" style="color:#fff;text-decoration:underline;">dhruvjoshi1401@gmail.com</a>.'
        );
      }
    } catch (err) {
      // ❌ Network / fetch error
      console.error('[ContactForm] Network error:', err);
      this.showFeedback('error',
        'Something went wrong. Please check your connection and try again.'
      );
    } finally {
      this.setLoading(false);
      this.isSubmitting = false;
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new ContactForm();
});

