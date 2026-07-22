import LoginPage from '@/components/LoginPage';

export default function HRLogin() {
  return (
    <LoginPage
      role="authority"
      accentColor="#06B6D4"
      glow="rgba(6,182,212,0.4)"
      icon="👔"
      demoEmail="hr.manager@edu.ai"
      demoPassword="hrpass"
      redirectPath="/dashboard/authority/hr"
      mockUser={{ name: 'Ms. Nasrin Sultana', email: 'hr@daffodilvarsity.edu.bd', role: 'authority', id: 'AUTH-HR', avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop' }}
      titleOverride="HR Portal Login"
      btnTextOverride="Sign in as HR"
      backLinkOverride={{ href: '/authority-access', label: 'Back to Authority Portal' }}
    />
  );
}
