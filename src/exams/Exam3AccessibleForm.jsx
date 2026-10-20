import { useRef, useState } from 'react';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate({ name, email, password }) {
  const errors = {};
  if (!name.trim()) errors.name = 'Name is required.';

  if (!email.trim()) errors.email = 'Email is required.';
  else if (!EMAIL_PATTERN.test(email.trim())) errors.email = 'Enter a valid email such as name@example.com.';

  if (!password) errors.password = 'Password is required (at least 8 characters).';
  else if (password.length < 8) errors.password = 'Password must be at least 8 characters.';

  return errors;
}

export default function Exam3AccessibleForm() {
  // Render-driven data -> state (it is displayed, so changing it must re-render)
  const [values, setValues] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submission, setSubmission] = useState(null);
  const [clicks, setClicks] = useState(0);

  // DOM handles -> refs (attached through the ref attribute)
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  // Value that must survive renders but is never displayed directly -> ref.
  // Changing it does not schedule a render.
  const previousEmailRef = useRef(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const found = validate(values);
    setErrors(found);

    // Focus order: name, then email, then password. Refs are read in an
    // event handler, never during rendering.
    const order = [
      ['name', nameRef],
      ['email', emailRef],
      ['password', passwordRef],
    ];
    const firstInvalid = order.find(([field]) => found[field]);
    if (firstInvalid) {
      firstInvalid[1].current.focus();
      return;
    }

    const email = values.email.trim();
    const previousEmail = previousEmailRef.current; // read in handler
    previousEmailRef.current = email; // no re-render caused by this write

    // The value shown on screen is copied into state, so rendering never
    // reads ref.current.
    setSubmission({ name: values.name.trim(), email, previousEmail });
    setValues({ name: '', email: '', password: '' });
    nameRef.current.focus();
  };

  return (
    <section aria-labelledby="exam3-title">
      <h2 id="exam3-title">Accessible Form Toolkit</h2>

      <form onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            ref={nameRef}
            value={values.name}
            onChange={handleChange}
            aria-invalid={errors.name ? 'true' : 'false'}
            aria-describedby={errors.name ? 'name-error' : undefined}
            autoComplete="name"
          />
          {errors.name && (
            <p id="name-error" className="error" role="alert">
              {errors.name}
            </p>
          )}
        </div>

        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            ref={emailRef}
            value={values.email}
            onChange={handleChange}
            aria-invalid={errors.email ? 'true' : 'false'}
            aria-describedby={errors.email ? 'email-error' : undefined}
            autoComplete="email"
          />
          {errors.email && (
            <p id="email-error" className="error" role="alert">
              {errors.email}
            </p>
          )}
        </div>

        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            ref={passwordRef}
            value={values.password}
            onChange={handleChange}
            aria-invalid={errors.password ? 'true' : 'false'}
            aria-describedby={errors.password ? 'password-error' : undefined}
            autoComplete="new-password"
          />
          {errors.password && (
            <p id="password-error" className="error" role="alert">
              {errors.password}
            </p>
          )}
        </div>

        <button className="btn" type="submit">
          Register
        </button>
      </form>

      {submission && (
        <div className="card" role="status">
          <p>
            Registered <strong>{submission.name}</strong> ({submission.email}).
          </p>
          <p className="muted">
            Previous submitted email: {submission.previousEmail ?? 'none (this is the first submission)'}
          </p>
        </div>
      )}

      <details>
        <summary>Debugging case: clicks.current never updates the screen</summary>
        <p>
          The starter code rendered <code>clicks.current</code>. Writing to a ref changes a plain
          mutable object; React is not told anything changed, so it schedules <strong>no render</strong>{' '}
          and the screen keeps the old text. Anything the user can see must live in state. Fixed
          version:
        </p>
        <div className="row">
          <button className="btn secondary" type="button" onClick={() => setClicks((c) => c + 1)}>
            Click me
          </button>
          <span>Clicks (state): {clicks}</span>
        </div>
      </details>
    </section>
  );
}
