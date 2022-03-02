import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import StarRatings from "react-star-ratings";
import Snack from "../components/Snack";
import Yorum from "../components/Yorum";

function Urun({ context,yorum,siparis }) {
  const [counter, setCounter] = useState(1);
  const [snack, setSnack] = useState(false);
  const [snackText, setSnackText] = useState(false);
  const [siparisNotu, setSiparisNotu] = useState("");
  const [urunler, setUrunler] = useState(null);
  const [yorumlar, setYorumlar] = useState(null);
  const [yorumMode, setYorumMode] = useState(false);
  const [userYorum, setUserYorum] = useState("");
  const [malzemePopup,setMalzemePopup] = useState(false)
  const [star, setStart] = useState(3)
  var a = [];

  let { id,restoran } = useParams();

  function generateKey(){
    return `${Math.random()}_${new Date().getMinutes()}:${new Date()}_${Math.random()}`.split(" ").join("")
  }

  function yorumGonder() {
    if (userYorum != "") {
      axios
        .post("/restoran/yorumlar/" + id, {
          yorum: userYorum,
          yildiz: star,
          slug: restoran
        })
        .then((res) => {
          if (res.status == 201) {
            setSnack(true);
            setSnackText("Yorumunuz alındı!");
            setSnack(true);
            setYorumMode(false);
            setUserYorum("");
            setTimeout(() => {
            setSnack(false);
            }, 2000);
          }
        });
    } else {
      alert("Boş yorum gönderilemez");
    }
  }

  useEffect(() => {
    axios.get("/restoran/urun/" + id).then((res) => {
      setUrunler(res.data[0]);
    });

    axios.get("/restoran/yorumlar/" + id + "?limit=3").then((res) => {
      setYorumlar(res.data);
    });
  }, []);

  return (
    <div className="urun-detay gir">
      {snack ? <Snack text={snackText} /> : ""}

      <div className="kutu w-90 mx-auto mt-3 p-2">
        <div className="header-img">
          {urunler ? (
            <img src={urunler.resim} className="br-8 img-fluid" alt="" />
          ) : (
            <div className="skeleton-box h-97"></div>
          )}
        </div>

        <div className="urun-baslik mt-3 fs-4">
          {urunler ? urunler.isim : <div className="skeleton-box"></div>}
        </div>
        <div className="urun-aciklama">
          {urunler ? urunler.aciklama : <div className="skeleton-box"></div>}
        </div>
        <div className="fw-bold fs-5 d-flex justify-content-between text-mavi">
          {urunler ? (
            <div className="d-flex align-items-center  ">
              <i className="gg-alarm me-2"></i> {urunler.sure} dakika
            </div>
          ) : (
            <div className="skeleton-box w-25  "></div>
          )}{" "}
          {urunler ? (
            counter * Number(urunler.fiyat) + " TL"
          ) : (
            <div className="skeleton-box w-25 "></div>
          )}
        </div>

            {siparis == "true" ? 
        <div className="d-flex justify-content-between align-items-center">
         {urunler ? <>
         
          <div className="d-flex">
            <div className="counter d-flex">
              <button
                className="cbtn button-red"
                onClick={() => {
                  if (counter > 1) {
                    setCounter(counter - 1);
                  }
                }}
              >
                {" "}
                -
              </button>
              <div className="kac">{counter}</div>
              <button
                className="cbtn sagx button-yesil"
                onClick={() => {
                  setCounter(counter + 1);
                }}
              >
                +
              </button>
            </div>
          </div>

          <button
            className="button button-mavi ms-auto"
            onClick={() => {
              context({
                isim: urunler && urunler.isim,
                foto: urunler && urunler.resim,
                id: urunler && urunler.id,
                fiyat: urunler && urunler.fiyat,
                subtotal: counter * Number(urunler && urunler.fiyat),
                adet: counter,
                not: siparisNotu,
                key: generateKey(),
                nere: restoran,
                masa: localStorage.getItem("masa_no"),
                
              });
              setSnackText("Sepete eklendi");
              setSnack(true);
              setTimeout(() => {
                setSnack(false);
              }, 2000);
              setSiparisNotu("");

              /*axios.post("/sepet/ekle",{
                  isim: urunler && urunler.isim,
                  foto:urunler && urunler.resim,
                  id:urunler && urunler.id,
                  fiyat:urunler && urunler.fiyat,
                  subtotal:counter * Number(urunler && urunler.fiyat),
                  adet:counter,
                  not:siparisNotu
                })*/
            }}
          >
            Ekle
          </button>
          </> : <div className="d-flex justify-content-between">
          <div className="skeleton-box w-25 "></div>
          <div className="skeleton-box w-25 "></div>
          </div> }
          <div className="conneection">
           
          </div>
        </div> : "" }
        <div className="mt-3">


            {siparis == "true" && urunler && urunler.malzemeler != "" ? 
          
          /* <div className="option mb-3"  onClick={()=>{setMalzemePopup(true)}}>
          
          <svg  viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.8284 12L16.2426 13.4142L19.071 10.5858C20.6331 9.02365 20.6331 6.49099 19.071 4.9289C17.509 3.3668 14.9763 3.3668 13.4142 4.9289L10.5858 7.75732L12 9.17154L14.8284 6.34311C15.6095 5.56206 16.8758 5.56206 17.6568 6.34311C18.4379 7.12416 18.4379 8.39049 17.6568 9.17154L14.8284 12Z" fill="currentColor" /><path d="M12 14.8285L13.4142 16.2427L10.5858 19.0711C9.02372 20.6332 6.49106 20.6332 4.92896 19.0711C3.36686 17.509 3.36686 14.9764 4.92896 13.4143L7.75739 10.5858L9.1716 12L6.34317 14.8285C5.56212 15.6095 5.56212 16.8758 6.34317 17.6569C7.12422 18.4379 8.39055 18.4379 9.1716 17.6569L12 14.8285Z" fill="currentColor" /><path d="M14.8285 10.5857C15.219 10.1952 15.219 9.56199 14.8285 9.17147C14.4379 8.78094 13.8048 8.78094 13.4142 9.17147L9.1716 13.4141C8.78107 13.8046 8.78107 14.4378 9.1716 14.8283C9.56212 15.2188 10.1953 15.2188 10.5858 14.8283L14.8285 10.5857Z" fill="currentColor" /></svg>
            <div>İstemedikleriniz</div>
          </div> */ 

          <div className="mb-3 ">
            <h6 className="mb-0">Malzemeler</h6>
            <p translate="no" className="subtitle text-secondary fs-7 mb-1">Çıkarmak istediğiniz malzemeleri seçiniz</p>
            <div className="d-flex option-scroll">
              {
                urunler && urunler.malzemeler.split(",").map((val,i)=>{
                  return(<div onClick={e=>{
                    if(e.target.dataset.checked == "no"){
                      e.target.classList.add("active")
                      e.target.dataset.checked = "yes" 
                    }else{
                      e.target.dataset.checked = "no";
                      e.target.classList.remove("active")
                    }
                  }} key={i} data-checked="no" className="malzeme-option">{val}</div>                  )
                }) }
             
            </div>
          </div>

          :""}
          


        </div>
        {siparis == "true" ?
       
        <div className="mt-1">
          <textarea
            placeholder="Sipariş ile ilgili notlarınız yazabilirsiniz"
            cols="30"
            rows="3"
            value= {siparisNotu}
            onChange={(e) => setSiparisNotu(e.target.value)}
          >
           
          </textarea>
        </div> : "" }
      </div>

      {yorum == "true" ? 

      <div className="kutu w-90 mx-auto mt-3 p-2">
        <div className="d-flex align-items-center justify-content-between">
          <div className="fs-5 text-mavi">Yorumlar</div>
          <button
            onClick={() => setYorumMode(!yorumMode)}
            className="button button-mavi"
          >
            {!yorumMode ? (
              <>
                {" "}
                <i className="gg-math-plus"></i>
                Yaz
              </>
            ) : (
              <>
                <i className="gg-close"></i> İptal
              </>
            )}
          </button>
        </div>

        {yorumMode ? (
          <div className="yorum-yaz nav-inx">
             
        
            <textarea
              onChange={(e) => {
                setUserYorum(e.target.value);
              }}
              id=""
              cols="30"
              rows="3"
              className="mt-3"
              placeholder="Yorumunuzu giriniz"
            >
              {userYorum}
            </textarea>
            <div className="d-flex justify-content-end mb-3">
            <StarRatings
          rating={star}
          starRatedColor="#f1c40f"
          starRatedColor="#f1c40f"
          starHoverColor="#f1c40f"
          changeRating={(rating)=>setStart(rating)}
          starDimension="30px"
          starSpacing="5px"
          numberOfStars={5}
          name='rating'
        />
            </div>
            <button
              className="button button-mavi ms-auto"
              onClick={() => yorumGonder()}
            >
              Gönder
            </button>
          </div>
        ) : (
          ""
        )}
        {yorumlar && yorumlar.length == 0 ? (
          <div className="text-center my-2">Henüz bir yorum yazılmamış.</div>
        ) : (
          ""
        )}
        {yorumlar &&
          yorumlar.map((val) => {
            return <Yorum yorum={val.yorum} key={val.id} />;
          })}

        <Link
          to={"/yorum/" + restoran + "/" + id}
          className="text-center d-flex justify-content-center outline-button mx-auto mt-2"
        >
          Tümünü Göster
        </Link>
      </div>

      : "" }


      <div className="kutu w-90 mx-auto mt-3 p-2">
        <h6 className="text-mavi">Benzer ürünler</h6>
        <div className="kucuk-grid  p-0  mt-3">
{
        urunler && urunler.other.map((val,i)=>{
           return(
            <Link key={val.id} to={`/redirect/${val.id}/${restoran}`}  className="kucuk-urun p-2 kutu ">
            <div className="sol">
              <img
                src={val.resim}
                alt={val.isim}
              />
            </div>
            <div className="sag">
              <div className="kategori text-uppercase ">{val.anchor}</div>
              <div className="isim">{val.isim}</div>
              <div className="aciklama">
                 {val.aciklama}
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <div className="fiyat">{val.fiyat} TL</div>
              </div>
            </div>
          </Link>
          )
        })
      }
</div>
    
      </div>

      
    </div>
  );
}

export default Urun;
