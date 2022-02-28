import axios from "axios";
import React,{useState,useEffect} from "react";
import { useParams } from "react-router-dom";
import { HashLink as Link } from 'react-router-hash-link';

function Kategoriler() {

  let {restoran} = useParams()

  const [kategoriler,setKategoriler] = useState(null)

  useEffect(()=>{
    axios.get("/restoran/kategoriler/"+restoran).then(res=>{
      console.log(res)
      setKategoriler(res.data)
    })
  },[])
  return (
    <div className="kategori gir">
      <div className="kutu w-90 mx-auto mt-3 py-2 px-2">
     
        <h4 className="fw-bold mb-0 p-0 d-flex center-y"><i className="gg-list me-1"></i>Kategoriler</h4>
       
      </div>

       {kategoriler == null ? <div className="w-90 mx-auto h-30 mt-3"><div className="h-30 skeleton-box "></div></div> : 
             <Link smooth to={"/menu/"+restoran} className="bg-mavi kutu w-90 mx-auto mt-3 py-3 px-2 d-flex align-items-center justify-content-center">
             <svg fill="white" xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24"><path d="M11 6.999c2.395.731 4.27 2.607 4.999 5.001.733-2.395 2.608-4.269 5.001-5-2.393-.731-4.268-2.605-5.001-5-.729 2.394-2.604 4.268-4.999 4.999zm7 7c1.437.438 2.562 1.564 2.999 3.001.44-1.437 1.565-2.562 3.001-3-1.436-.439-2.561-1.563-3.001-3-.437 1.436-1.562 2.561-2.999 2.999zm-6 5.501c1.198.365 2.135 1.303 2.499 2.5.366-1.198 1.304-2.135 2.501-2.5-1.197-.366-2.134-1.302-2.501-2.5-.364 1.197-1.301 2.134-2.499 2.5zm-6.001-12.5c-.875 2.873-3.128 5.125-5.999 6.001 2.876.88 5.124 3.128 6.004 6.004.875-2.874 3.128-5.124 5.996-6.004-2.868-.874-5.121-3.127-6.001-6.001z"/></svg>
             <h2 className="ms-2 text-white m-0">Kampanyalı Ürünler</h2>
             </Link>
       }


      <div className="grid">
          {kategoriler == null ? 
          <>
          <div className="skeleton-box h-97" ></div>
          <div className="skeleton-box h-97" ></div>
          <div className="skeleton-box h-97" ></div>
          <div className="skeleton-box h-97" ></div>
          <div className="skeleton-box h-97" ></div>
          <div className="skeleton-box h-97" ></div>
          </> : ""
          }
        {
          kategoriler && kategoriler.map((val)=>{
            return(
              <Link
              scroll={(el) => el.scrollIntoView({ behavior: 'smooth', block: 'end' })}
              smooth to={"/menu/"+val.slug+"#"+val.anchor} className="kutu" key={val.id}>
                <img className="d-none" src={`/icons/${val.icon}`} alt="" />
                <div className="isim">{val.name}</div>
              </Link>
            )
          })
        }
    


        
      </div>
    </div>
  );
}

export default Kategoriler;
