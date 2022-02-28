import React, { useEffect } from 'react'
import {useParams, Redirect} from "react-router-dom"

function Start() {
  let {restoran,masa} = useParams()
  useEffect(()=>{
    console.log("Sa")
    console.log(restoran)
    console.log(masa)
    localStorage.setItem("masa_no",masa)

  },[])
  return (
    <Redirect to={`/ana-sayfa/${restoran}`}/>

  )
}

export default Start