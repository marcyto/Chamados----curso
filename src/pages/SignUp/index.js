
import { useState, useContext } from "react";
import logo from '../../assets/logo.png'
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/auth";

export default function SignUp(){

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    
    const {signUp, loadingAuth} = useContext(AuthContext);

    async function handleSubmit(e){
        e.preventDefault();

        if(name !== '' && email !== '' && password !== ''){
            await signUp(name, email, password);
        }

    }

    return(
        <div className='container-center'>
            <div className='login'>
                <div className='login-area'>
                    <img src={logo} alt="Logo do sistema de chamados"/>
                </div>
                <form onSubmit={handleSubmit}>
                    <h1>Novo Cadastro</h1>
                    
                    <input type="text" placeholder='Digite seu nome' onChange={(e) => setName(e.target.value)}/>
                    <input type="text" placeholder='Digite seu email' onChange={(e) => setEmail(e.target.value)}/>
                    <input type="password" placeholder='Digite uma senha' onChange={(e) => setPassword(e.target.value)}/>
                    <button type="submit">
                        {loadingAuth ? 'Carregando...' : 'Cadastrar'}
                    </button>

                </form>

                <Link to="/">Ja possui uma conta? Faça login</Link>
            </div>
            
        </div>
    );
}