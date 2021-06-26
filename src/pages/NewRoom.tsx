import { Link, useHistory } from 'react-router-dom'

import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'

import "../styles/auth.scss"
import { Button } from '../components/Button'
import { FormEvent, useState } from 'react'
import { database } from "../services/firebase";
import { useAuth } from '../hooks/useAuth'
import { Header } from "../components/Header"

export function NewRoom () {
	const [ newRoomName, setNewRoomName ] = useState('');
	const { user } = useAuth();
	const history = useHistory();

	async function createRoom(event: FormEvent) {
		event.preventDefault();

		const trimmedRoomName = newRoomName.trim()
		if (!trimmedRoomName) {
			return;
		}

		const roomRef = database.ref('rooms');
		const firebaseRoom = await roomRef.push({
			title: trimmedRoomName,
			authorId: user?.id,
		})

		history.push(`/rooms/${firebaseRoom.key}`)
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
					<h2>Criar uma nova sala</h2>
					<form onSubmit={createRoom}>
						<input 
							type="text"
							placeholder="Nome da sala" 
							onChange={e => setNewRoomName(e.target.value)}
							value={newRoomName}
						/>
						<Button type="submit">
							Criar sala
						</Button>
					</form>
					<p>Quer entrar em uma sala existente? <Link to="/">Clique aqui</Link></p>
				</div>
			</main>
		</div>
	)
}
