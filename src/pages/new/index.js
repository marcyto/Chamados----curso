import Header from "../../components/header";
import Title from "../../components/title";
import './new.css';
import {FiPlusCircle} from 'react-icons/fi'
import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
//import do banco de dados
import { db } from "../../services/firebaseconnection";
import { collection, getDocs, getDoc, addDoc, doc, updateDoc } from 'firebase/firestore';
//import do contexto
import { AuthContext } from "../../contexts/auth";
import { toast } from "react-toastify";


const listRef = collection(db, "Customers");

export default function New(){

    const {user} = useContext(AuthContext);
    const { id } = useParams();
    const navigate = useNavigate();

    const [customers, setCustomers] = useState([]);
    const [customerSelected, setCustomerSelected] = useState(0)
    const [loadCustomer, setLoadCustomer] = useState(true);
    const [idCustomer, setIdCustomer] = useState(false);
    const [complemento, setComplemento] = useState('');
    const [assunto, setAssunto] = useState('');
    const [status, setStatus] = useState('');

    useEffect(()=>{
        async function loadCustomers(){
            const querySnapshot = await getDocs(listRef)
            .then((snapshot)=>{
                let lista = [];

                snapshot.forEach((doc) =>{
                    lista.push({
                        id: doc.id,
                        nomeFantasia: doc.data().nomeFantasia
                    })
                })
                if(snapshot.docs.size === 0){
                    setCustomers([{id: '1', nomeFantasia: 'freela'}])
                    setLoadCustomer(false);
                    return;
                }
                
                setCustomers(lista);
                setLoadCustomer(false);
                if(id){
                    loadId(lista);
                }

            })
            .catch((error)=>{
                console.log(error)
                setLoadCustomer(false);
                setCustomers([{id: '1', nomeFantasia:'Freela'}])
            })
        }
        loadCustomers();
    }, [id])

    async function loadId(lista){
        const docRef = doc(db, "Chamados", id);
        await getDoc(docRef)
        .then((snapshot)=>{

            setAssunto(snapshot.data().assunto)
            setStatus(snapshot.data().status)
            setComplemento(snapshot.data().complemento)

            let index = lista.findIndex(item => item.id === snapshot.data().clienteId)

            setCustomerSelected(index);
            setIdCustomer(true);

        })
        .catch((error)=>{
            setIdCustomer(false);
        })

    }

    function handleOptionChange(e){
        setStatus(e.target.value);
    }
    function handleChangeSelect(e){
        setAssunto(e.target.value);
    }
    function handleCustomerChange(e){
        setCustomerSelected(e.target.value);
    }
    async function handleSubmit(e){
        e.preventDefault();

        if(idCustomer){
            const docRef = doc(db, "Chamados", id)
            await updateDoc(docRef, {
                cliente: customers[customerSelected].nomeFantasia,
                clienteId: customers[customerSelected].id,
                assunto: assunto,
                complemento: complemento,
                status: status,
                userId: user.uid
            })
            .then(()=>{
                toast.info("Chamado Atualizado com sucesso");
                setCustomerSelected(0);
                setComplemento('');
                navigate('/dashboard');
            })
            .catch((error) =>{
                console.log(error)
                toast.error("Ops, erro ao atualizar...")
            })

            return; 
        }

        //Registrar um chamado

        await addDoc(collection(db, "Chamados"), {
            created: new Date(),
            cliente: customers[customerSelected].nomeFantasia,
            clienteId: customers[customerSelected].id,
            assunto: assunto,
            complemento: complemento,
            status: status,
            userId: user.uid
        })
        .then(()=>{
            toast.success("Chamado Registrado")
            setComplemento('');
            setCustomerSelected(0);
        })
        .catch(()=>{
            toast.error("Algo deu errado, tente mais tarde!")
        })

    }

    return(
        <div>
            <Header/>
            <div className="content">
                <Title name={id ? "Editando chamado" : "Novo chamado"}>
                    <FiPlusCircle size={25}/>
                </Title>
                <div className="container">
                    <form onSubmit={handleSubmit} className="form-profile">

                        <label>Clientes</label>
                        {
                            loadCustomer ? (
                                <input type="text" disabled={true} value="Carregando..."/>
                            ) : (
                                <select value={customerSelected} onChange={handleCustomerChange}>
                                    {
                                        customers.map((item, index)=> {
                                            return(
                                                <option key={index} value={index}>
                                                    {item.nomeFantasia}
                                                </option>
                                            )
                                        })
                                    }
                                </select>
                            )
                        }

                        <label>Assunto</label>
                        <select value={assunto} onChange={handleChangeSelect}>
                            <option key={1} value={"Suporte"}>Suporte</option>
                            <option key={2} value={"Visita Tecnica"}>Visita Tecnica</option>
                            <option key={3} value={"Financeiro"}>Financeiro</option>
                        </select>
                        
                        <label>Status</label>
                        <div className="status">
                            <input
                                type="radio"
                                name="radio"
                                value="Aberto"
                                onChange={handleOptionChange}
                                checked={status === 'Aberto'}
                            />
                            <span>Aberto</span>
                            <input
                                type="radio"
                                name="radio"
                                value="Progresso"
                                onChange={handleOptionChange}
                                checked={status === 'Progresso'}
                            />
                            <span>Progresso</span>
                            <input
                                type="radio"
                                name="radio"
                                value="Atendido"
                                onChange={handleOptionChange}
                                checked={status === 'Atendido'}
                            />
                            <span>Atendido</span>
                        </div>

                        <label>Complemento</label>
                        <textarea
                            type="text"
                            placeholder="Descreva seu problema (opcional)"
                            value={complemento}
                            onChange={(e)=> setComplemento(e.target.value)}
                        />

                        <button type="submit">Registrar</button>
                    </form>

                </div>
            </div>
        </div>
    )
}