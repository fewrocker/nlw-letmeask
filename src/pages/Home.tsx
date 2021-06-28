import { useHistory } from 'react-router-dom'

import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
import googleIconImage from '../assets/images/google-icon.svg'

import "../styles/auth.scss"
import { Button } from '../components/Button'
import { useAuth } from '../hooks/useAuth'
import { FormEvent, useState } from 'react'
import { database } from '../services/firebase'

export function Home () {
	const history = useHistory();
	const { user, signInWithGoogle } = useAuth();
	const [ roomCode, setRoomCode ] = useState('');

	async function signInAndGoToCreateRoom() {
		if (!user) {
			await signInWithGoogle();
		}
		history.push("/rooms/new")
	}

	async function handleJoinRoom(event: FormEvent) {
		event.preventDefault();

		if (!roomCode.trim()) return;

		const roomRef = await database.ref(`rooms/${roomCode}`).get();

		if (!roomRef.exists()) {
			alert("Room does not exist.");
			return;
		}

		history.push(`rooms/${roomCode}`);
	}

	return (
		<div id="page-auth">
			<aside>
				<img src={illustrationImg} alt="Ilustração simbolozando perguntas e respostas" id="home-illustration" />
				<strong>Crie salas de Q&amp;A ao vivo</strong>
				<p>Tire as dúvidas da sua audiência em tempo real</p>
			</aside>
			<main>
				<div className="main-content">
					<img src={logoImg} alt="Logo da aplicação Letmeask" />
					<button className="create-room" onClick={signInAndGoToCreateRoom}>
						<img src={googleIconImage} alt="Logo da Google" />
						Crie sua sala com o Google
					</button>
					<div className="separator"><span>Ou entre em uma sala</span></div>
					<form onSubmit={handleJoinRoom}>
						<input 
							type="text"
							placeholder="Digite o código da sala" 
							onChange={e => setRoomCode(e.target.value)}
							value={roomCode}
						/>
						<Button type="submit">
							Entrar na sala
						</Button>
					</form>
				</div>
			</main>
		</div>
	)
}
