import LoginPage from '@/components/LoginPage';

export default function TeacherLogin() {
  return (
    <LoginPage
      role="teacher"
      accentColor="#22D3EE"
      glow="rgba(34,211,238,0.4)"
      icon="👨‍🏫"
      demoEmail="tamanna@daffodilvarsity.edu.bd"
      demoPassword="demo123"
      redirectPath="/dashboard/teacher"
      mockUser={{ name: 'Tamanna Akter', email: 'tamanna@daffodilvarsity.edu.bd', role: 'teacher', id: 'TCH-005' }}
    />
  );
}
