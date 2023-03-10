
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/auth";
import Header from "../../components/header";
import Title from "../../components/title";
import './dashboard.css';
import {FiSearch, FiPlus, FiMessageSquare, FiEdit} from 'react-icons/fi';
import { Link } from "react-router-dom";
import { db } from "../../services/firebaseconnection";
import { getDocs, collection, orderBy, startAfter, query, limit  } from "firebase/firestore";
import { format } from "date-fns";
import Modal from "../../components/modal";


const listRef = collection(db, "Chamados")

export default function Dashboard(){

    const {logout} = useContext(AuthContext);

    const [chamados, setChamados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEmpty, setIsEmpty] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [detailModal, setDetailModal] = useState([]);

    const [lastDocs, setLastDocs] = useState();
    const [loadingMore, setLoadingMore] = useState(false);

    async function handleLogout(){
        logout();
    }
    
    useEffect(()=>{
        async function loadChamados(){
            const q = query(listRef, orderBy('created', "desc"), limit(5))

            const querySnapshot = await getDocs(q)
            setChamados([]);
            await updateState(querySnapshot)
            setLoading(false)


        }
         loadChamados();

         return() => { }

    }, [])

    async function updateState(querySnapshot){
        const isCollectionEmpty = querySnapshot.size === 0;
        
        if(!isCollectionEmpty){
            let lista = []

            querySnapshot.forEach((doc) => {
                lista.push({
                    id: doc.id,
                    assunto: doc.data().assunto,
                    cliente: doc.data().cliente,
                    clienteId: doc.data().clienteId,
                    created: doc.data().created,
                    createdFormat: format(doc.data().created.toDate(), 'dd/MM/YYY'),
                    status: doc.data().status,
                    complemento: doc.data().complemento
                })
            })

            const lastDoc = querySnapshot.docs[querySnapshot.docs.length -1] // ultimo item renderizado

            setChamados(chamados => [...chamados, ...lista])
            setLastDocs(lastDoc);

        }else{
            setIsEmpty(true);
        }

        setLoadingMore(false);
    }

    if(loading){
        return(
            <div>
                <Header/>
                <div className="content">
                    <Title name="Chamados">
                        <FiMessageSquare size={25}/>
                    </Title>
                    <div className="container dashboard">
                        <span>Buscando chamados...</span>
                    </div>
                </div>
            </div>
        )
    }

    async function handleMore(){
        setLoadingMore(true);

        const q = query(listRef, orderBy('created', "desc"), startAfter(lastDocs), limit(5))
        const querySnapshot = await getDocs(q);
        await updateState(querySnapshot);
    }
    function toggleModal(item){
        setShowModal(!showModal);
        setDetailModal(item);
    }

    return(
        
        <div>
            <Header/>
            <div className="content">
                <Title name="Chamados">
                    <FiMessageSquare size={25}/>
                </Title>
                
                {chamados.length === 0 ? (
                    <div className="container dashboard">
                        <span>Nenhum chamado encontrado...</span>
                        <Link to="/new" className="new">
                            <FiPlus size={25}/>
                                Novo Chamado
                        </Link>

                    </div>

                ) : (
                    <>
                        <Link to="/new" className="new">
                            <FiPlus size={25}/>
                                Novo Chamado
                        </Link>
                        <table>
                        <thead>
                            <tr>
                                <th scope="col">Cliente</th>
                                <th scope="col">Assuntos</th>
                                <th scope="col">Status</th>
                                <th scope="col">Cadastrado em</th>
                                <th scope="col">#</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                chamados.map((item, index)=>{
                                    return(
                                        <tr key={index}>
                                            <td data-label="Cliente">{item.cliente}</td>
                                            <td data-label="Assuntos">{item.Suporte}</td>
                                            <td data-label="Status">
                                                <span className="badge" style={{backgroundColor: item.status === 'Aberto' ? '#5cb85c' : '#999'}}>
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td data-label="Cadastrado">{item.createdFormat}</td>
                                            <td data-label="#">
                                                <button onClick={() => toggleModal(item)} className="action" style={{backgroundColor: '#3583f6'}}><
                                                    FiSearch color="#FFF" size={17}/>
                                                </button>
                                                <Link to={`/new/${item.id}`} className="action" style={{backgroundColor: '#f6a935'}}>
                                                    <FiEdit color="#FFF" size={17}/>
                                                </Link>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                    {
                        loadingMore && <h3>Buscando mais Chamados...</h3>
                    }
                    {
                        !loadingMore && !isEmpty && <button className="btn_more" onClick={handleMore}>Buscar Mais</button>
                    }
                    
                    </>
                )}

                    
                   
                
                
            </div>
            
            {
                showModal && ( <Modal conteudo={detailModal} close={() => setShowModal(!showModal)}/> )
            }
            
        </div>
    );
}