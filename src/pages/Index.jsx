import React,{useEffect,useState} from 'react'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import axios from "axios"
import logo from "../assets/img/logo.png"

function Index({slug}) {
    
  let {restoran} = useParams()
  const [data,setData] = useState(null)

  useEffect(()=>{
    axios.get(`/restoran/${restoran}`).then(res=>{
      console.log(res)
      setData(res.data)
    })
  },[])
 
    return (
        <div className='kutu w-90 mx-auto mt-3 index gir'>
            <div className="logo">
                <img src={data && axios.defaults.baseURL + "/logo/" + data[0].logo} alt="" />
                </div>

                 {data == null ? <div className="skeleton-box"></div> : 
                   <p translate="no" className='tanitim text-center '>
                      { data && data[0].aciklama}
                  </p>
}
                
               

            <Link to={`/kategoriler/${slug}`}>
            <button translate="no" className='button button-mavi mb-3 mt-3'><i className="gg-eye"></i>Ürünlerimiz</button>
            </Link>
            <button translate="no" className='button button-dark mb-3 '>            <i className="gg-bitbucket"></i>
En Çok Satılanlar</button>
               <div className="mb-3 masa-show d-flex align-items-center"><h6 className='fw-bold mb-0 me-1'>Masa No: </h6> <span>{localStorage.getItem("masa_no")}</span></div>
        </div>
    )
}

export default Index
