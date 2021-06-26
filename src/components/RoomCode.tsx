import CopyImg from '../assets/images/copy.svg'

import "../styles/room-code.scss"

type RoomProps = {
	code: string;
}

export function RoomCode(props: RoomProps) {
	function copyRoomCodeToClipboard() {
		navigator.clipboard.writeText(props.code)
	}

	return (
		<button className="room-code" onClick={copyRoomCodeToClipboard}>
			<div>
				<img src={CopyImg} alt="Copiar código da sala" />
			</div>
			<span>Sala {props.code}</span>
		</button>
	)
}
