import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../style/PostDetail.css';

// 게시글 상세 페이지 컴포넌트
function PostDetail() {
  const { postId } = useParams(); // URL 파라미터에서 postId 가져옴
  const navigate = useNavigate(); // 페이지 이동을 위한 훅
  const [post, setPost] = useState(null); // 게시글 데이터를 저장
  const [comments, setComments] = useState([]); // 댓글 리스트 상태
  const [newComment, setNewComment] = useState({ author: '', content: '' }); // 새 댓글 입력 상태
  const [isAdmin, setIsAdmin] = useState(false); // 관리자 여부 상태

  // 컴포넌트가 마운트되거나 postId가 변경될 때 실행
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user')); // 로컬스토리지에서 사용자 정보 가져오기
    if (user && user.role === 'admin') {
      setIsAdmin(true); // 사용자가 관리자라면 수정 버튼 보이도록 설정
    }

    // 게시글 데이터 불러오기
    axios.get(`http://localhost:3001/posts/${postId}`)
        .then(response => setPost(response.data))
        .catch(error => console.error('게시글 불러오기 오류:', error));

    // 댓글 데이터 불러오기
    fetchComments();
  }, [postId]);

  // 댓글 목록을 불러오는 함수
  const fetchComments = () => {
    axios.get(`http://localhost:3001/comments?postId=${postId}`)
        .then(response => setComments(response.data))
        .catch(error => console.error('댓글 불러오기 오류:', error));
  };

  // 댓글 작성 폼 입력 값 변경 처리
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewComment(prev => ({ ...prev, [name]: value }));
  };

  // 댓글 등록 버튼 클릭 시 처리 함수
  const handleCommentSubmit = async (e) => {
    e.preventDefault(); // 폼 기본 제출 막기

    // 작성자와 내용이 모두 입력되었는지 검사
    if (!newComment.author.trim() || !newComment.content.trim()) {
      alert('작성자와 내용을 모두 입력해주세요.');
      return;
    }

    // 서버에 보낼 댓글 데이터 구성
    const commentData = {
      postId: Number(postId),
      author: newComment.author,
      content: newComment.content,
      createdAt: new Date().toISOString() // 생성 시간 추가
    };

    // 댓글 저장 요청
    try {
      await axios.post('http://localhost:3001/comments', commentData);
      setNewComment({ author: '', content: '' }); // 입력창 초기화
      fetchComments(); // 최신 댓글 다시 불러오기
    } catch (error) {
      console.error('댓글 등록 오류:', error);
    }
  };

  // 수정 버튼 클릭 시 수정 페이지로 이동
  const handleEditClick = () => {
    navigate(`/post/edit/${postId}`);
  };

  // 게시글이 아직 로드되지 않은 경우 로딩 메시지 출력
  if (!post) return <div className="post-detail-container">게시글을 불러오는 중입니다...</div>;

  return (
      <div className="post-detail-container">
        <h2 className="post-detail-title">{post.title}</h2>
        <p className="post-detail-author">작성자: {post.author}</p>
        <div className="post-detail-content">{post.content}</div>

        {/* 관리자만 수정 버튼 보이게 */}
        {isAdmin && (
            <button onClick={handleEditClick} className="edit-button">
              수정
            </button>
        )}

        <hr />
        {/* 댓글 영역 */}
        <div className="comment-section">
          <h3>댓글</h3>
          {/* 댓글 작성 폼 */}
          <form onSubmit={handleCommentSubmit} className="comment-form">
            <input
                type="text"
                name="author"
                placeholder="작성자"
                value={newComment.author}
                onChange={handleInputChange}
            />
            <textarea
                name="content"
                placeholder="댓글 내용을 입력하세요"
                value={newComment.content}
                onChange={handleInputChange}
            />
            <button type="submit">댓글 등록</button>
          </form>

          {/* 댓글 목록 출력 */}
          <ul className="comment-list">
            {comments.length === 0 ? (
                <li className="comment-item">댓글이 없습니다.</li>
            ) : (
                comments.map(comment => (
                    <li key={comment.id} className="comment-item">
                      <strong>{comment.author}</strong>{comment.content}
                    </li>
                ))
            )}
          </ul>
        </div>
      </div>
  );
}

export default PostDetail;
