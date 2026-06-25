import Quiz from '../components/Quiz';

export default function QuizStandalone() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#F5EFE5',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      <Quiz mode="standalone" />
    </div>
  );
}
