import axios from 'axios';
import React,{useEffect,useState} from 'react';
import { useParams } from 'react-router-dom';
import Snack from '../components/Snack';
import Yorum from '../components/Yorum';

function Urun() {
    const [counter, setCounter] = useState(1);
    const [snack,setSnack] = useState(false);
    const [snackText,setSnackText] = useState(false);
    const [siparisNotu,setSiparisNotu] = useState("")
    const [urunler,setUrunler] = useState(null)
    const [yorumlar, setYorumlar] = useState(null);
    const [yorumMode,setYorumMode] = useState(false)
    const [userYorum,setUserYorum] = useState("")

    let {id} = useParams()

    function yorumGonder(){
        if(userYorum != ""){
            axios.post("/restoran/yorumlar/"+id,{
                yorum:userYorum
            }).then(res=>{
                if(res.status == 201) { 
                    setSnack(true); 
                    setSnackText("Yorumunuz alındı!")
                    setSnack(true)
                    setYorumMode(false)
                    setUserYorum("")
                    setTimeout(()=>{
                      setSnack(false);
                    },2000)
                } 
            })
        }else{
            alert("Boş yorum gönderilemez")
        }
        
    }

    useEffect(()=>{
        axios.get("/restoran/urun/"+id).then(res=>{
            setUrunler(res.data[0])
            console.log(res.data)
        })

        axios.get("/restoran/yorumlar/"+id+"?limit=3").then(res=>{
            setYorumlar(res.data)
            console.log(res.data)
        })
    },[])



  return <div className='urun-detay gir'>
                {snack ? <Snack text={snackText}/> : ""}

      <div className='kutu w-90 mx-auto mt-3 p-2'>
            <div className="d-flex align-items-center justify-content-between">
                <div className="fs-5 text-mavi">Yorumlar</div>
                <button onClick={()=>setYorumMode(!yorumMode)} className="button button-mavi">
                   
                    {!yorumMode ? <> <i className="gg-math-plus"></i>
                    Yaz</> : <><i className="gg-close"></i> İptal</>}
                </button>
            </div>

            {yorumMode ? 
            <div className="yorum-yaz nav-inx">
                <textarea onChange={e => {
                    setUserYorum(e.target.value)
                }} id="" cols="30" rows="3" className='mt-3' placeholder='Yorumunuzu giriniz'>
                {userYorum}
                </textarea>
                <button className="button button-mavi ms-auto" onClick={()=>yorumGonder()}>Gönder</button>
            </div> : "" }
            {yorumlar && yorumlar.length == 0 ? <div className='text-center my-2'>Henüz bir yorum yazılmamış.</div> : ""}
            {yorumlar && yorumlar.map(val=>{
                return(
                    <Yorum yorum={val.yorum} key={val.id} yildiz={val.star} />
                )
            })}
        
      </div>
  </div>
}

export default Urun;

