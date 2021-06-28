import { ReactNode } from "react"
import "../styles/room.scss"
import classNames from 'classnames';

type QuestionProps = {
	content: string,
	author: {
		name: string,
		avatar: string,
	},
	children?: ReactNode,
	isAnswered?: boolean,
	isHighlighted?: boolean,
}

export function Question ({
	content,
	author,
	isAnswered = false,
	isHighlighted = false,
	children
}: QuestionProps) {
	return (
		<div className={classNames(
			'each-question',
			{ 'answered': isAnswered	},
			{ 'highlighted': isHighlighted && !isAnswered	},
		)}>
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
