'use client';

import { useState, useEffect } from 'react';

interface Feedback {
  sessionId: string;
  rating: number;
  comment?: string;
  timestamp: string;
}

export default function Dashboard() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/feedback');
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setFeedback(data.feedback || []);
    } catch (error) {
      console.error('Error fetching feedback:', error);
      setError('Er is een fout opgetreden bij het laden van de feedback.');
    } finally {
      setIsLoading(false);
    }
  };

  const averageRating = feedback.length > 0 
    ? (feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length).toFixed(1)
    : '0';

  const ratingDistribution = [1, 2, 3, 4, 5].map(rating => ({
    rating,
    count: feedback.filter(f => f.rating === rating).length
  }));

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('nl-NL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-green-600';
    if (rating >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRatingText = (rating: number) => {
    const texts = {
      1: 'Heel slecht',
      2: 'Slecht', 
      3: 'Oké',
      4: 'Goed',
      5: 'Uitstekend'
    };
    return texts[rating as keyof typeof texts] || 'Onbekend';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Feedback laden...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Fout</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={fetchFeedback}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Opnieuw proberen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Roz Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Overzicht van gebruikersfeedback
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              Totaal aantal gesprekken
            </h3>
            <p className="text-3xl font-bold text-indigo-600">{feedback.length}</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              Gemiddelde beoordeling
            </h3>
            <p className="text-3xl font-bold text-indigo-600">{averageRating} ⭐</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              Met opmerkingen
            </h3>
            <p className="text-3xl font-bold text-indigo-600">
              {feedback.filter(f => f.comment && f.comment.trim()).length}
            </p>
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Verdeling beoordelingen
          </h3>
          <div className="space-y-2">
            {ratingDistribution.map(({ rating, count }) => (
              <div key={rating} className="flex items-center">
                <span className="w-12 text-sm text-gray-600 dark:text-gray-400">
                  {rating} ⭐
                </span>
                <div className="flex-1 mx-4">
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                    <div
                      className="bg-indigo-600 h-4 rounded-full transition-all duration-300"
                      style={{
                        width: feedback.length > 0 ? `${(count / feedback.length) * 100}%` : '0%'
                      }}
                    ></div>
                  </div>
                </div>
                <span className="w-12 text-sm text-gray-600 dark:text-gray-400 text-right">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Feedback List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Recente feedback
            </h3>
          </div>
          
          {feedback.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                Nog geen feedback ontvangen.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {feedback
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .map((item, index) => (
                <div key={index} className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <span className={`text-lg font-semibold ${getRatingColor(item.rating)}`}>
                        {item.rating} ⭐
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {getRatingText(item.rating)}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(item.timestamp)}
                    </span>
                  </div>
                  
                  {item.comment && item.comment.trim() && (
                    <div className="mt-3">
                      <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                        "{item.comment}"
                      </p>
                    </div>
                  )}
                  
                  <div className="mt-2">
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      Sessie: {item.sessionId.substring(0, 8)}...
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}