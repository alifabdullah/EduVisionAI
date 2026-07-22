'use client';
import Link from 'next/link';
import TopNavbar from '@/components/layout/TopNavbar';
import { motion } from 'framer-motion';

export default function AuthorityAccessPortal() {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg)', minHeight: '100vh' }}>
      <TopNavbar title="Authority Access Portal 🏛️" subtitle="University Administrative Portals" accentColor="#F59E0B" />
      
      <main style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', overflowY: 'auto' }}>
        <div style={{ maxWidth: '900px', width: '100%', textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1rem', letterSpacing: '-0.5px' }}>
            Select Your Administrative Role
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--muted)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
            Welcome to the University ERP Authority Gateway. Please select your designated role to login to your dedicated management and insights portal.
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '2rem', 
          width: '100%', 
          maxWidth: '1000px' 
        }}>
          {/* Dean Portal Card */}
          <Link href="/login/authority/dean" style={{ textDecoration: 'none' }}>
            <motion.div 
              whileHover={{ scale: 1.03, translateY: -5 }}
              whileTap={{ scale: 0.98 }}
              className="glass-card"
              style={{
                padding: '2.5rem 2rem',
                borderRadius: '24px',
                background: 'linear-gradient(145deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.02) 100%)',
                border: '1px solid rgba(245, 158, 11, 0.2)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                boxShadow: '0 10px 30px -10px rgba(245, 158, 11, 0.15)',
                cursor: 'pointer',
                height: '100%'
              }}
            >
              <div style={{ 
                width: '80px', height: '80px', borderRadius: '50%', 
                background: 'rgba(245, 158, 11, 0.15)', display: 'flex', 
                alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem',
                fontSize: '2.5rem'
              }}>
                🎓
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.75rem' }}>
                Dean
              </h2>
              <p style={{ fontSize: '0.95rem', color: 'var(--muted)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                Oversee academic excellence, view strategic analytics, and manage institution-wide performance.
              </p>
              <button style={{ marginTop: 'auto', padding: '10px 24px', borderRadius: '12px', background: '#F59E0B', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer', width: '100%' }}>
                Enter
              </button>
            </motion.div>
          </Link>

          {/* HR Manager Portal Card */}
          <Link href="/login/authority/hr" style={{ textDecoration: 'none' }}>
            <motion.div 
              whileHover={{ scale: 1.03, translateY: -5 }}
              whileTap={{ scale: 0.98 }}
              className="glass-card"
              style={{
                padding: '2.5rem 2rem',
                borderRadius: '24px',
                background: 'linear-gradient(145deg, rgba(34, 211, 238, 0.1) 0%, rgba(34, 211, 238, 0.02) 100%)',
                border: '1px solid rgba(34, 211, 238, 0.2)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                boxShadow: '0 10px 30px -10px rgba(34, 211, 238, 0.15)',
                cursor: 'pointer',
                height: '100%'
              }}
            >
              <div style={{ 
                width: '80px', height: '80px', borderRadius: '50%', 
                background: 'rgba(34, 211, 238, 0.15)', display: 'flex', 
                alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem',
                fontSize: '2.5rem'
              }}>
                👔
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.75rem' }}>
                Human Resources (HR)
              </h2>
              <p style={{ fontSize: '0.95rem', color: 'var(--muted)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                Manage faculty resources, evaluate teacher productivity, and oversee university staffing.
              </p>
              <button style={{ marginTop: 'auto', padding: '10px 24px', borderRadius: '12px', background: '#06B6D4', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer', width: '100%' }}>
                Enter
              </button>
            </motion.div>
          </Link>

          {/* Department Head Portal Card */}
          <Link href="/login/authority/dept-head" style={{ textDecoration: 'none' }}>
            <motion.div 
              whileHover={{ scale: 1.03, translateY: -5 }}
              whileTap={{ scale: 0.98 }}
              className="glass-card"
              style={{
                padding: '2.5rem 2rem',
                borderRadius: '24px',
                background: 'linear-gradient(145deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.02) 100%)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                boxShadow: '0 10px 30px -10px rgba(16, 185, 129, 0.15)',
                cursor: 'pointer',
                height: '100%'
              }}
            >
              <div style={{ 
                width: '80px', height: '80px', borderRadius: '50%', 
                background: 'rgba(16, 185, 129, 0.15)', display: 'flex', 
                alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem',
                fontSize: '2.5rem'
              }}>
                🏢
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.75rem' }}>
                Department Head
              </h2>
              <p style={{ fontSize: '0.95rem', color: 'var(--muted)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                Monitor departmental KPIs, track student attendance, and coordinate internal operations.
              </p>
              <button style={{ marginTop: 'auto', padding: '10px 24px', borderRadius: '12px', background: '#10B981', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer', width: '100%' }}>
                Enter
              </button>
            </motion.div>
          </Link>
        </div>
      </main>
    </div>
  );
}
