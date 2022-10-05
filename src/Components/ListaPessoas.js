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

                    var link = `https://firebasestorage.googleapis.com/v0/b/projeto-instagram-93637.appspot.com/o/avatar%2F${usuario}%2F${usuario}?alt=media`;

                    return (

                        <div key={usuario} onClick={() => navigate(`/${usuario}`)} className="Lista-Pessoas-Item">
                            <Avatar src={link}/>
                            <span>{usuario}</span>
                        </div>


                    )
                })}
            </div>

        </div>
    )

}