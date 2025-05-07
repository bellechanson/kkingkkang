import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import '../style/PostList.css';

function PostList({ boardId }) {
    const location = useLocation();
    const navigate = useNavigate();

    const queryParams = new URLSearchParams(location.search);
    const initialPage = parseInt(queryParams.get("page")) || 0;

    const [posts, setPosts] = useState([]);
    const [pageInfo, setPageInfo] = useState({
        number: initialPage,
        totalPages: 0,
    });
    const [pageGroup, setPageGroup] = useState(Math.floor(initialPage / 5));
    const pageSize = 10;
    const pageRange = 5;

    const fetchPosts = (page = 0) => {
        let url = `http://localhost:8787/api/boards/posts/paged?page=${page}&size=${pageSize}`;
        if (boardId) {
            url += `&boardId=${boardId}`;
        }

        axios.get(url)
            .then(response => {
                setPosts(response.data.content);
                setPageInfo({
                    number: response.data.number,
                    totalPages: response.data.totalPages,
                });
            })
            .catch(error => console.error('게시글 목록 불러오기 실패:', error));
    };

    useEffect(() => {
        fetchPosts(initialPage);
        setPageGroup(Math.floor(initialPage / pageRange));
    }, [boardId, initialPage]);

    const handlePostClick = (postId) => {
        navigate(`/posts/${postId}?page=${pageInfo.number}`);
    };

    const handlePageChange = (page) => {
        navigate(`?page=${page}`);
        fetchPosts(page);
        setPageGroup(Math.floor(page / pageRange));
    };

    const renderPagination = () => {
        const startPage = pageGroup * pageRange;
        const endPage = Math.min(startPage + pageRange, pageInfo.totalPages);

        const pages = [];

        // ◀ 이전 그룹 버튼
        if (startPage > 0) {
            pages.push(
                <button key="prevGroup" onClick={() => setPageGroup(pageGroup - 1)}>&lt;</button>
            );
        }

        // 첫 페이지 바로가기
        if (startPage >= pageRange) {
            pages.push(
                <button key="first" onClick={() => handlePageChange(0)}>1</button>
            );
        }

        // ... 왼쪽 점프 (5칸 뒤로)
        if (startPage >= pageRange * 2) {
            pages.push(
                <button key="jumpBack" onClick={() => handlePageChange(startPage - pageRange)}>...</button>
            );
        }

        // 현재 그룹의 페이지 번호들
        for (let i = startPage; i < endPage; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={i === pageInfo.number ? 'active' : ''}
                >
                    {i + 1}
                </button>
            );
        }

        // ... 오른쪽 점프 (5칸 앞으로)
        if (pageInfo.totalPages - endPage >= pageRange * 2) {
            pages.push(
                <button key="jumpForward" onClick={() => handlePageChange(startPage + pageRange)}>...</button>
            );
        }

        // ▶ 다음 그룹 버튼
        if (endPage < pageInfo.totalPages) {
            pages.push(
                <button key="nextGroup" onClick={() => setPageGroup(pageGroup + 1)}>&gt;</button>
            );
        }

        return pages;
    };

    return (
        <div className="post-list">
            <table className="post-table">
                <thead>
                <tr>
                    <th>작성일</th>
                    <th>제목</th>
                    <th>작성자</th>
                </tr>
                </thead>
                <tbody>
                {posts.length === 0 ? (
                    <tr>
                        <td colSpan="3" className="no-posts">게시글이 없습니다.</td>
                    </tr>
                ) : (
                    posts.map(post => (
                        <tr
                            key={post.id}
                            onClick={() => handlePostClick(post.id)}
                            className="post-row"
                            style={{ cursor: 'pointer' }}
                        >
                            <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                            <td>{post.title}</td>
                            <td>{post.nickname}</td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>

            <div className="pagination">
                {renderPagination()}
            </div>
        </div>
    );
}

export default PostList;
