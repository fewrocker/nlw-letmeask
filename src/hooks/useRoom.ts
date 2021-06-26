import { useEffect, useState } from "react";
import { database } from "../services/firebase";
import { useAuth } from "./useAuth";

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
type FirebaseQuestions = Record<string, {
	author: {
		name: string,
		avatar: string,
	},
	content: string,
	isAnswered: boolean,
	isHighlighted: boolean,
	likes: Record<string, {
		authorId: string,
		id: string,
	}>,
	userLikeId: string | undefined,
}>

export function useRoom(roomId: string) {
	const [ questions, setQuestions ] = useState<Question[]>([])
	const [ title, setTitle ] = useState('');
	const { user } = useAuth();

	useEffect(() => {
		const roomRef = database.ref(`rooms/${roomId}`)
		roomRef.on('value', room => {
			const databaseRoom = room.val();
			if (!databaseRoom.questions) return;
			const firebaseQuestions : FirebaseQuestions = databaseRoom.questions;

			const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => { 
				return {
					id: key,
					content: value.content,
					author: value.author,
					isHighlighted: value.isHighlighted,
					isAnswered: value.isAnswered,
					likeCount: Object.values(value.likes ?? {}).length,
					userLikeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0]
				}
			 })

			 setQuestions(parsedQuestions);
			 setTitle(databaseRoom.title)
		})

		return () => roomRef.off('value');
	}, [roomId, user?.id])

	return { questions, title }
}
