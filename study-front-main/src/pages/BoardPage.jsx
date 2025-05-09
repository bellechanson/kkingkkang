import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BoardCategory from "../components/BoardCategory";
import PostList from "../components/PostList";
import FloatingButton from "../components/FloatingButton";
import SearchBar from "../components/SearchBar"; // ✅ 검색창 추가
import '../style/BoardPage.css';

function BoardPage() {
    const [selectedBoardId, setSelectedBoardId] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.state?.tag) {
            setSelectedBoardId(location.state.tag);
        }
    }, [location.state]);

    return (
        <div className="board-page-container">
            <h2 className="board-page-title">게시판</h2>

            {/* ✅ 검색 + 글쓰기 나란히 배치 */}
            <div className="search-bar-row">
                <SearchBar />
                <button
                    className="board-page-write-button"
                    onClick={() => navigate("/posts/create")}
                >
                    글쓰기
                </button>
            </div>


            <div className="board-page-content">
                <div className="board-page-category">
                    <BoardCategory onBoardSelect={setSelectedBoardId} />
                </div>

                <div className="post-list-container">
                    <PostList boardId={selectedBoardId || null} />
                </div>
            </div>

            <FloatingButton />
        </div>
    );
}

export default BoardPage;
