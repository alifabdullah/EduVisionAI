import LoginPage from '@/components/LoginPage';

export default function DeptHeadLogin() {
  return (
    <LoginPage
      role="authority"
      accentColor="#10B981"
      glow="rgba(16,185,129,0.4)"
      icon="🏢"
      demoEmail="head.cse@edu.ai"
      demoPassword="headpass"
      redirectPath="/dashboard/authority/dept-head"
      mockUser={{ name: 'Mr. Md. Sarwar Hossain Mollah', email: 'headcis@daffodilvarsity.edu.bd', role: 'authority', id: 'TCH-002', avatar: '/images/teachers/sarwar.png' }}
      titleOverride="Department Head Login"
      btnTextOverride="Sign in as Department Head"
      backLinkOverride={{ href: '/authority-access', label: 'Back to Authority Portal' }}
    />
  );
}
