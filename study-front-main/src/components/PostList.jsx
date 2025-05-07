import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import '../style/PostList.css';

function PostList({ boardId, viewType = 'pagination' }) {
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
    const loadingRef = useRef(false);
    const lastPostRef = useRef(null);

    const fetchPosts = async (page = 0, reset = false) => {
        let url = boardId
            ? `http://localhost:8787/api/boards/posts/by-board/${boardId}?page=${page}&size=${pageSize}`
            : `http://localhost:8787/api/boards/posts/paged?page=${page}&size=${pageSize}`;

        try {
            const response = await axios.get(url);
            setPosts(prev =>
                reset ? response.data.content : [...prev, ...response.data.content]
            );
            setPageInfo({
                number: response.data.number,
                totalPages: response.data.totalPages,
            });
        } catch (error) {
            console.error("게시글 목록 불러오기 실패:", error);
        } finally {
            loadingRef.current = false;
        }
    };

    useEffect(() => {
        setPosts([]);
        setPageInfo({ number: 0, totalPages: 0 });
        fetchPosts(viewType === 'pagination' ? initialPage : 0, true);
        setPageGroup(Math.floor(initialPage / pageRange));
    }, [boardId, initialPage, viewType]);

    useEffect(() => {
        if (viewType !== 'infinite') return;
        if (!lastPostRef.current) return;

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !loadingRef.current && pageInfo.number < pageInfo.totalPages - 1) {
                loadingRef.current = true;
                fetchPosts(pageInfo.number + 1);
            }
        }, {
            rootMargin: '150px',
        });

        const current = lastPostRef.current;
        observer.observe(current);
        return () => current && observer.unobserve(current);
    }, [posts, pageInfo, viewType]);

    const handlePostClick = (postId) => {
        const pageQuery = viewType === 'pagination' ? `?page=${pageInfo.number}` : '';
        navigate(`/posts/${postId}${pageQuery}`);
    };

    const handlePageChange = (page) => {
        navigate(`?page=${page}`);
        fetchPosts(page, true);
        setPageGroup(Math.floor(page / pageRange));
    };

    const renderPagination = () => {
        const startPage = pageGroup * pageRange;
        const endPage = Math.min(startPage + pageRange, pageInfo.totalPages);
        const pages = [];

        if (startPage > 0) pages.push(<button key="prevGroup" onClick={() => setPageGroup(pageGroup - 1)}>&lt;</button>);
        if (startPage >= pageRange) pages.push(<button key="first" onClick={() => handlePageChange(0)}>1</button>);
        if (startPage >= pageRange * 2) pages.push(<button key="jumpBack" onClick={() => handlePageChange(startPage - pageRange)}>...</button>);

        for (let i = startPage; i < endPage; i++) {
            pages.push(
                <button key={i} onClick={() => handlePageChange(i)} className={i === pageInfo.number ? 'active' : ''}>
                    {i + 1}
                </button>
            );
        }

        if (pageInfo.totalPages - endPage >= pageRange * 2)
            pages.push(<button key="jumpForward" onClick={() => handlePageChange(startPage + pageRange)}>...</button>);
        if (endPage < pageInfo.totalPages)
            pages.push(<button key="nextGroup" onClick={() => setPageGroup(pageGroup + 1)}>&gt;</button>);

        return pages;
    };

    return (
        <div className="post-list">
            {viewType === 'pagination' ? (
                <table className="post-table">
                    <thead>
                    <tr><th>작성일</th><th>제목</th><th>작성자</th><th>조회수</th></tr>
                    </thead>
                    <tbody>
                    {posts.length === 0 ? (
                        <tr><td colSpan="3" className="no-posts">게시글이 없습니다.</td></tr>
                    ) : (
                        posts.map((post) => (
                            <tr key={post.id} onClick={() => handlePostClick(post.id)} className="post-row">
                                <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                                <td>{post.title}</td>
                                <td>{post.nickname}</td>
                                <td>{post.viewCount}</td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            ) : (
                <div className="post-list-cards">
                    {posts.length === 0 ? (
                        <div className="no-posts">게시글이 없습니다.</div>
                    ) : (
                        posts.map((post, index) => (
                            <div
                                key={post.id}
                                className="post-card"
                                onClick={() => handlePostClick(post.id)}
                                ref={index === posts.length - 1 ? lastPostRef : null}
                                style={{ '--delay': `${index * 15}ms` }}
                            >
                                <div className="post-image">
                                    <img src="/vite.svg" alt="게시글 이미지" />
                                </div>
                                <div className="post-content">
                                    <div className="post-title">{post.title}</div>
                                    <div className="post-preview">{post.content}</div>
                                    <div className="post-author">작성자: {post.nickname}</div>
                                    <div className="post-date">
                                        {new Date(post.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {viewType === 'pagination' ? (
                <div className="pagination">{renderPagination()}</div>
            ) : (
                <>
                    {pageInfo.number >= pageInfo.totalPages - 1 && posts.length > 0 && (
                        <div className="no-more-posts">더 이상 불러올 게시글이 없습니다.</div>
                    )}
                    {pageInfo.number < pageInfo.totalPages - 1 && (
                        <div className="loading-indicator">로딩 중...</div>
                    )}
                </>
            )}
        </div>
    );
}

export default PostList;
