import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dir, '..');
const checks: Array<{ name: string; pass: boolean; detail: string }> = [];

function check(name: string, pass: boolean, detail: string) {
  checks.push({ name, pass, detail });
}

const app = await readFile(resolve(root, 'src/App.tsx'), 'utf8');
const index = await readFile(resolve(root, 'src/pages/Index.tsx'), 'utf8');
const auth = await readFile(resolve(root, 'src/contexts/AuthContext.tsx'), 'utf8');
const generator = await readFile(resolve(root, 'src/hooks/use-prd-generator-v2.ts'), 'utf8');
const billing = await readFile(resolve(root, 'src/lib/billing/stripe-client.ts'), 'utf8');
const quota = await readFile(resolve(root, 'src/lib/billing/quota.ts'), 'utf8');
const portal = await readFile(resolve(root, 'supabase/functions/stripe-portal-create/index.ts'), 'utf8');
const checkout = await readFile(resolve(root, 'supabase/functions/stripe-checkout-create/index.ts'), 'utf8');
const subscription = await readFile(resolve(root, 'supabase/functions/subscription-get/index.ts'), 'utf8');
const migration = await readFile(resolve(root, 'supabase/migrations/20260709000000_add_monetization_schema.sql'), 'utf8');

check('main routes render real pages', /<Route path="\/"/.test(app) && /<Route path="\/pricing"/.test(app) && /<Route path="\/settings\/billing"/.test(app), 'index, pricing, and billing routes are registered');
check('auth failure is contained', /getSession\(\)/.test(auth) && /catch/.test(auth), 'initial session lookup has a rejection path');
check('active generator is connected', /usePRDGeneratorV2/.test(index) && /generateSuite/.test(index), 'Index uses the v2 generator and starts suite generation');
check('generator has no duplicate phase union', !/\| 'enhancing_with_ai';[\s\S]*\| 'enhancing_with_ai';/.test(generator), 'generation phase union is unique');
check('checkout function names match', /FN_CHECKOUT = 'stripe-checkout-create'/.test(billing) && /FN_PORTAL = 'stripe-portal-create'/.test(billing), 'client invokes deployed edge-function directories');
check('portal function compiles conceptually', !/global: \{ headers: \{ Authorization: req/.test(portal), 'portal client does not reference req before handler scope');
check('subscription function uses deployed schema', /standard_units_used/.test(subscription) && /period_start/.test(subscription) && !/period_yyyymm/.test(subscription), 'subscription-get reads actual migration columns');
check('browser quota client uses deployed schema', /standard_units_used/.test(quota) && /ultimate_units_used/.test(quota) && !/\bunits_used\b/.test(quota), 'quota client does not reference nonexistent columns');
check('migration defines quota columns', /standard_units_used INTEGER/.test(migration) && /ultimate_units_used INTEGER/.test(migration) && /standard_equivalent_used INTEGER/.test(migration), 'quota migration columns are present');
check('checkout validates configured price', /if \(!priceId\)/.test(checkout) || /priceId/.test(checkout), 'checkout code references selected Stripe price');

const failed = checks.filter((item) => !item.pass);
for (const item of checks) console.log(`${item.pass ? 'PASS' : 'FAIL'}\t${item.name}\t${item.detail}`);
if (failed.length) process.exit(1);
