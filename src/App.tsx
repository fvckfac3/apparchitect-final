/**
 * App.tsx - top-level router.
 * Routes: /, /pricing, /settings/billing.
 */
import { Routes, Route } from 'react-router';
import Index from '@/pages/Index';
import Pricing from '@/pages/Pricing';
import Billing from '@/pages/Billing';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/settings/billing" element={<Billing />} />
    </Routes>
  );
}
