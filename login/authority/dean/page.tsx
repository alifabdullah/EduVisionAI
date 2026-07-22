import LoginPage from '@/components/LoginPage';

export default function DeanLogin() {
  return (
    <LoginPage
      role="authority"
      accentColor="#F59E0B"
      glow="rgba(245,158,11,0.4)"
      icon="🎓"
      demoEmail="dean.fsc@edu.ai"
      demoPassword="deanpass"
      redirectPath="/dashboard/authority/dean"
      mockUser={{ name: 'Prof. Dr. Md. Fokhray Hossain', email: 'dean@daffodilvarsity.edu.bd', role: 'authority', id: 'AUTH-DEAN', avatar: '/images/authority/dean_fokhray.png' }}
      titleOverride="Dean Portal Login"
      btnTextOverride="Sign in as Dean"
      backLinkOverride={{ href: '/authority-access', label: 'Back to Authority Portal' }}
    />
  );
}
