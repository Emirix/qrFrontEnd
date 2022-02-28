import React, { useEffect,useState } from "react";
import { Link } from "react-router-dom";
import {useLocation,useParam,matchPath,useHistory} from "react-router-dom"
function Nav({siparis}) {
  const location = useLocation()
  const [slug,setSlug] = useState("");
  let history = useHistory()

  useEffect(()=>{
    let id = window.location.pathname.split("/").pop();
    console.log("sa"+id)
    console.log(location)
    setSlug(id)
  },[])

  return (
    <div className="nav">
     
      <ul>

        {
          location.pathname.includes("/urun/") || location.pathname.includes("/yorum/") ? 
          <li className="text-white nav-inx" onClick={()=>{history.push("/kategoriler/"+slug)}}>
            
            <i className="gg-arrow-left me-1"></i>
            Geri
          </li> : ""
        }
      


      { !location.pathname.includes("/urun/")&& !location.pathname.includes("/yorum/") ? 

<>
        <li className={location.pathname.includes("/ana-sayfa") ?  "active" : ""}>
          <Link to={`/ana-sayfa/${slug}`}> 
          <i className="gg-home"></i>
          </Link>
        </li>
        <li  className={location.pathname.includes("/kategoriler")  ? "active" : ""}>
          <Link to={`/kategoriler/${slug}`}>
           <i className="gg-list"></i>
          </Link>
        </li>
          {
            siparis == "true" ? 
          
        <li  className={location.pathname.includes("/sepet")  ? "active" : ""}>
          <Link to={`/sepet/${slug}`}>
          <i className="gg-shopping-bag"></i>
          </Link>
        </li> : "" }

   

        <li  className={location.pathname.includes("/odeme")  ? "active d-none" : "d-none"}>
          <Link to={`/odeme/${slug}`}>
          <i className="gg-credit-card"></i>
          </Link>
        </li>
        </>
: " "}
      </ul>
    </div>
  );
}

export default Nav;
