import axios from "axios";
import React, { useState, useEffect } from "react";
import { Redirect, useParams } from "react-router-dom";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import socketIOClient from "socket.io-client";

function Sepet({ data, remove, odeme }) {
  let { restoran } = useParams();
  const [fiyat, setFiyat] = useState(0);
  const [ok, setOk] = useState(false);
  const [popup, setPopup] = useState(false);
  const [odemePopup, setOdemePopup] = useState(false);
  const [ikram, setIkram] = useState("");
  const [ikramlar, setIkramlar] = useState(null);
  const [odemeYontemi, setOdemeYontemi] = useState("online");
  const [tab, setTab] = useState(1);
  const [adSoyad, setAdSoyad] = useState("");
  const [telefon, setTelefon] = useState("");
  const [adres, setAdres] = useState("");
  const [paketType, setPaketType] = useState("");

  function generateKey() {
    return `${Math.random()}_${new Date().getMinutes()}:${new Date()}_${Math.random()}`
      .split(" ")
      .join("");
  }

  React.useEffect(() => {
    axios.get("/restoran/ikramlar/" + restoran).then((res) => {
      setIkramlar(res.data);
    });
  }, []);
  var toplam = 0;
  let history = useHistory();
  useEffect(() => {
    data.forEach((i) => {
      toplam += i.subtotal;
    });
    setFiyat(toplam);

    const socket = socketIOClient("http://192.168.1.80:3050/");

    socket.on("output siparis", (data) => {
      console.log("SERVERR");
    });
  });

  const [loading, setLoading] = useState(false);

  function paketOnay() {
    if(adSoyad == "" || telefon == "" || adres == ""){
      return
    }
    axios
      .post("/siparis/paket", {
        urunler: JSON.stringify(data),
        ad: adSoyad,
        telefon: telefon,
        adres: adres,
      })
      .then((res) => {
        history.push("/odeme/" + res.data + "/" + restoran + "/?tab=1");
      });
  }

  function sepetiOnayla(mode = "") {
    console.log(paketType);

    if (mode == "popup") {
      setPopup(true);
    }
    if (mode == "odeme_popup") {
      setOdemePopup(true);
    }
    if (mode == "") {
      console.log("sa");
      setLoading(true);
      setPopup(false);

      const socket = socketIOClient("http://192.168.1.80:3050/");

      axios
        .post("/siparis/yeni", {
          siparis: [...data],
          paket: tab == 2 ? paketType : "0",
        })
        .then((res) => {
          console.log(res);
          setLoading(false);
          setOk(true);
          data = [];
          socket.emit("input siparis", { datax: "yeni" });
          history.push("/odeme/" + res.data + "/" + restoran + "/?tab=1");
        });

      if (ikram != "SİPARİŞ İKRAMI: İstemiyorum") {
        axios
          .post("/istek", {
            masa: localStorage.getItem("masa_no"),
            istek: ikram,
          })
          .then((res) => {});
      }
    }
  }

  return (
    <div className="sepet gir">
      <div className="kutu w-90 mx-auto mt-3 py-2 px-2">
        <div className="d-flex justify-content-between align-items-center">
          <h4 className="fw-bold mb-0 p-0 d-flex center-y">
            <i className="gg-shopping-bag me-1"></i>Sepet
          </h4>
          <div className="toplam-sepet">{fiyat} TL</div>
        </div>
      </div>

      {data.length > 0 ? (
        <>
          <div className="kutu w-90 mx-auto mt-3 py-2 px-2">
            <button
              onClick={() => {
                sepetiOnayla("odeme_popup");
              }}
              className="button button-mavi mx-auto"
            >
              {!loading ? (
                <>
                  <i className="gg-credit-card"></i> Sepeti Onayla
                </>
              ) : (
                <i className="gg-spinner"></i>
              )}
            </button>
          </div>

          <div className="kutu w-90 mx-auto mt-3 py-2 px-2">
            <div className="emir-tab">
              <ul className="">
                <li
                  className={
                    tab == 1
                      ? "active flex-fill justify-content-center"
                      : "flex-fill justify-content-center"
                  }
                  onClick={() => {
                    setTab(1);
                    setPaketType("");
                  }}
                >
                  <i className="gg-bolt"></i>İşletme içi
                </li>
                <li
                  className={
                    tab == 2
                      ? "active flex-fill justify-content-center"
                      : "flex-fill text-center justify-content-center"
                  }
                  onClick={() => setTab(2)}
                >
                  <i className="gg-credit-card"></i>Paket{" "}
                </li>
              </ul>
              {tab == 2 ? (
                <div>
                  <h6 className="mt-2 fw-bold">Paket Servis</h6>
                  <div className="form-check">
                    <input
                      onChange={(e) => setPaketType(e.target.value)}
                      value="ev"
                      className="form-check-input"
                      type="radio"
                      name="flexRadioDefault"
                      id="flexRadioDefault1"
                    />
                    <label
                      className="form-check-label"
                      htmlFor="flexRadioDefault1"
                    >
                      Adrese Teslim
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      onChange={(e) => setPaketType(e.target.value)}
                      value="masa"
                      className="form-check-input"
                      type="radio"
                      name="flexRadioDefault"
                      id="flexRadioDefault2"
                    />
                    <label
                      className="form-check-label"
                      htmlFor="flexRadioDefault2"
                    >
                      Masaya Paket
                    </label>
                  </div>

                  {paketType == "ev" ? (
                    <div className="tab-icerik">
                      <form>
                        <input
                          value={adSoyad}
                          onChange={(e) => setAdSoyad(e.target.value)}
                          type="text"
                          placeholder="Ad Soyad"
                          className="mt-3 form-control"
                        />
                        <input
                          value={telefon}
                          onChange={(e) => setTelefon(e.target.value)}
                          type="text"
                          placeholder="Telefon"
                          className="mt-1 form-control"
                        />
                        <input
                          value={adres}
                          onChange={(e) => setAdres(e.target.value)}
                          type="text"
                          placeholder="Adres"
                          className="mt-1 form-control"
                        />
                      </form>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </>
      ) : (
        ""
      )}

      {ok ? (
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
      ) : (
        ""
      )}

      {data.length > 0 && ok == false ? (
        data.map((val, index) => {
          return (
            <div
              key={index}
              className={
                loading
                  ? "flex-wrap kutu item w-90 mx-auto mt-3 py-2 px-2 disabled-urun"
                  : "flex-wrap kutu item w-90 mx-auto mt-3 py-2 px-2"
              }
            >
              <div className="kutu-sol">
                <img src={val.foto} alt="" />
              </div>
              <div className="kutu-sag">
                <div className="isim">{val.isim}</div>
                <div className="adet">Adet: {val.adet}</div>
                <div className="d-flex justify-content-between mt-3 align-items-center">
                  <div className="d-flex">
                    <div className="fiyat">{val.subtotal} TL</div>
                  </div>
                  <i
                    onClick={(e) => {
                      const details =
                        e.currentTarget.parentElement.parentElement.parentElement.querySelector(
                          ".details"
                        );
                      if (details.classList.contains("details-close")) {
                        details.classList.remove("details-close");

                        e.currentTarget.classList.remove("gg-chevron-down-o");
                        e.currentTarget.classList.add("gg-chevron-up-o");
                      } else {
                        details.classList.add("details-close");
                        e.currentTarget.classList.add("gg-chevron-down-o");
                        e.currentTarget.classList.remove("gg-chevron-up-o");
                      }
                    }}
                    style={{ color: "#878787" }}
                    className="gg-chevron-down-o m-0"
                  >
                    {" "}
                  </i>
                </div>
              </div>
              <div className="mt-3 details flex-fill details-close">
                <h6 className="mb-0">Ürün Detayları</h6>
                {val.not != "" ? (
                  <p className="text-secondary mb-0">
                    <b>Not:</b> {val.not}
                  </p>
                ) : (
                  ""
                )}
                <p className="text-secondary">
                  <b>Adet:</b> {val.adet}
                </p>
                <div className="d-flex">
                  <button
                    className="button button-red"
                    onClick={(e) => {
                      remove(val, val.id, index);
                    }}
                  >
                    <i className="gg-close"></i>Sepetten Sil
                  </button>
                </div>
              </div>
            </div>
          );
        })
      ) : ok != true ? (
        <div className="sepet-bos kutu w-90 mx-auto mt-3 p-2 d-flex flex-column justify-content-between align-items-center">
          <svg
            fill="#3A69C7"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            viewBox="0 0 1000 1000"
          >
            <g>
              <path d="M860.3,374.7l124.4-124.4c4-3.9,5.8-9.4,5.2-14.8c-0.8-5.6-4-10.4-8.7-13.2L645.7,28.5c-6.9-4-15.7-2.8-21.3,2.9L500,155.8L375.6,31.5c-5.7-5.7-14.4-6.9-21.4-2.9L18.8,222.4c-4.9,2.8-8,7.6-8.7,13.2c-0.7,5.3,1,10.9,4.9,14.8l124.4,124.4L15.1,499.3c-3.9,3.9-5.7,9.4-4.9,14.8c0.6,5.4,3.8,10.3,8.7,13l128,74v161.2c0,6.4,3.4,12.2,8.8,15.4l335.5,193.9c2.7,1.7,5.8,2.3,8.8,2.3c3,0,6.1-0.7,8.8-2.3l335.4-193.9c5.4-3.2,8.8-9,8.8-15.4V601.1l128.1-74c4.7-2.8,7.9-7.6,8.7-13c0.7-5.5-1.2-10.9-5.2-14.8L860.3,374.7L860.3,374.7z M799.9,372.5L500,545.8L200,372.5l224.9-130l75.1-43.3l271.3,156.6L799.9,372.5L799.9,372.5z M639.8,63.8l303.6,175.6l-111,111l-18.2-10.5L528.7,174.9L639.8,63.8L639.8,63.8z M360.2,63.8l111.1,111.1L167.5,350.3l-111.1-111L360.2,63.8L360.2,63.8z M167.5,394.6l303.6,175.6l-111,111L173.3,573.2c-0.1,0-0.1,0-0.1,0L56.4,505.7L167.5,394.6L167.5,394.6z M182.2,619.3l172,99.3c2.8,1.7,5.8,2.4,8.8,2.4c0.4,0,0.6-0.4,1-0.4c4.1-0.1,8.3-1.5,11.5-4.7l106.8-106.8v314.2L182.2,749.8L182.2,619.3L182.2,619.3z M817.6,749.8l-300,173.4V609.1l106.6,106.8c3.1,3.1,7.2,4.4,11.4,4.7c0.4,0,0.7,0.4,1,0.4c3.1,0,6.1-0.7,8.8-2.4l172-99.3V749.8L817.6,749.8z M639.7,681.1l-111-111l303.7-175.6l111,111.1L639.7,681.1L639.7,681.1z" />
            </g>
          </svg>

          <h4>Sepetinizde ürün bulunmamaktadır</h4>
        </div>
      ) : (
        ""
      )}

      {popup ? (
        <div className="popup-bg">
          <div className="popup shadow-sm">
            {ikramlar != null && ikramlar.length > 0 ? (
              <>
                <h6 className="mb-0">İkram Seç</h6>
                <p className="fs-7 text-secondary">
                  Dilerseniz ikram seçebilirsiniz
                </p>
              </>
            ) : (
              <h6 className="mb-0">Siparişi onaylıyormusunuz</h6>
            )}

            <div
              onChange={(e) => {
                setIkram("SİPARİŞ İKRAMI: " + e.target.value);
              }}
            >
              {ikramlar && ikramlar.length > 0 ? (
                <>
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
                </>
              ) : (
                ""
              )}
            </div>

            <hr />
            <div className="d-flex">
              <button
                className="button button-gri me-1"
                onClick={() => setPopup(false)}
              >
                İptal
              </button>
              <button
                className="button button-mavi"
                onClick={() => sepetiOnayla()}
              >
                Onayla
              </button>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}

      {odemePopup ? (
        <div className="popup-bg">
          <div className="popup w-90 shadow-sm">
            <h6 className="mb-0">Ödeme</h6>
            <p className="text-secondary">
              Bu işletmede sipariş öncesi ödeme yapmanız gerekmektedir.
            </p>

            <h6 className="mt-3 fs-7">Ödeme türü</h6>
            <div className="form-check">
              <input
                onChange={() => {
                  setOdemeYontemi("tlkk");
                  console.log("tl");
                }}
                className="form-check-input"
                type="radio"
                name="flexRadioDefault"
                id="flexRadioDefault2"
              />
              <label className="form-check-label" htmlFor="flexRadioDefault2">
                Nakit/Kredi Kartı
              </label>
            </div>
            <div className="form-check">
              <input
                onChange={() => {
                  setOdemeYontemi("online");
                  console.log("onlin e");
                }}
                className="form-check-input"
                type="radio"
                name="flexRadioDefault"
                id="flexRadioDefault1"
                defaultChecked
              />
              <label className="form-check-label" htmlFor="flexRadioDefault1">
                Online
              </label>
            </div>

            <div className="d-flex mt-3">
              <button
                onClick={() => setOdemePopup(false)}
                className="button button-gri flex-fill text-center d-block me-2"
              >
                İptal
              </button>
              <button
                onClick={() => {
                  if (paketType == "ev") {
                    paketOnay();
                  } else {
                    if (odemeYontemi == "online") {
                      sepetiOnayla("");
                    } else {
                      sepetiOnayla("");
                    }
                  }
                }}
                className="button button-mavi flex-fill text-center  d-block"
              >
                İlerle
              </button>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default Sepet;
