import React, { useEffect } from 'react';
import Axios from "axios";
import { useState } from "react";
import SearchIcon from '@mui/icons-material/Search';
import OrderReceipt  from './OrderReceipt';



function OrderInformation(){
  const [search, setSearch]=useState(0);
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
          if (search == 0) {
            return val;
          }
  
          // Filter data based on book_id (val[0])
          else if (val[0]==search )
           {
           return val
          }
  
          // Return an empty array if no match found
          
        })
          .map((val, key) => {
            // Render table rows for filtered data
            return (
              <tr key={key}>
                <td>{val[0]}</td>
                <td>{val[1]}</td>
                <td>{formatDate(val[2])}</td>
                <td>{formatDate(val[3])}</td>
                <td>{val[4]}</td>
                <td><button onClick={()=>{setShowOrder(!showOrder);setSearchId(val[0])}}>Order Details</button> </td>
              
              </tr>
            );
          })}
      </tbody>
    );
  };
  
  
    const getInformation = () => {
        
      Axios.get("http://localhost:3005/OrderInformation")
        .then((response) => {
            
         setInformationList(response.data);
          console.log('Response:', response); // Log the entire response object
          console.log('Data:', response.data); // Log the data
    
    })
        .catch((error) => {
          console.error(error);
        });

        Axios.get("http://localhost:3005/orderdetails")
        .then((response) => {
          setPassInformationList(response.data);
          console.log('Response:', response.data);
          console.log('PassData:', response.data);
        })
        .catch((error) => {
          console.error(error);
        });

    };
    

    const handleChange=(e)=>{
setSearch(e.target.value);
console.log(search);
    };
  
   return (
 
      <div className="information">
    
        <div>

          <div>
            <form>
              <input className='searchBar' type='number' placeholder='Search by OrderID' onChange={(e)=>setSearch(e.target.value)}/>
              <SearchIcon />
            </form>
          </div>
            <table>
            <thead>
          <tr>
            <th>ORDER ID</th>
            <th>CUSTOMER ID</th>
            <th>ORDER DATE</th>
            <th>STATUS DATE</th>
            <th>STATUS</th>
            <th></th>

        
          </tr>
        </thead>
      
    {displayAll()}
  </table>
      </div>
      {showOrder && (
      <div className="show-more-container">
        <OrderReceipt ordId={searchId} informationList={passInformationList} />
      </div>
    )}
      </div>
    );
  }




export default OrderInformation;