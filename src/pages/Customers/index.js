import { FiUser } from "react-icons/fi";
import Header from "../../components/header";
import Title from "../../components/title";
import { useState } from "react";
import { db } from "../../services/firebaseconnection";
import {addDoc, collection} from 'firebase/firestore';

import {toast} from 'react-toastify';

export default function Customers(){

    const [nome, setNome] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [endereco, setEndereco] = useState('');

    async function handleRegister(e){
        e.preventDefault();

        if(nome !== '' && cnpj !== '' && endereco !== ''){
            await addDoc(collection(db, "Customers"), {
                nomeFantasia: nome,
                cnpj: cnpj,
                endereco:endereco
            })
            .then(()=>{
                setNome('');
                setCnpj('');
                setEndereco('');
                toast.success("Empresa cadastrada com sucesso!")
            })
            .catch((error) =>{
                toast.error("Ops, algo deu errado, tente novamente");
            })
        }else{
            toast.error("Algo deu errado...Preencha todos os campos!")
        }
    }
    return(
        <div>
            <Header/>
            <div className="content">
                <Title name="Clientes">
                    <FiUser size={25}/>
                </Title>
                <div className="container">
                    <form onSubmit={handleRegister} className="form-profile">
                        <label>Nome Fantasia</label>
                        <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome da Empresa"/>

                        <label>Cnpj</label>
                        <input type="text" value={cnpj} onChange={(e) => setCnpj(e.target.value)} placeholder="Cnpj"/>

                        <label>Endereço</label>
                        <input type="text" value={endereco} onChange={(e) => setEndereco(e.target.value)} placeholder="Endereço"/>
                        
                        <button type="submit">Salvar</button>

                    </form>
                </div>

            </div>
        </div>
    );
}