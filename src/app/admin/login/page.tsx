import { currentAdmin } from '@/server/auth';
import { redirect } from 'next/navigation';
import { LoginForm } from '@/components/admin/login-form';
export default async function LoginPage() { if (await currentAdmin()) redirect('/admin'); return <main className="login-page"><LoginForm/></main>; }
