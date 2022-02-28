import React, { useState, useEffect } from "react";
import "./assets/css/style.css";
import Nav from "./components/Nav";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  Redirect,
} from "react-router-dom";
import Index from "./pages/Index";
import Menu from "./pages/Menu";
import Page from "./components/Page";
import Kategoriler from "./pages/Kategoriler";
import Sepet from "./pages/Sepet";
import Istek from "./pages/Istek";
import Go from "./pages/Go";
import Odeme from "./pages/Odeme";
import Yorumlar from "./pages/Yorumlar";
import axios from "axios";
import Urun from "./pages/Urun";
import Start from "./pages/Start";
import SocketIOClient from "socket.io-client";

function App() {
  const [basket, setBasket] = useState([]);
  const [restoranData, setRestoranData] = useState(null);
  const [newMessage, setNewMessage] = useState({
    show: false,
    text: "",
  });
  let slug = window.location.pathname.split("/")[2];
  const [ayar, setAyar] = useState(null);

  useEffect(() => {
    const socket = SocketIOClient("http://192.168.1.80:3050/");
    socket.on("output mesaj", (data) => {
      setNewMessage({ show: true, text: data.mesaj, masa: data.masa });
    });

    axios.get("/restoran/" + slug).then((res) => {
      console.log(res.data);
      setAyar(res.data);
    });
  }, []);

  return (
    <Router>
      {(newMessage.show && newMessage.masa == "all") ||
      newMessage.masa == localStorage.getItem("masa_no") ? (
        <div className="mesaj-bg gir">
          <div className="mesaj text-center">
            <div className="mesaj__header">Yeni bir mesajınız var</div>
            <div className="mesaj__body">{newMessage.text}</div>
            <button
              onClick={(e) => setNewMessage({ show: false, text: "" })}
              className="button button-gri mb-2 mx-auto"
            >
              <i className="gg-close"></i> Kapat
            </button>
          </div>
        </div>
      ) : (
        ""
      )}
      <div>
        {ayar != null ? (
          <Switch>
            <Route path="/ana-sayfa/:restoran/" exact>
              <Page>
                <Index slug={slug} />
              </Page>
            </Route>

            <Route path="/urun/:id/:restoran" exact>
              <Page>
                <Urun
                  siparis={ayar != null && ayar[0].siparis_ayar}
                  yorum={ayar && ayar[0].ayar_yorum}
                  context={(e) => {
                    setBasket((oldArray) => [...oldArray, e]);
                  }}
                />
              </Page>
            </Route>

            <Route path="/yorum/:id" exact>
              <Page>
                <Yorumlar />
              </Page>
            </Route>

            <Route path="/menu/:restoran" exact>
              <Page>
                <Menu
                  context={(e) => {
                    setBasket((oldArray) => [...oldArray, e]);
                  }}
                />
              </Page>
            </Route>

            <Route path="/kategoriler/:restoran" exact>
              <Page>
                <Kategoriler />
              </Page>
            </Route>

            <Route path="/istek/:restoran" exact>
              <Page>
                <Istek />
              </Page>
            </Route>

            <Route path="/odeme/:key/:restoran" exact>
              <Page>
                <Odeme />
              </Page>
            </Route>

            <Route path="/sepet/:restoran/" exact>
              <Page>
                <Sepet
                  odeme={ayar.odeme}
                  data={basket}
                  remove={(item, b, c) => {
                    console.log(b);
                    console.log(c);

                    const newx = basket.filter((_, i) => i != c);
                    setBasket(newx);
                    console.log(newx);
                  }}
                />
              </Page>
            </Route>

            <Route path={"/redirect/:id/:restoran"}>
              <Go />
            </Route>

            <Route path="/start/:restoran/:masa" exact>
              <Start />
            </Route>
          </Switch>
        ) : (
          ""
        )}
        {ayar && ayar[0].istek_ayar == "true" ? (
          <ul className="yanmenu">
            <li className={""}>
              <Link to={`/istek/${slug}`}>
                <i className="gg-bell"></i>
                <div>İstek</div>
              </Link>
            </li>
          </ul>
        ) : (
          ""
        )}
        {ayar != null ? <Nav siparis={ayar && ayar[0].siparis_ayar} /> : ""}
      </div>
    </Router>
  );
}

export default App;
