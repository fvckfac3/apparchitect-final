/**
 * Copy Registry
 * 
 * Based on Content & Copy PRD §3-9
 * All user-facing strings referenced by key
 */

export interface CopyEntry {
	key: string;
	text: string;
	context?: string;
}

export const COPY_REGISTRY: Record<string, CopyEntry> = {
	// Navigation
	'nav.dashboard': {
		key: 'nav.dashboard',
		text: 'Dashboard',
		context: 'Main navigation',
	},
	'nav.new_project': {
		key: 'nav.new_project',
		text: 'New project',
		context: 'Navigation item',
	},
	'nav.interview': {
		key: 'nav.interview',
		text: 'Interview',
		context: 'Navigation item',
	},
	'nav.suite': {
		key: 'nav.suite',
		text: 'Suite',
		context: 'Navigation item',
	},
	'nav.settings': {
		key: 'nav.settings',
		text: 'Settings',
		context: 'Navigation item',
	},
	'nav.logout': {
		key: 'nav.logout',
		text: 'Log out',
		context: 'Navigation item',
	},

	// Global Actions
	'global.actions.save': {
		key: 'global.actions.save',
		text: 'Save',
		context: 'Form submission',
	},
	'global.actions.cancel': {
		key: 'global.actions.cancel',
		text: 'Cancel',
		context: 'Dismissal',
	},
	'global.actions.confirm': {
		key: 'global.actions.confirm',
		text: 'Confirm',
		context: 'Confirmation dialogs',
	},
	'global.actions.delete': {
		key: 'global.actions.delete',
		text: 'Delete',
		context: 'Destructive actions',
	},
	'global.actions.back': {
		key: 'global.actions.back',
		text: 'Back',
		context: 'Navigation',
	},
	'global.actions.continue': {
		key: 'global.actions.continue',
		text: 'Continue',
		context: 'Multi-step flows',
	},
	'global.actions.submit': {
		key: 'global.actions.submit',
		text: 'Submit',
		context: 'Form submission',
	},
	'global.actions.retry': {
		key: 'global.actions.retry',
		text: 'Retry',
		context: 'Error recovery',
	},
	'global.actions.download': {
		key: 'global.actions.download',
		text: 'Download',
		context: 'File download',
	},

	// Global States
	'global.state.loading': {
		key: 'global.state.loading',
		text: 'Loading…',
		context: 'Any loading state',
	},
	'global.state.empty': {
		key: 'global.state.empty',
		text: 'Nothing here yet.',
		context: 'Empty data states',
	},
	'global.state.error_generic': {
		key: 'global.state.error_generic',
		text: 'Something went wrong. Please try again.',
		context: 'Unspecified errors',
	},
	'global.state.success_generic': {
		key: 'global.state.success_generic',
		text: 'Done.',
		context: 'Generic success',
	},

	// Landing Page
	'landing.headline': {
		key: 'landing.headline',
		text: 'Specify your product. Build with a team that knows what to do.',
		context: 'Hero headline',
	},
	'landing.subhead': {
		key: 'landing.subhead',
		text: 'AppArchitect turns a 30-minute interview into a complete PRD suite, the right agent team, and a build guide an AI coding agent can execute without questions.',
		context: 'Hero subheadline',
	},
	'landing.cta': {
		key: 'landing.cta',
		text: 'Get started',
		context: 'Primary CTA',
	},
	'landing.cta_secondary': {
		key: 'landing.cta_secondary',
		text: 'See an example suite',
		context: 'Secondary CTA',
	},
	'landing.trust_line': {
		key: 'landing.trust_line',
		text: 'No credit card required. Generate your first suite free.',
		context: 'Trust builder',
	},

	// Auth
	'auth.login.page_title': {
		key: 'auth.login.page_title',
		text: 'Log in to AppArchitect',
		context: 'Login page',
	},
	'auth.login.email_label': {
		key: 'auth.login.email_label',
		text: 'Email address',
		context: 'Login form',
	},
	'auth.login.password_label': {
		key: 'auth.login.password_label',
		text: 'Password',
		context: 'Login form',
	},
	'auth.login.submit_button': {
		key: 'auth.login.submit_button',
		text: 'Log in',
		context: 'Login form',
	},
	'auth.login.forgot_password': {
		key: 'auth.login.forgot_password',
		text: 'Forgot your password?',
		context: 'Login form',
	},
	'auth.login.signup_prompt': {
		key: 'auth.login.signup_prompt',
		text: "Don't have an account? Sign up",
		context: 'Login form',
	},
	'auth.signup.page_title': {
		key: 'auth.signup.page_title',
		text: 'Create your account',
		context: 'Signup page',
	},
	'auth.signup.submit_button': {
		key: 'auth.signup.submit_button',
		text: 'Create account',
		context: 'Signup form',
	},
	'auth.signup.consent': {
		key: 'auth.signup.consent',
		text: 'By creating an account, you agree to our Terms of Service and Privacy Policy.',
		context: 'Signup form',
	},

	// Auth Errors
	'auth.error.invalid_credentials': {
		key: 'auth.error.invalid_credentials',
		text: 'Incorrect email or password. Please try again.',
		context: 'Login error',
	},
	'auth.error.email_exists': {
		key: 'auth.error.email_exists',
		text: 'An account with this email already exists. Log in instead?',
		context: 'Signup error',
	},
	'auth.error.network': {
		key: 'auth.error.network',
		text: "We couldn't connect. Check your connection and try again.",
		context: 'Network error',
	},
	'auth.error.session_expired': {
		key: 'auth.error.session_expired',
		text: 'Your session expired. Please log in again.',
		context: 'Session error',
	},

	// Onboarding
	'onboarding.step1.headline': {
		key: 'onboarding.step1.headline',
		text: 'Welcome to AppArchitect',
		context: 'Onboarding step 1',
	},
	'onboarding.step1.body': {
		key: 'onboarding.step1.body',
		text: 'AppArchitect helps you turn a rough product idea into a complete PRD suite — the documents an AI coding team can build from directly.',
		context: 'Onboarding step 1',
	},
	'onboarding.step1.cta': {
		key: 'onboarding.step1.cta',
		text: 'Continue',
		context: 'Onboarding step 1',
	},
	'onboarding.step2.headline': {
		key: 'onboarding.step2.headline',
		text: 'What to expect',
		context: 'Onboarding step 2',
	},
	'onboarding.step2.body': {
		key: 'onboarding.step2.body',
		text: "The interview takes 20-40 minutes. Answer as much or as little as you can — we'll suggest defaults for anything you skip. You can revise any answer later.",
		context: 'Onboarding step 2',
	},
	'onboarding.step3.headline': {
		key: 'onboarding.step3.headline',
		text: 'Ready when you are',
		context: 'Onboarding step 3',
	},
	'onboarding.step3.body': {
		key: 'onboarding.step3.body',
		text: "We'll start with the product itself: what it does, who it's for, and what makes it different. Then we'll go deeper.",
		context: 'Onboarding step 3',
	},
	'onboarding.step3.cta': {
		key: 'onboarding.step3.cta',
		text: 'Start the interview',
		context: 'Onboarding step 3',
	},

	// Interview
	'interview.page_title': {
		key: 'interview.page_title',
		text: 'Interview',
		context: 'Page heading',
	},
	'interview.progress.label': {
		key: 'interview.progress.label',
		text: 'Question {current} of {total}',
		context: 'Progress label',
	},
	'interview.input.placeholder': {
		key: 'interview.input.placeholder',
		text: 'Type your answer…',
		context: 'Input placeholder',
	},
	'interview.input.submit': {
		key: 'interview.input.submit',
		text: 'Submit',
		context: 'Submit button',
	},
	'interview.input.skip': {
		key: 'interview.input.skip',
		text: 'Skip — use default',
		context: 'Skip button',
	},
	'interview.summary.title': {
		key: 'interview.summary.title',
		text: "What I've captured",
		context: 'Summary panel title',
	},
	'interview.complete.headline': {
		key: 'interview.complete.headline',
		text: 'Interview complete',
		context: 'Completion state',
	},
	'interview.complete.body': {
		key: 'interview.complete.body',
		text: 'Ready to generate your PRD suite. This usually takes 1-3 minutes.',
		context: 'Completion body',
	},
	'interview.complete.cta': {
		key: 'interview.complete.cta',
		text: 'Generate suite',
		context: 'Completion CTA',
	},

	// Suite Generation
	'suite.generating.title': {
		key: 'suite.generating.title',
		text: 'Generating your suite',
		context: 'Generating state',
	},
	'suite.generating.body': {
		key: 'suite.generating.body',
		text: "This usually takes 1-3 minutes. You can close this tab — we'll email you when it's ready.",
		context: 'Generating body',
	},
	'suite.complete.title': {
		key: 'suite.complete.title',
		text: 'Your suite is ready',
		context: 'Completion state',
	},
	'suite.complete.cta': {
		key: 'suite.complete.cta',
		text: 'Download as ZIP',
		context: 'Download action',
	},
	'suite.failed.title': {
		key: 'suite.failed.title',
		text: 'Generation failed',
		context: 'Error state',
	},
	'suite.failed.body': {
		key: 'suite.failed.body',
		text: 'Something went wrong while generating your suite. Please retry, or contact support if the problem persists.',
		context: 'Error body',
	},
	'suite.failed.cta': {
		key: 'suite.failed.cta',
		text: 'Retry generation',
		context: 'Retry action',
	},

	// Errors
	'errors.unauthorized': {
		key: 'errors.unauthorized',
		text: 'Please log in to continue.',
		context: 'Auth error',
	},
	'errors.forbidden': {
		key: 'errors.forbidden',
		text: "You don't have permission to do that.",
		context: 'Permission error',
	},
	'errors.not_found': {
		key: 'errors.not_found',
		text: "We couldn't find what you were looking for.",
		context: 'Not found error',
	},
	'errors.server': {
		key: 'errors.server',
		text: 'Something went wrong on our end. Please try again.',
		context: 'Server error',
	},
	'errors.rate_limited': {
		key: 'errors.rate_limited',
		text: "You're going a bit fast. Please slow down and try again.",
		context: 'Rate limit error',
	},
};

// Helper to get copy by key
export function getCopy(key: string): string {
	return COPY_REGISTRY[key]?.text || key;
}

// Helper to get copy with substitutions
export function getCopyWithVars(key: string, vars: Record<string, string | number>): string {
	let text = getCopy(key);
	for (const [varName, value] of Object.entries(vars)) {
		text = text.replace(`{${varName}}`, String(value));
	}
	return text;
}
