'use client';

import { API_ENDPOINTS } from '@/constants/api';
import { useLanguage } from '@/contexts/LanguageContext';
import React, { useEffect, useState } from 'react';

interface PollResult {
  id: number;
  question: string;
  answerOption: string;
  selectedresult?: VoteResult[];
}

interface VoteResult {
  selectedAnswer: string;
  answerCount: number;
  percentage: number; // change to number since your API returns numbers
}

interface PollResultsApiResponse {
  pollresults: PollResult[];
  status?: boolean;
  message?: string;
}

const PollResultPage: React.FC = () => {
  const { t } = useLanguage();
  const [pollResults, setPollResults] = useState<PollResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPollResults = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('🗳️ PollResults: Fetching poll results...');

        const response = await fetch(API_ENDPOINTS.POLL_RESULTS_SUBMIT, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });

        console.log('🗳️ PollResults: API response status:', response.status);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: PollResultsApiResponse = await response.json();
        console.log('🗳️ PollResults: API response data:', data);

        if (!data.pollresults || data.pollresults.length === 0) {
          throw new Error('No poll results found');
        }

        setPollResults(data.pollresults);
      } catch (err) {
        console.error('🗳️ PollResults: Error fetching poll results:', err);
        setError(err instanceof Error ? err.message : 'Failed to load poll results');
      } finally {
        setLoading(false);
      }
    };

    fetchPollResults();
  }, []);

  if (loading) {
    return (
      <div className="blogs-main-section">
        <div className="blogs-head-bar first">
          <span className="blog-category">{t('POLL_RESULTS_TITLE')}</span>
        </div>
        <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
          <i className="fa-solid fa-spinner fa-spin"></i>
          <span style={{ marginLeft: '8px' }}>{t('LOADING_DOTS')}</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="blogs-main-section-inner">
        <div className="blogs-head-bar first">
          <span className="blog-category">{t('POLL_RESULTS_TITLE')}</span>
        </div>
        <div style={{ padding: '40px', textAlign: 'center', color: '#e74c3c' }}>
          <i className="fa-solid fa-exclamation-triangle"></i>
          <span style={{ marginLeft: '8px' }}>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="blogs-main-section">
      <div className="blogs-head-bar first">
        <span className="blog-category">{t('POLL_RESULTS_TITLE')}</span>
      </div>

      {pollResults.length > 0 ? (
        pollResults.map((item) => (
          <div key={item.id} className="MCQ">
            <h5 className="MCQ-Question custom-gujrati-font">{item.question}</h5>

            <div className="MCQ-options custom-gujrati-font poleresult">
              {item.selectedresult && item.selectedresult.length > 0 ? (
                item.selectedresult.map((pitem, pindex) => (
                  <div key={pindex} className="all-options" style={{ display:'inline-block'}}>
                    <label>{pitem.selectedAnswer}</label>&nbsp;:&nbsp;
                    <span>{pitem.percentage}%</span>
                  </div>
                ))
              ) : (
                <div className="all-options">
                  <label>{t('NO_VOTES_YET')}</label>
                </div>
              )}
            </div>
          </div>
        ))
      ) : (
        <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
          <p>{t('NO_POLL_RESULTS_AVAILABLE')}</p>
        </div>
      )}
    </div>
  );
};

export default PollResultPage;
