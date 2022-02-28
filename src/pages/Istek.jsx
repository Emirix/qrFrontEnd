import axios from "axios";
import React,{useEffect,useState} from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import Snack from "../components/Snack";
import socketIOClient from "socket.io-client";

function Istek() {

  const [mode,setMode] = useState(0)
  const [snack,setSnack] = useState(false);
  const [snackText,setSnackText] = useState("");
  const [kisayollar, setKisayollar] = useState(null);

  let {restoran} = useParams()


  function garsonCagir(){
    setSnackText("Garson yolda!")
    setSnack(true)
    setTimeout(()=>{
      setSnack(false);
    },2000)
  }

  function istek(){
    setSnackText("İsteğiniz Alındı!")
    setSnack(true)
    setTimeout(()=>{
      setSnack(false);
    },2000)
  }

  useEffect(()=>{
    axios.get("/restoran/kisayollar/"+restoran).then(res=>{
      console.log(res.data)
      setKisayollar(res.data)
    })
  },[])

  function submit(e,st = e.target[0].value){
    e?.preventDefault();

    const socket = socketIOClient("http://192.168.1.80:3050/");

    if(st != ""){
    axios.post("/istek",{
      masa: localStorage.getItem("masa_no"),
      istek:st,
      slug:restoran
    }).then(res=>{
      console.log(res)
      
      socket.emit("input istek")
      istek()

        e.target[0].value = "" 
     
    })
  }
  }
  


  return (
    <div className="istek-sayfa gir">
       {snack ? <Snack text={snackText}/> : ""}

      <div className="kutu w-90 mx-auto mt-3 py-2 px-2 d-flex justify-content-between align-items-center">
        <h4 className="fw-bold mb-0 p-0 d-flex center-y"><i className="gg-bell me-1"></i>İstek</h4>
        <button onClick={()=>submit(null,"Garson çağırma")}   className="button-yesil button"><i className="gg-bell"></i>Garson Çağır</button>
      
      </div>

      <div className="kutu w-90 mx-auto mt-3 py-2 px-2">
        <form onSubmit={(e)=>submit(e)}>
          <h6>Ne istersiniz?</h6>
          <textarea placeholder="Lütfen isteklerinizi giriniz"  id="" cols="30" rows="2"></textarea>
         <div className="d-flex">
         <button className="button-gri button me-2 flex-fill"><i className="gg-close"></i>İptal</button>
          <button className="button-mavi button flex-fill"><i className="gg-arrow-right"></i>Gönder</button>
         </div>
        </form>
      </div>

      <div className="kutu w-90 mx-auto mt-3 py-2 px-2">
        <div className="istekler">
          <h6>Kısayollar</h6>


        {kisayollar && kisayollar.map(val=>{
          return(
            <div className="istek" key={val.id} onClick={()=>submit(null,val.text)}>
          <div className="d-flex align-items-center" >
            <i className="gg-math-plus"></i>{val.text}
          </div>
        </div>
          )
        })}
         

                  

        
         
        </div>
      </div>
    </div>
  );
}

export default Istek;
