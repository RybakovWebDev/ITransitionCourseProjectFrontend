import { useState } from "react";
import { Button, Form } from "react-bootstrap";

import { useLogin } from "../hooks/useLogin";

const lang = localStorage.getItem("language") || "eng";

const LoginForm = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, error, isLoading } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email.toLowerCase(), password.trim());
  };

  return (
    <article className='app-main-cont-logreg'>
      <Form onSubmit={handleSubmit}>
        <Form.Group className='mb-3' controlId='formBasicEmail'>
          <Form.Label>{lang === "eng" ? "Email address" : "Электронная почта"}</Form.Label>
          <Form.Control
            size='lg'
            type='email'
            placeholder={lang === "eng" ? "Enter email" : "Введите почту"}
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </Form.Group>

        <Form.Group className='mb-3' controlId='formBasicPassword'>
          <Form.Label>{lang === "eng" ? "Password" : "Пароль"}</Form.Label>
          <Form.Control
            size='lg'
            type='password'
            placeholder={lang === "eng" ? "Enter password" : "Введите пароль"}
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </Form.Group>
        <Button disabled={isLoading} variant='btn btn-outline-dark' type='submit'>
          {lang === "eng" ? "Login" : "Войти"}
        </Button>
      </Form>
      <h3 className='error-message-bottom'>{error && error}</h3>
    </article>
  );
};

export default LoginForm;
