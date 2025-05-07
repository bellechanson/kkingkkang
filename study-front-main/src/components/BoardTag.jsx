import React, { useEffect, useState } from 'react';
import axios from 'axios';

function BoardTag({ onTagClick }) {
  const [boards, setBoards] = useState([]);

  useEffect(() => {
    // Spring Boot 서버 (8787)에서 보드 목록 요청
    axios.get('http://localhost:8787/api/boards')
        .then(response => {
          const randomBoards = shuffleArray(response.data).slice(0, 5);
          setBoards(randomBoards);
        })
        .catch(error => console.error('보드 목록 불러오기 실패:', error));
  }, []);

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  return (
      <div className="tags">
        {boards.map((board) => (
            <span
                key={board.bid}
                className="tag"
                onClick={() => onTagClick(board.bid)}
            >
          #{board.category}
        </span>
        ))}
      </div>
  );
}

export default BoardTag;
