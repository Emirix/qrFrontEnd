import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import Snack from "../components/Snack";
import { Link ,useHistory} from "react-router-dom";

export default function Menu({ context }) {
  const [counter, setCounter] = useState(1);
  const [snack, setSnack] = useState(false);
  const [view, setView] = useState(false);
  const [siparisNotu, setSiparisNotu] = useState("");
  const [urunler, setUrunler] = useState(null);
  const [string, setString] = useState("");
  const [design, setDesign] = useState(0);
  const [maxHeight, setMaxHeight] = useState(false);
  const [orderBy, setOrderBy] = useState("sure DESC");
  const [step, setStep] = useState(0)
  let history = useHistory()
  let { restoran } = useParams();

  const [kampanya, setKampanya] = useState(null)

  useEffect(() => {
    setUrunler(null);

    axios
      .get("/restoran/urunler/" + restoran + `?order=${orderBy || "sure DESC"}`)
      .then((res) => {
        setUrunler(res.data);
      });
  }, [orderBy]);

  useEffect(()=>{
    var inta = null;
    var i = 0;

    axios.get("/restoran/kampanya/"+restoran).then(res=>{
      if(res.data.length > 0){
        setKampanya(res.data)
        inta = setInterval(()=>{
          if(i < res.data.length-1){
            i++;
            setStep(i)
          }else{
            i = 0;
            setStep(0)
          }
            
        },1500)
      }
    })
    
    return () => clearInterval(inta);

  },[])

  function ara(e) {
    axios
      .get("/restoran/ara/" + restoran + "/?search=" + string)
      .then((res) => {});
  }

  return (
    <div className="menu-sayfa gir">
      {snack ? <Snack text={"Sepete eklendi"} /> : ""}

      <div className="kutu w-90 mx-auto mt-3 py-2 px-2">
        <h4 className="fw-bold mb-0 p-0">Ürünlerimiz</h4>
      </div>
      <div className="stick d-none kutu mt-2 w-90 mx-auto p-2">
        <div className="search  ">
          <div className="logo">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21.172 24L13.785 16.613C12.397 17.487 10.761 18 9 18C4.029 18 0 13.971 0 9C0 4.029 4.029 0 9 0C13.971 0 18 4.029 18 9C18 10.761 17.486 12.398 16.613 13.785L24 21.172L21.172 24ZM9 16C12.859 16 16 12.86 16 9C16 5.14 12.859 2 9 2C5.141 2 2 5.14 2 9C2 12.86 5.141 16 9 16Z"
                fill="#A4AAB4"
              />
            </svg>
          </div>
          <input
            className="flex-fill"
            type="text"
            value={string}
            onChange={(e) => setString(e.target.value)}
            placeholder="Ara"
          />

          {string != "" ? (
            <button
              onClick={(e) => {
                ara(e);
              }}
              className="p-1 px-3 button button-mavi nav-inx"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21.172 24L13.785 16.613C12.397 17.487 10.761 18 9 18C4.029 18 0 13.971 0 9C0 4.029 4.029 0 9 0C13.971 0 18 4.029 18 9C18 10.761 17.486 12.398 16.613 13.785L24 21.172L21.172 24ZM9 16C12.859 16 16 12.86 16 9C16 5.14 12.859 2 9 2C5.141 2 2 5.14 2 9C2 12.86 5.141 16 9 16Z"
                  fill="#fff"
                />
              </svg>
            </button>
          ) : (
            ""
          )}
        </div>
      </div>

      {
        kampanya == null ? <div className="skeleton-box mx-auto my-4" style={{height:200,width:"90% !important"}}></div> : 
   

      <div className="kampanya w-90 mx-auto mt-3 kutu ">
      <div className="kampanya__nav p-2 d-flex justify-content-between align-items-center bg-white">
        <h5 className="m-0">Tercih Ettiklerimiz</h5>
          <div className="d-flex">
            <button className="step-button" onClick={e=>{
              if(step > 0){
                setStep(step-1)
              }else{
                setStep(kampanya.length-1)
              }
            }}>
              <i className="bi bi-caret-left"></i>
            </button>
            <button className="ms-2 step-button" onClick={e=>{
              if(step < kampanya.length-1){
                setStep(step+1)
              }else{
                setStep(0)
              }
            }}>
              <i className="bi bi-caret-right"></i>
            </button>
          </div>
        </div>
        
        <div onClick={()=>history.push(`/urun/${kampanya[step].id}/${restoran}`)} className="kampanya__icerik">
          <img src={kampanya[step].resim} alt="" />
            <div className="sag">
              <div className="isim">{kampanya[step].isim}</div>
              <div className="fiyat mt-3">{kampanya[step].fiyat} TL</div>
            </div>
        </div>
        
      </div>

}

      {urunler == null ? (
        <div className="urun p-2 kutu w-90 mx-auto mt-4 mb-3">
          <div className="sol">
            <div className="skeleton-box h-97"></div>
          </div>
          <div className="sag">
            <div className="kategori text-uppercase ">
              <div className="skeleton-box"></div>
            </div>
            <div className="isim">
              <div className="skeleton-box"></div>
            </div>
            <div className="aciklama h-50">
              <div className="skeleton-box "></div>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <div className="fiyat">
                <div className="skeleton-box"></div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}

      <div className="mb-3 d-flex justify-content-between align-items-center w-90 mx-auto mt-3">
        <div className="sol d-flex">
          <button
            onClick={() => setDesign(0)}
            className={`btn-outline ${design == 0 ? "active" : ""}`}
          >
            <i className="gg-inbox "></i>
          </button>
          <button
            onClick={() => setDesign(1)}
            className={`btn-outline ms-2 ${design == 1 ? "active" : ""}`}
          >
            <i className="gg-list"></i>
          </button>
        </div>

        <div className="sag sag-filter  position-relative">
          <div
            onClick={() => setMaxHeight(!maxHeight)}
            className="emir-dropdown d-flex align-items-center"
          >
            Sırala
            <svg
              className="ms-2"
              width="12"
              height="12"
              viewBox="0 0 188 136"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M94 136L0 0H188L94 136Z" fill="#a4a1a1" />
            </svg>
            <div
              className="emir-dr-icerik"
              style={{
                maxHeight: maxHeight ? "300px" : "0px",
                padding: maxHeight ? "3px" : "0px",
              }}
            >
              <ul>
                <li
                  onClick={() => {
                    setOrderBy("sure ASC");
                  }}
                >
                  En çabuk hazırlanan
                </li>
                <li
                  onClick={() => {
                    setOrderBy("sure DESC");
                  }}
                >
                  En geç hazırlanan
                </li>
                <li
                  onClick={() => {
                    setOrderBy("fiyat ASC");
                  }}
                >
                  Önce Düşük Fiyat
                </li>
                <li
                  onClick={() => {
                    setOrderBy("fiyat DESC");
                  }}
                >
                  Önce Yüksek Fiyat
                </li>
                <li>En çok beğenilenler</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {urunler &&
        urunler.map((val, i) => {
          if (val.kucuk != 1)
            return (
              <Link
                key={val.id}
                to={`/urun/${val.id}/${restoran}`}
                id={val.anchor}
                onClick={() => setView(true)}
                className={`urun p-2 kutu w-90 mx-auto mt-4 mb-3 ${
                  design == 1 ? "list-style" : ""
                }`}
              >
                <div className="sol">
                  <img loading="lazy" src={val.resim} alt={val.isim} />
                </div>
                <div className="sag">
                  <div className="kategori text-uppercase ">{val.anchor}</div>
                  <div className="isim">{val.isim}</div>
                  <div className="aciklama">{val.aciklama}</div>
                  <div className="d-flex align-items-center hs  ">
                    <i className="gg-alarm me-2"></i> {val.sure} dakika
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="fiyat">{val.fiyat} TL</div>
                  </div>
                </div>
              </Link>
            );
        })}

      <div className="kucuk-grid w-90 mx-auto mt-3">
        {urunler &&
          urunler.map((val, i) => {
            if (val.kucuk == 1)
              return (
                <Link
                  key={val.id}
                  to={`/urun/${val.id}/${restoran}`}
                  id={val.anchor}
                  onClick={() => setView(true)}
                  className={`kucuk-urun p-2 kutu ${
                    design == 1 ? "list-style" : ""
                  }`}
                >
                  <div className="sol">
                    <img loading="lazy" src={val.resim} alt={val.isim} />
                  </div>
                  <div className="sag">
                    <div className="kategori text-uppercase ">{val.anchor}</div>
                    <div className="isim">{val.isim}</div>
                    <div className="aciklama">{val.aciklama}</div>

                    <div className="d-flex justify-content-between align-items-center">
                      <div className="fiyat">{val.fiyat} TL</div>
                    </div>
                  </div>
                </Link>
              );
          })}
      </div>

      {view ? (
        <div className="urun-view">
          <div className="urun p-2 kutu w-90 mx-auto mt-4 mb-3">
            <div className="sol">
              <img
                loading="lazy"
                src="https://www.soke.com.tr/Files/tarifler/HamburgerEkmegi3.jpg"
                alt=""
              />
            </div>
            <div className="sag">
              <div className="kategori">HAMBURGER</div>
              <div className="isim">BOL SOSLU CHEDARLI HAMBURGER</div>
              <div className="aciklama">
                Büyük köftesi, bol malzemesi ile ağzınıza layık bir lezzet.
              </div>
              <div className="d-flex justify-content-between align-items-center">
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
                      -
                    </button>
                    <div className="kac">{counter}</div>
                    <button
                      className="cbtn sagx button-yesil"
                      onClick={() => {
                        if (counter > 1) {
                          setCounter(counter + 1);
                        }
                      }}
                    >
                      +
                    </button>
                  </div>
                  <div className="fiyat  ms-1 h-30 d-flex align-items-center">
                    {counter * Number(30)} TL
                  </div>
                </div>

                <button
                  className="button button-mavi"
                  onClick={() => {
                    context({
                      isim: "BOL SOSLU CHEDARLI HAMBURGER",
                      foto: "https://www.soke.com.tr/Files/tarifler/HamburgerEkmegi3.jpg",
                      id: 1,
                      fiyat: 30,
                      subtotal: counter * Number(30),
                      adet: counter,
                      not: siparisNotu,
                    });
                    setSnack(true);
                    setTimeout(() => {
                      setSnack(false);
                    }, 2000);
                    setView(false);
                    setSiparisNotu("");
                  }}
                >
                  Ekle
                </button>
              </div>
              <div className="mt-1">
                <textarea
                  placeholder="Sipariş ile ilgili notlarınız yazabilirsiniz"
                  cols="30"
                  rows="1"
                  onChange={(e) => setSiparisNotu(e.target.value)}
                >
                  {siparisNotu}
                </textarea>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
