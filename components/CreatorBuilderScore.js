// components/CreatorBuilderScore.js
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

export default function CreatorBuilderScore() {
  const { address, isConnected } = useAccount();
  const [scores, setScores] = useState({ creator: null, builder: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isConnected || !address) {
      setScores({ creator: null, builder: null });
      return;
    }

    const fetchScores = async () => {
      setLoading(true);
      setError(null);
      try {
        // Talent Protocol Production API Endpoint
        const response = await fetch(`https://api.talentprotocol.com/api/v2/builder-score/${address}`);
        if (!response.ok) {
          throw new Error('Could not fetch scores. The wallet may not have a score yet.');
        }
        const data = await response.json();
        setScores({
          creator: data.score?.creator_score || 0,
          builder: data.score?.score || 0,
        });
      } catch (err) {
        setError(err.message);
        setScores({ creator: 0, builder: 0 }); // Reset to 0 on error
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, [address, isConnected]);

  if (!isConnected) {
    return null; // Don't show anything if wallet is not connected
  }

  if (loading) {
    return <div style={{ fontSize: 14, opacity: 0.95, marginTop: 8 }}>Loading scores...</div>;
  }
  
  if (error) {
     return <div style={{ fontSize: 14, opacity: 0.8, marginTop: 8 }}>Could not load scores. You may need to create a <a href="https://app.talentprotocol.com/" target="_blank" rel="noreferrer" style={{color: 'inherit'}}>Talent Protocol</a> profile.</div>
  }

  return (
    <div style={{ marginTop: 12, display: 'flex', justifyContent: 'center', gap: '20px', fontSize: 14 }}>
      <div>
        Creator Score: <strong>{scores.creator}</strong>
      </div>
      <div>
        Builder Score: <strong>{scores.builder}</strong>
      </div>
    </div>
  );
}
