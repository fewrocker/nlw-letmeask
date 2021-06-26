import { useState } from "react"
import { useParams } from "react-router-dom"
import logoImg from "../assets/images/logo.svg"
import deleteIcon from "../assets/images/delete.svg"
import { Button } from "../components/Button"
import { Question } from "../components/Question"
import { RoomCode } from "../components/RoomCode"
import { useAuth } from "../hooks/useAuth"
import { useRoom } from "../hooks/useRoom"
import { database } from "../services/firebase"
import "../styles/room.scss"

type RoomParams = {
	id: string;
}
export function AdminRoom() {
	const { user } = useAuth();
	const params = useParams<RoomParams>();
	const roomId = params.id
	const [ newQuestion, setNewQuestion ] = useState('')
	const { questions, title } = useRoom(roomId)

	async function handleDeleteQuestion(questionId: string) {
		if (window.confirm("Você tem certeza que deseja excluir essa pergunta?")) {
			const questionRef = await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
		}
	}

	return (
		<div id="page-room">
			<header>
				<div className="content">
					<img src={logoImg} alt="Logo da LetmeAsk" />
					<div className="room-header-controls">
						<RoomCode code={roomId}></RoomCode>
						<Button isOutlined>Encerrar sala</Button>
					</div>
				</div>
			</header>
			<main className="content">
				<div className="room-title">
					<h1>Sala {title}</h1>
					{
						questions.length > 0 && <span>{questions.length} perguntas</span>
					}
				</div>

				<div className="question-list">
					{
						!!questions.length && questions.map((question) => {
							return (
								<Question content={question.content} author={question.author} key={question.id}>
									<button
										type="button"
										onClick={() => handleDeleteQuestion(question.id)}>
											<img src={deleteIcon} alt="" />
										</button>
								</Question>
							)
						})
					}
				</div>
			</main>
		</div>
	)
}
