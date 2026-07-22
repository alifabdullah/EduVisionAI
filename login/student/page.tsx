import LoginPage from '@/components/LoginPage';

export default function StudentLogin() {
  return (
    <LoginPage
      role="student"
      accentColor="#6C63FF"
      glow="rgba(108,99,255,0.4)"
      icon="🎓"
      demoEmail="student@edu.ai"
      demoPassword="demo123"
      redirectPath="/dashboard/student"
      mockUser={{ name: 'Joy kumar Yuv', email: 'student@edu.ai', role: 'student', id: '261-16-010' }}
    />
  );
}
