import React,{useEffect, useState} from "react";
import { useHistory, useLocation, useParams } from "react-router-dom/cjs/react-router-dom.min";
import axios from "axios"
import socketIOClient from "socket.io-client";

function Odeme() {
  const [tab,setTab] = useState(1)
  const [ikramlar, setIkramlar] = useState(null);

  let location = useLocation()
  let history = useHistory()
  let {restoran,key} = useParams()
  const [ikram, setIkram] = useState("");

  const [ok, setOk] = useState(false)
  function tamamlandi(){
    console.log(key)
    axios.post("/siparis/onay",{
      key:key
    }).then(res=>{
      console.log(res.data)
      const socket = socketIOClient("http://192.168.1.80:3050/");
      socket.emit("input paket")
    })
  }
  useEffect(()=>{
    console.log(location)
    axios.get("/restoran/ikramlar/" + restoran).then((res) => {
      setIkramlar(res.data);
    });


    if(location.search.includes("?tab=1") ){
      setTab(1)
    }

    if(location.search.includes("?tab=2")){
      setTab(2)
    }
  },[])
  return (
    <div className="odeme-sayfa gir">

      <div className="kutu w-90 mx-auto mt-3 py-2 px-2">
        <h4 className="fw-bold mb-0 p-0 d-flex center-y">
          <i className="gg-credit-card me-1"></i>Ödeme
        </h4>
      </div>
    
{ok ? (
  <>
        <div className="kutu w-90 mx-auto mt-3 p-2 siparis-verildi d-flex flex-column justify-content-center align-items-center">
          <svg
            fill="#3AC76A"
            xmlns="http://www.w3.org/2000/svg"
            width="80"
            height="80"
            viewBox="0 0 24 24"
          >
            <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-1.959 17l-4.5-4.319 1.395-1.435 3.08 2.937 7.021-7.183 1.422 1.409-8.418 8.591z" />
          </svg>
          <h5 className="mt-3" style={{ color: "#3AC76A" }}>
            Siparişiniz Alındı
          </h5>
          <p className="text-center text-secondary">
            En kısa sürede siparişinizi ulaştıracağız
          </p>
        </div>

        <div className="kutu w-90 mx-auto mt-3 p-2 ">
        <h6 className="mb-0">İkram Seç</h6>
                <p className="fs-7 text-secondary">
                  Dilerseniz ikram seçebilirsiniz
                </p>

                {ikramlar && ikramlar.length > 0 ? (
                <>
                <div onChange={(e) => {
                setIkram("SİPARİŞ İKRAMI: " + e.target.value);
              }}>
                  <div className="form-check">
                    <input
                      value={""}
                      className="form-check-input"
                      type="radio"
                      name="flexRadioDefault"
                      id="flexRadioDefault0"
                      defaultChecked
                    />
                    <label
                      className="form-check-label"
                      htmlFor="flexRadioDefault0"
                    >
                      İstemiyorum
                    </label>
                  </div>
                  {ikramlar.map((val) => {
                    return (
                      <div className="form-check" key={val.id}>
                        <input
                          value={val.isim}
                          className={`form-check-input`}
                          type="radio"
                          name="flexRadioDefault"
                          id={`flexRadioDefault${val.id}`}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`flexRadioDefault${val.id}`}
                        >
                          {val.isim}
                        </label>
                      </div>
                    );
                  })}
</div>
<div className="d-flex">
        
              <button
                className=" mt-2   button button-mavi"
                onClick={() =>{

                  if (ikram != "SİPARİŞ İKRAMI: İstemiyorum") {
                    axios
                      .post("/istek", {
                        masa: localStorage.getItem("masa_no"),
                        istek: ikram,
                        slug: restoran
                      })
                      .then((res) => {
                        const socket = socketIOClient("http://192.168.1.80:3050/");
                        socket.emit("input istek")
                        history.push("/kategoriler/"+restoran)

                      });
                  }
                }}
              >
                Tamam
              </button>
            </div>
                </>
              ) : (
                ""
              )}
        </div>
        </>
      ) :
      <div className="kutu w-90 mx-auto mt-3 py-2 px-2">
        <div className="emir-tab">
          <ul>
            <li className={tab == 1 ? "active" : ""} onClick={()=>setTab(1)} ><i className="gg-bolt"></i>Online</li>
            <li  className={tab == 2 ? "active" : ""} onClick={()=>setTab(2)}><i className="gg-credit-card"></i>Diğer</li>
          </ul>

          {tab == 1 ? 
          <div className="tab-icerik-1 mt-2">
            <form>
              <input type="text" placeholder="Card Number" />
              <div className="d-flex justify-content-between">
               
                <input type="text" placeholder="SKT" />

                 <input type="text" placeholder="CVV" />

              
              </div>
            </form>
            <button onClick={()=>{
              setOk(true)
              tamamlandi()
            }} className="button-mavi button ms-auto">Öde</button>
          </div> : "" }

          
          {tab == 2 ? 
          <div className="tab-icerik-1 mt-2">
           <p className="text-center">Hesabı isteyerek nakit veya kredi kartı ile ödeyebilirsiniz .</p>
            <button className="button-mavi button mx-auto">Hesabı İste</button>
          </div> : "" }
        </div>
      </div>
       }
    </div>
  );
}

export default Odeme;
