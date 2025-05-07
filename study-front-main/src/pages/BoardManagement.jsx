import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../style/BoardManagement.css';

function BoardManagement() {
  const [boards, setBoards] = useState([]);
  const [editingBoard, setEditingBoard] = useState(null);
  const [boardName, setBoardName] = useState('');
  const [newBoardName, setNewBoardName] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8787/api/boards')
        .then(response => setBoards(response.data))
        .catch(error => console.error('보드 목록 불러오기 실패:', error));
    console.log(boards)
  }, []);

  const handleEditClick = (board) => {
    setEditingBoard(board);
    setBoardName(board.category);
  };

  const handleInputChange = (e) => {
    setBoardName(e.target.value);
  };

  const handleSaveClick = (boardId) => {
    if (!boardName.trim()) {
      alert('보드 이름을 입력하세요.');
      return;
    }

    axios.put(`http://localhost:8787/api/boards/${boardId}`, { category: boardName })
        .then(response => {
          const updatedCategory = response.data.category || boardName;
          setBoards(prev =>
              prev.map(b => b.bId === boardId ? { ...b, category: updatedCategory } : b)
          );
          setEditingBoard(null);
          setBoardName('');
        })
        .catch(error => console.error('보드 수정 실패:', error));
  };

  const handleCancelClick = () => {
    setEditingBoard(null);
    setBoardName('');
  };

  const handleDeleteClick = (boardId) => {
    if (window.confirm('정말로 이 보드를 삭제하시겠습니까?')) {
      axios.delete(`http://localhost:8787/api/boards/${boardId}`)
          .then(() => {
            setBoards(prev => prev.filter(b => b.bId !== boardId));
          })
          .catch(error => console.error('보드 삭제 실패:', error));
    }
  };

  const handleAddBoard = () => {
    if (!newBoardName.trim()) {
      alert('보드 이름을 입력하세요.');
      return;
    }

    axios.post('http://localhost:8787/api/boards', { category: newBoardName })
        .then(response => {
          setBoards(prev => [...prev, response.data]);
          setNewBoardName('');
        })
        .catch(error => console.error('보드 추가 실패:', error));
  };

  return (
      <div className="board-management-container">
        <h2>보드 관리</h2>

        <div className="board-add-form">
          <input
              type="text"
              value={newBoardName}
              onChange={(e) => setNewBoardName(e.target.value)}
              placeholder="새로운 보드 이름"
          />
          <button onClick={handleAddBoard}>보드 추가</button>
        </div>

        <ul className="board-list">
          {boards.map(board => (
              board.bId && (
                  <li key={board.bId}>
                    {editingBoard?.bId === board.bId ? (
                        <>
                          <input
                              type="text"
                              value={boardName}
                              onChange={handleInputChange}
                              placeholder="보드 이름"
                          />
                          <button onClick={() => handleSaveClick(board.bId)}>저장</button>
                          <button onClick={handleCancelClick}>취소</button>
                        </>
                    ) : (
                        <>
                          <span>{board.category}</span>
                          <button onClick={() => handleEditClick(board)}>수정</button>
                          <button onClick={() => handleDeleteClick(board.bId)}>삭제</button>
                        </>
                    )}
                  </li>
              )
          ))}
        </ul>
      </div>
  );
}

export default BoardManagement;
