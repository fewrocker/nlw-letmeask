import { useState } from "react"
import { useParams } from "react-router-dom"
import logoImg from "../assets/images/logo.svg"
import deleteIcon from "../assets/images/delete.svg"
import checkIcon from "../assets/images/check.svg"
import answerIcon from "../assets/images/answer.svg"
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
type Question = {
	id: string,
	author: {
		name: string,
		avatar: string,
	},
	content: string,
	isAnswered: boolean,
	isHighlighted: boolean,
	likeCount: number,
	userLikeId: string | undefined,
}
export function AdminRoom() {
	const { user } = useAuth();
	const params = useParams<RoomParams>();
	const roomId = params.id
	const [ newQuestion, setNewQuestion ] = useState('')
	const { questions, title } = useRoom(roomId)

	async function handleHighlightQuestion(question: Question) {
		await database.ref(`rooms/${roomId}/questions/${question.id}`).update({ isHighlighted: !question.isHighlighted });
	}

	async function handleMarkQuestionAsAnswered(question: Question) {
		await database.ref(`rooms/${roomId}/questions/${question.id}`).update({ isAnswered: !question.isAnswered  });
	}

	async function handleDeleteQuestion(questionId: string) {
		if (window.confirm("Você tem certeza que deseja excluir essa pergunta?")) {
			await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
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
								<Question 
									content={question.content}
									author={question.author} 
									isAnswered={question.isAnswered}
									isHighlighted={question.isHighlighted}
									key={question.id}>
									<div className="admin-controls">
										<button 
											className="like-button"
											type="button"
											aria-label="Marcar como gostei">
											<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
												<path d="M7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2L7 11V22H18.28C18.7623 22.0055 19.2304 21.8364 19.5979 21.524C19.9654 21.2116 20.2077 20.7769 20.28 20.3L21.66 11.3C21.7035 11.0134 21.6842 10.7207 21.6033 10.4423C21.5225 10.1638 21.3821 9.90629 21.1919 9.68751C21.0016 9.46873 20.7661 9.29393 20.5016 9.17522C20.2371 9.0565 19.9499 8.99672 19.66 9H14Z" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
											</svg>
											{ question.likeCount > 0 && <span>{question.likeCount}</span> }
										</button>
										<button
											type="button"
											onClick={() => handleMarkQuestionAsAnswered(question)}>
												<img src={answerIcon} alt="Marcar pergunta como respondida" />
										</button>
										<button
											type="button"
											onClick={() => handleHighlightQuestion(question)}>
												<img src={checkIcon} alt="Dar destaque à pergunta" />
										</button>
										<button
											type="button"
											onClick={() => handleDeleteQuestion(question.id)}>
												<img src={deleteIcon} alt="Apagar pergunta" />
										</button>
									</div>
								</Question>
							)
						})
					}
				</div>
			</main>
		</div>
	)
}
