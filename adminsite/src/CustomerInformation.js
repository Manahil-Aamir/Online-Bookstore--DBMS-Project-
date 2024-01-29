import React, { useEffect } from 'react';
import Axios from "axios";
import { useState } from "react";
import SearchIcon from '@mui/icons-material/Search';
import ShowMore  from './ShowMore';
import './Styles/CustomerInfo.css';


function CustomerInformation(){
  const [search, setSearch]=useState('');
  const [searchId, setSearchId]=useState(0);
  const [showOrder, setShowOrder]=useState(false);
  const [passInformationList, setPassInformationList] = useState([]);
  
  console.log(search);
  const formatDate = (inputDate) => {
    const date = new Date(inputDate);
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('default', { month: 'short' }).toUpperCase();
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };


const [informationList, setInformationList] = useState([]);
useEffect(() => {
  getInformation();
}, []);



const displayAll = () =>  {
    return (
      <tbody>
        {informationList.filter((val) => {
          // Return all data if search is 0
          if (search == '') {
            return val;
          }
  
         
          else if (val[2].replace(/\s/g, "").toUpperCase().includes(search.replace(/\s/g, "").toUpperCase()) )
           {
           return val
          }
  
      
          
        })
          .map((val, key) => {
            // Render table rows for filtered data
            return (
              <tr key={key}>
                <td>{val[0]}</td>
                <td>{val[1]}</td>
                <td>{val[2]}</td>
                <td>{val[3]}</td>
                <td><button onClick={()=>{setShowOrder(!showOrder);setSearchId(val[0])}}>Show Orders</button> </td>
              
              </tr>
            );
          })}
      </tbody>
    );
  };
  
  
    const getInformation = async() => {

      const x = await Axios.get("http://localhost:3005/CustomerInformation");
        
      setInformationList(x.data);
      console.log('Data:', x.data); // Log the data
      
        const y = await Axios.get("http://localhost:3005/showmore");
       
          setPassInformationList(y.data);
          console.log('Response:', y.data); };
        
    

    const handleChange=(e)=>{
setSearch(e.target.value);
console.log(search);
    };
  
   return (
 
      <div className="information">
        
    
        <div >

          <div>
            <form>
              <input className='searchBar' type='text' placeholder='Search by Email' onChange={(e)=>setSearch(e.target.value)}/>
              <SearchIcon />
            </form>
          </div>
          <div className="table-container">
            <table>
            <thead>
          <tr>
            <th>CUSTOMER ID</th>
            <th>NAME</th>
            <th>EMAIL</th>
            <th>ADDRESS</th>
            <th></th>
            

        
          </tr>
        </thead>
      
    {displayAll()}
  </table>
  </div>
      </div>
      {showOrder && (
      <div className="show-more-container">
        <ShowMore custId={searchId} informationList={passInformationList} />
      </div>
    )}
      </div>
    );
  
}



export default CustomerInformation;



