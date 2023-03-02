import { useState } from "react";
import { Button, Form } from "react-bootstrap";

import { useLogin } from "../hooks/useLogin";

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
          <Form.Label>Email address</Form.Label>
          <Form.Control
            size='lg'
            type='email'
            placeholder='Enter email'
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </Form.Group>

        <Form.Group className='mb-3' controlId='formBasicPassword'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            size='lg'
            type='password'
            placeholder='Password'
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          {/* <Form.Text className='text-muted'>Between 1 and 8 characters</Form.Text> */}
        </Form.Group>
        <Button disabled={isLoading} variant='btn btn-outline-dark' type='submit'>
          Login
        </Button>
      </Form>
      <h3 className='error-message-bottom'>{error && error}</h3>
    </article>
  );
};

export default LoginForm;
