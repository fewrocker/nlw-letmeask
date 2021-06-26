import { ReactNode } from "react"
import "../styles/room.scss"

type QuestionProps = {
	content: string,
	author: {
		name: string,
		avatar: string,
	},
	children?: ReactNode,
}

export function Question ({
	content,
	author,
	children
}: QuestionProps) {
	return (
		<div className="each-question">
		<p className="content">{content}</p>
		<div className="question-footer">
			<div className="user-info">
				<img src={author.avatar} alt="Avatar do usuário" />
				<span>{author.name}</span>
			</div>
			<div className="question-commands">
				{ children }
			</div>
		</div>
	</div>
	)
}
