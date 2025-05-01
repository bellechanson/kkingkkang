import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "../style/Register.css";

function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        name: "",
        role: "user",
    });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        if (name === "confirmPassword" || name === "password") {
            setError("");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.password !== form.confirmPassword) {
            setError("비밀번호가 일치하지 않습니다.");
            return;
        }

        try {
            const res = await axios.get(`http://localhost:3001/users?email=${form.email}`);
            if (res.data.length > 0) {
                alert("이미 존재하는 이메일입니다.");
                return;
            }

            const { confirmPassword, ...userData } = form;
            await axios.post("http://localhost:3001/users", userData);
            alert("회원가입 성공!");
            navigate("/login");
        } catch (err) {
            console.error(err);
            alert("회원가입 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className="register-page">
            <h2 className="logo" onClick={() => navigate("/")}>STUDYLOG</h2>
            <form onSubmit={handleSubmit} className="register-form">
                <label htmlFor="email">이메일</label>
                <input
                    type="text"
                    id="email"
                    name="email"
                    placeholder="이메일 입력"
                    value={form.email}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="password">비밀번호</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="비밀번호 입력"
                    value={form.password}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="confirmPassword">비밀번호 확인</label>
                <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="비밀번호 재입력"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="name">이름</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="이름 입력"
                    value={form.name}
                    onChange={handleChange}
                    required
                />
                {error && <p className="error-message">{error}</p>}
                <button type="submit">회원가입</button>
                <p onClick={() => navigate("/login")} className="login-link">
                    이미 계정이 있으신가요? <span>로그인</span>
                </p>
            </form>
        </div>
    );
}

export default Register;
