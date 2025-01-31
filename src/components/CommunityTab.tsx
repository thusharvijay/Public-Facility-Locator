import React, { useState } from 'react';
import { Search, ThumbsUp, ThumbsDown } from 'lucide-react';
import type { CommunityOpinion } from '../types';

interface CommunityTabProps {
  opinions: CommunityOpinion[];
  onAddOpinion: (opinion: Omit<CommunityOpinion, 'id' | 'date' | 'likes' | 'dislikes'>) => void;
  onReact: (opinionId: string, reaction: 'like' | 'dislike') => void;
}

export default function CommunityTab({ opinions, onAddOpinion, onReact }: CommunityTabProps) {
  const [newOpinion, setNewOpinion] = useState('');
  const [userName, setUserName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddOpinion({
      userName,
      content: newOpinion,
    });
    setNewOpinion('');
    setUserName('');
  };

  const filteredOpinions = opinions
    .filter(opinion => 
      opinion.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opinion.userName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search opinions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-3 py-2 border rounded-md"
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Your Name
          </label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Your Opinion
          </label>
          <textarea
            value={newOpinion}
            onChange={(e) => setNewOpinion(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            rows={4}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Share Opinion
        </button>
      </form>

      <div className="space-y-4">
        {filteredOpinions.map((opinion) => (
          <div key={opinion.id} className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-semibold">{opinion.userName}</p>
                <p className="text-sm text-gray-500">
                  {new Date(opinion.date).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => onReact(opinion.id, 'like')}
                  className={`flex items-center gap-1 ${
                    opinion.userReaction === 'like' ? 'text-blue-500' : 'text-gray-500'
                  }`}
                >
                  <ThumbsUp size={16} />
                  <span>{opinion.likes}</span>
                </button>
                <button
                  onClick={() => onReact(opinion.id, 'dislike')}
                  className={`flex items-center gap-1 ${
                    opinion.userReaction === 'dislike' ? 'text-red-500' : 'text-gray-500'
                  }`}
                >
                  <ThumbsDown size={16} />
                  <span>{opinion.dislikes}</span>
                </button>
              </div>
            </div>
            <p className="text-gray-700">{opinion.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}