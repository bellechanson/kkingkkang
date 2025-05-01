import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "../style/Login.css";

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.get(`http://localhost:3001/users?email=${email}`);
            const user = res.data[0];

            if (!user) {
                setError("이메일이 존재하지 않습니다.");
                return;
            }

            if (user.password !== password) {
                setError("비밀번호가 일치하지 않습니다.");
                return;
            }

            alert("로그인 성공!");
            localStorage.setItem("user", JSON.stringify(user));
            navigate("/");

        } catch (err) {
            console.error(err);
            setError("로그인 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className="login-page">
            <h2 className="logo" onClick={() => navigate("/")}>STUDYLOG</h2>
            <form onSubmit={handleLogin} className="login-form">
                <div>
                    <label htmlFor="email">이메일</label>
                    <input
                        type="text"
                        id="email"
                        placeholder="이메일"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">비밀번호</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="비밀번호"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p className="error-message">{error}</p>}
                <button type="submit">로그인</button>
                <div className="login-links">
                    <p onClick={() => navigate("/")}>아이디(이메일) 찾기</p>
                    <p onClick={() => navigate("/")}>비밀번호 찾기</p>
                </div>
            </form>
            <p onClick={() => navigate("/register")} className="signup-link">
                계정이 없으신가요? <span>회원가입</span>
            </p>
        </div>
    );
}

export default Login;
