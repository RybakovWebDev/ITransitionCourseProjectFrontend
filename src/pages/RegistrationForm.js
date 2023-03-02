import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { useAuthContext } from "../hooks/useAuthContext";
import { useLogin } from "../hooks/useLogin";
// import { useUsersContext } from "../hooks/useUsersContext";

const RegistrationForm = (props) => {
  const { dispatch } = useAuthContext();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([""]);
  const { login } = useLogin();

  const navigate = useNavigate();

  const _id = uuidv4();
  const admin = false;
  const likedItems = [];
  const status = true;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = { _id, email, name, password, admin, likedItems, status };

    const response = await fetch(`${process.env.REACT_APP_URI}/api/users`, {
      method: "POST",
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
      setEmptyFields([json.emptyFields]);
    }
    if (response.ok) {
      localStorage.setItem("user", JSON.stringify(json));

      setError(null);
      setEmptyFields([""]);

      navigate("/");
      dispatch({ type: "CREATE_USER", payload: json });

      await login(email, password);
    }
  };

  return (
    <article className='app-main-cont-logreg'>
      <Form onSubmit={handleSubmit}>
        <Form.Group className='mb-3' controlId='formBasicName'>
          <Form.Label>Desired name</Form.Label>
          <Form.Control
            size='lg'
            placeholder='Desired name'
            onChange={(e) => setName(e.target.value)}
            value={name}
            className={emptyFields.includes("name") ? `field-error` : ""}
          />
        </Form.Group>

        <Form.Group className='mb-3' controlId='formBasicEmail'>
          <Form.Label>Email address</Form.Label>
          <Form.Control
            size='lg'
            type='email'
            placeholder='Enter email'
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className={emptyFields.includes("email") ? `field-error` : ""}
          />
        </Form.Group>

        <Form.Group className='mb-3' controlId='formBasicPassword'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            size='lg'
            type='password'
            placeholder='Enter password'
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className={emptyFields.includes("password") ? `field-error` : ""}
          />
          <Form.Text className='password-description'>At least 4 characters.</Form.Text>
        </Form.Group>
        <Button variant='btn btn-outline-dark' type='submit'>
          Register
        </Button>
      </Form>
      <h3 className='error-message-bottom'>{error && error}</h3>
    </article>
  );
};

export default RegistrationForm;
