import { useNavigate } from "react-router-dom";
import { Avatar } from "@mui/material";

export default function ListaPessoas(props) {

    const navigate = useNavigate();

    const usuarios = props.usuarios;

    return (
        <div className="Lista-Pessoas">

            <div id="Lista-Pessoas-Tipo">
                <span>{props.tipo}</span>
            </div>
            

            <div id="Lista-Pessoas-Itens">
                {usuarios.map((usuario) => {
                    return (

                        <div key={usuario.user} onClick={() => navigate(`/${usuario.user}`)} className="Lista-Pessoas-Item">
                            <Avatar src={usuario.photoURL}></Avatar>
                            <span>{usuario.user}</span>
                        </div>


                    )
                })}
            </div>

        </div>
    )

}