import React from 'react';
import { useParams } from 'react-router-dom';
import { Redirect } from 'react-router-dom';

function Go() {
 let {id,restoran} = useParams()
  return <Redirect to={`/urun/${id}/${restoran}`}  />;
}

export default Go;
