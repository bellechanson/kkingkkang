import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../style/SearchBar.css';

function SearchBar() {
    const [keyword, setKeyword] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [postResults, setPostResults] = useState([]);
    const [commentResults, setCommentResults] = useState([]);
    const [boardResults, setBoardResults] = useState([]);

    // 🔹 자동완성 요청
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (!keyword.trim()) {
                setSuggestions([]);
                return;
            }

            try {
                const res = await axios.get(`http://localhost:8787/api/autocomplete/title?prefix=${keyword}`);
                setSuggestions(Array.isArray(res.data) ? res.data : []);
            } catch (err) {
                console.error('자동완성 실패:', err);
            }
        };

        const delay = setTimeout(() => fetchSuggestions(), 300); // debounce 300ms
        return () => clearTimeout(delay);
    }, [keyword]);

    const handleSearch = async () => {
        if (!keyword.trim()) return;

        try {
            const [posts, comments, boards] = await Promise.all([
                axios.get(`http://localhost:8787/api/posts/search?keyword=${keyword}&page=0&size=5`),
                axios.get(`http://localhost:8787/api/comments/search?keyword=${keyword}&page=0&size=5`),
                axios.get(`http://localhost:8787/api/boards/search?keyword=${keyword}&page=0&size=5`),
            ]);

            setPostResults(posts.data.content || []);
            setCommentResults(comments.data.content || []);
            setBoardResults(boards.data.content || []);
            setSuggestions([]); // 검색 시 자동완성 숨김
        } catch (error) {
            console.error('검색 실패:', error);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleSuggestionClick = (text) => {
        setKeyword(text);
        handleSearch();
    };

    return (
        <div className="search-container">
            <input
                type="text"
                placeholder="검색어를 입력하세요"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={handleKeyPress}
            />
            <button onClick={handleSearch}>검색</button>

            {/* 🔥 자동완성 드롭다운: keyword가 있고 요청은 했으나 결과 없을 때도 표시 유지 */}
            {keyword.trim() && (
                <ul className="autocomplete-list">
                    {suggestions.length > 0 ? (
                        suggestions.map((s, index) => (
                            <li key={index} onMouseDown={() => handleSuggestionClick(s)}>
                                {s}
                            </li>
                        ))
                    ) : (
                        <li className="no-results">검색 결과가 없습니다.</li>
                    )}
                </ul>
            )}

            {/* 게시글 검색 결과 */}
            {postResults.length > 0 && (
                <div className="search-results">
                    <h3>게시글 검색 결과</h3>
                    {postResults.map((post) => (
                        <div key={post.id} className="search-card">
                            <h4>{post.title}</h4>
                            <p>{post.content}</p>
                            <div className="meta">
                                작성자: {post.nickname} | {new Date(post.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* 댓글 검색 결과 */}
            {commentResults.length > 0 && (
                <div className="search-results">
                    <h3>댓글 검색 결과</h3>
                    {commentResults.map((comment) => (
                        <div key={comment.id} className="search-card">
                            <p>{comment.content}</p>
                            <div className="meta">
                                작성자: {comment.nickname} | {new Date(comment.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* 보드 검색 결과 */}
            {boardResults.length > 0 && (
                <div className="search-results">
                    <h3>보드 검색 결과</h3>
                    {boardResults.map((board) => (
                        <div key={board.id} className="search-card">
                            <p>카테고리명: {board.category}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default SearchBar;
