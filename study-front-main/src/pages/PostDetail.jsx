import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import '../style/PostDetail.css';

function PostDetail() {
  const { id } = useParams(); // 게시글 ID
  const navigate = useNavigate();
  const location = useLocation();

  // 쿼리 파라미터에서 page 값 추출
  const queryParams = new URLSearchParams(location.search);
  const page = queryParams.get("page") || 0;

  const [post, setPost] = useState(null); // 게시글 정보
  const [comments, setComments] = useState([]); // 댓글 리스트
  const [newComment, setNewComment] = useState({ content: '' }); // 새 댓글 내용
  const [isAdmin, setIsAdmin] = useState(false); // 관리자 여부

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user?.role === 'admin') setIsAdmin(true);

        const postRes = await axios.get(`http://localhost:8787/api/boards/posts/${id}/view`);
        const commentRes = await axios.get(`http://localhost:8787/api/boards/comments?postId=${id}`);

        if (isMounted) {
          setPost(postRes.data);
          setComments(commentRes.data);
        }
      } catch (error) {
        console.error('데이터 불러오기 오류:', error);
      }
    };

    if (id) fetchData();
    return () => { isMounted = false; };
  }, [id]);

  const handleInputChange = (e) => {
    setNewComment({ content: e.target.value });
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!newComment.content.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.id) {
      alert('로그인이 필요합니다.');
      return;
    }

    const commentData = {
      authorId: user.id,
      content: newComment.content,
    };

    try {
      await axios.post(`http://localhost:8787/api/boards/comments/${id}`, commentData);
      setNewComment({ content: '' });
      const res = await axios.get(`http://localhost:8787/api/boards/comments?postId=${id}`);
      setComments(res.data);
    } catch (error) {
      console.error('댓글 등록 오류:', error);
    }
  };

  const handleEditClick = () => {
    navigate(`/post/edit/${id}`);
  };

  const handleBackClick = () => {
    navigate(`/board?page=${page}`);
  };

  if (!post) {
    return <div className="post-detail-container">게시글을 불러오는 중입니다...</div>;
  }

  return (
      <div className="post-detail-container">
        <h2 className="post-detail-title">{post.title}</h2>
        <p className="post-detail-author">작성자: {post.nickname}</p>
        <p className="post-detail-views">조회수: {post.viewCount}</p>
        <div className="post-detail-content">{post.content}</div>

        <div className="button-group">
          <button onClick={handleBackClick} className="back-button">
            목록으로
          </button>

          {isAdmin && (
              <button onClick={handleEditClick} className="edit-button">
                수정
              </button>
          )}
        </div>

        <hr />
        <div className="comment-section">
          <h3>댓글</h3>
          <form onSubmit={handleCommentSubmit} className="comment-form">
          <textarea
              name="content"
              placeholder="댓글 내용을 입력하세요"
              value={newComment.content}
              onChange={handleInputChange}
          />
            <button type="submit">댓글 등록</button>
          </form>

          <ul className="comment-list">
            {comments.length === 0 ? (
                <li className="comment-item">댓글이 없습니다.</li>
            ) : (
                comments.map((comment, index) => (
                    <li key={index} className="comment-item">
                      <strong>작성자 ID: {comment.authorId}</strong> {comment.content}
                    </li>
                ))
            )}
          </ul>
        </div>
      </div>
  );
}

export default PostDetail;
