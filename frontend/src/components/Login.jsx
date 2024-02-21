import "./login.css";
import { Place, Cancel } from "@material-ui/icons";
import { useState, useRef } from "react";
import axios from "axios";

export default function Login({setShowLogin, myStorage, setCurrentUser}) {
	const [error, setError] = useState(false);
	const nameRef = useRef();
	const passwordRef = useRef();

	const handleSubmit = async (e) => {
		e.preventDefault();
		const user = {
			username: nameRef.current.value,
			password: passwordRef.current.value,
		};
		try {
			const res = await axios.post("/users/login", user);
			myStorage.setItem("user", res.data.username);
			setCurrentUser(res.data.username);
			setShowLogin(false);
			setError(false);
		} catch (err) {
			setError(true);
		}
	}

  return (
	<div className="loginContainer">
		<div className="logo">
			<Place style={{ marginBottom: '15px', fontSize: '32px' }} />
			<h1 style={{ marginBottom: '15px' }}>ExplorePin</h1>
		</div>
			<form onSubmit={handleSubmit}>
				<input type="text" placeholder="Username" ref={nameRef} />
				<input type="password" placeholder="Password" ref={passwordRef} />
				<button className="loginBtn">LOGIN</button>
				{ error &&
				<span className="failure">Something went wrong!</span>
				}
			</form>
			<Cancel className="loginCancel" onClick={()=>setShowLogin(false)}/>
		</div>
  );
};

