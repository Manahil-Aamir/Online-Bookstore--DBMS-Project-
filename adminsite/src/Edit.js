import React ,{useState,useEffect}from 'react';
import Axios from "axios";

function Edit() {
    const [displayData, setDisplayData] = useState([]);
    const [title, setTitle] = useState("");
  const [isbn, setISBN13] = useState("")
  const [pages, setPages] = useState(0);
  const [pubDate, setpubDate] = useState(new Date());
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [publisherId, setpubName] = useState("")
  const [category, setCategory] = useState("");
  const [imageLink, setImage] = useState("");
  const [authorName, setAuthorName] = useState(""); // Added authorName state
  const [format, setFormat] = useState("Hardcopy");
  const [BookList, setBookList] = useState([]);
  const [newRecordAdded, setNewRecordAdded] = useState(false);
 const [search,setSearch]=useState(0);
 
 

 const handleClick = () => {
    getEditData();
    
  };

  const handleInputChange = (event) => {
    setSearch(event.target.value);
  };

  const handleSubmit=(e)=>{
    e.preventDefault(); 
    console.log('here1')
    if(isbn.length==13){
    updateTitle();
    updateQuantity();
    updateImage();
    updateDescription();
    updateCategory();
    updateISBN13();
    updatePages();
    updateFormat();
    updatePrice();
    updatePublisherName();
    updateAuthorName();
  
  }
  else {alert("error:isbn must be of length 13");}

  }
  

  const getEditData = () => {
    Axios.get("http://localhost:3005/GetEditData", { params: { search } })
      .then((response) => {
        // Check if response.data is truthy (not null or undefined)
        const data = response.data && response.data[0];
        
        // Set displayData based on the condition
        setDisplayData(data || "");
     setTitle(displayData[0]);
     setQuantity(displayData[4]);
     setPages(displayData[2]);
     setCategory(displayData[11]);
     setFormat(displayData[7]);
     setISBN13(displayData[1]);
     setpubName(displayData[10]);
     setAuthorName(displayData[9]);
     setImage(displayData[6])
     setPrice(displayData[5]);
     setDescription(displayData[3]);
     //setpubDate(displayData[8]);

        console.log('Response:', response); // Log the entire response object
        console.log('Data:', data); // Log the data
        console.log("out", displayData);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  //updatetitle
  const updateTitle = () => {
    console.log('here2');
    if (title !== displayData[0]) {
      Axios.post("http://localhost:3005/UpdateTitle", { title: title, id: search })
        .then(() => {
          setDisplayData([title, ...displayData.slice(1)]); // Update the first element of the array
        })
        .then(() => {
          alert("title updated");
        })
        .catch((error) => {
          console.error('Error updating title:', error);
        });
    }
  }

   //updateformat
   const updateFormat = () => {
    console.log('here2format');
    if (format!== displayData[7]) {
      Axios.post("http://localhost:3005/UpdateFormat", { format: format, id: search })
        .then(() => {
          setDisplayData([...displayData.slice(0, 7), format, ...displayData.slice(8)]); // Update the first element of the array
        })
        .then(() => {
          alert("format updated");
        })
        .catch((error) => {
          console.error('Error updating format:', error);
        });
    }
  }

//updatePrice
const updatePrice = () => {
  console.log('here2price');
  if (price!== displayData[5]) {
    Axios.post("http://localhost:3005/UpdatePrice", { price: price, id: search })
      .then(() => {
        setDisplayData([...displayData.slice(0, 5), price, ...displayData.slice(6)]); // Update the first element of the array
      })
      .then(() => {
        alert("price updated");
      })
      .catch((error) => {
        console.error('Error updating format:', error);
      });
  }
}

//updatecategory
const updateCategory = () => {
  console.log('here2c');
  if (category !== displayData[11]) {
    Axios.post("http://localhost:3005/UpdateCategory", { category: category, id: search })
      .then(() => {
        setDisplayData([...displayData.slice(0, 11), category, ...displayData.slice(12)]); // Update the first element of the array
      })
      .then(() => {
        alert("category updated");
      })
      .catch((error) => {
        console.error('Error updating title:', error);
      });
  }
}


//updatepages
const updatePages = () => {
  console.log('here2p');
  if (pages !== displayData[2]) {
    Axios.post("http://localhost:3005/UpdatePages", { pages:pages, id: search })
      .then(() => {
        setDisplayData([...displayData.slice(0, 2), pages, ...displayData.slice(3)]);


        
      })
      .then(() => {
        alert("number of pages updated");
        console.log(displayData);
      })
      .catch((error) => {
        console.error('Error updating pages:', error);
      });
  }
}

//updatepublisher name
const updatePublisherName = () => {
  console.log('here2p');
  if (publisherId !== displayData[10]) {
    Axios.post("http://localhost:3005/UpdatePublisher", { pname:publisherId, id: search })
      .then(() => {
        setDisplayData([...displayData.slice(0, 10), pages, ...displayData.slice(11)]);


        
      })
      .then(() => {
        alert("publisher updated");
        console.log(displayData);
      })
      .catch((error) => {
        console.error('Error updating publisher:', error);
      });
  }
}

//updateauthor name
const updateAuthorName = () => {
  console.log('hereauthor');
  if (publisherId !== displayData[9]) {
    Axios.post("http://localhost:3005/UpdateAuthor", { aname:authorName, id: search })
      .then(() => {
        setDisplayData([...displayData.slice(0, 9), pages, ...displayData.slice(10)]);


        
      })
      .then(() => {
        alert("Author updated");
        console.log(displayData);
      })
      .catch((error) => {
        console.error('Error updating author:', error);
      });
  }
}




//updateisbn
const updateISBN13 = () => {
  console.log('here2isbn');
  if (isbn !== displayData[1]) {
    Axios.post("http://localhost:3005/UpdateISBN", { isbn:isbn, id: search })
      .then(() => {
        setDisplayData([...displayData.slice(0, 1), isbn, ...displayData.slice(2)]);

      })
      .then(() => {
        alert("ISBN updated");
      })
      .catch((error) => {
        console.error('Error updating isbn:', error);
      });
  }
}

//update quantity
const updateQuantity = () => {
  console.log('here2');
  if (quantity !== displayData[4]) {
    Axios.post("http://localhost:3005/UpdateQuantity", { quantity: quantity, id: search })
      .then(() => {
        setDisplayData([...displayData.slice(0, 4),quantity, ...displayData.slice(5)]);

      })
      .then(() => {
        alert("quantity updated");
        console.log("update",displayData);
      })
      .catch((error) => {
        console.error('Error updating quantity:', error);
       
      });
  }
}


//update image
const updateImage = () => {
  console.log('here2i');
  if (imageLink !== displayData[6]) {
    Axios.post("http://localhost:3005/UpdateImage", { image: imageLink, id: search })
      .then(() => {
        setDisplayData([...displayData.slice(0, 6), pages, ...displayData.slice(7)]); // Update the first element of the array
      })
      .then(() => {
        alert("image updated");
      })
      .catch((error) => {
        console.error('Error updating img:', error);
      });
  }
}


//update description
const updateDescription = () => {
  console.log('here2d');
  if (description !== displayData[3]) {
    Axios.post("http://localhost:3005/UpdateDescription", { description: description, id: search })
      .then(() => {
        setDisplayData([...displayData.slice(0, 3), pages, ...displayData.slice(4)]); // Update the first element of the array
      })
      .then(() => {
        alert("description updated");
      })
      .catch((error) => {
        console.error('Error updating description:', error);
      });
  }
}


  return (
    <div>
    <div>
     <input
  type='number'
  onChange={handleInputChange}
  style={{
    width: '300px',   // Adjust the width as needed
    height: '40px',   // Adjust the height as needed
    borderRadius: '20px',  // Adjust the border-radius to make it rounded
    padding: '10px',  // Adjust the padding as needed
    fontSize: '16px',  // Adjust the font size as needed
    // Add any other styles you want to customize
  }}

/>
<button onClick={handleClick}>SEARCH ID</button>
    </div>
   
    <div className="add">
          <div className="form-container">
            <form id="bookForm" className="form" onSubmit={handleSubmit}>
              <div className="form-group">
                <div className="form-row">
                  <div className="form-item">
                    <div>Title:{displayData[0]}</div>
                    <label htmlFor="title">Title:</label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={title}
                      onChange={(event) => {
                        setTitle(event.target.value);
                        console.log(title)
                      }}
                    />
                  </div>
                  <div className="form-item">
                  <label htmlFor="isbn">ISBN:</label>
                  <input
  type="text"
  id="isbn"
  name="isbn"
  value={isbn} 
  onChange={(event) => {
    const isbnInput = event.target;
    const value = isbnInput.value.trim();

    // Check if the value is of length 13 before updating state
    
      setISBN13(value);
   
  }}
/>
                </div>

                </div>
      
                <div className="form-row">
                  <div className="form-item">
                    <label htmlFor="pages">No of Pages:</label>
                    <input
                      type="number"
                      id="pages"
                      name="pages"
                      value={pages} 
                      onChange={(event) => {
                        setPages(event.target.value);
                      }}
                    />
                  </div>
              
                </div>
      
                <div className="form-row">
                  <div className="form-item">
                    <label htmlFor="authorName">Author Name:</label>
                    <input
                      type="text"
                      id="authorName"
                      name="authorName"
                      value={authorName} 
                      onChange={(event) => {
                        setAuthorName(event.target.value);
                      }}
                    />
                  </div>
                  <div className="form-item">
                    <label htmlFor="format">Format:</label>
                    <select
                      id="format"
                      name="format"
                      value={format} 
                      onChange={(event) => {
                        setFormat(event.target.value);
                      }}
                    >
                      <option value="Hardcopy">Hardcopy</option>
                      <option value="Paperback">Paperback</option>
                    </select>
                  </div>
                </div>
      
                <div className="form-row">
                  <div className="form-item">
                    <label htmlFor="publisherId">Publisher Name:</label>
                    <input
                      type="text"
                      id="publisherId"
                      name="publisherId"
                      value={publisherId} 
                      onChange={(event) => {
                        setpubName(event.target.value);
                      }}
                    />
                  </div>
                  <div className="form-item">
                    <label htmlFor="category">Category:</label>
                    <input
                      type="text"
                      id="category"
                      name="category"
                      value={category} 
                      onChange={(event) => {
                        setCategory(event.target.value);
                      }}
                    />
                  </div>
                </div>
      
                <div className="form-row">
                  <div className="form-item">
                    <label htmlFor="price">Price:</label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={price} 
                      onChange={(event) => {
                        setPrice(event.target.value);
                      }}
                    />
                  </div>
                  <div className="form-item">
                    <label htmlFor="quantity">Quantity:</label>
                    <input
                      type="number"
                      id="quantity"
                      name="quantity"
                      value={quantity} 
                      onChange={(event) => {
                        setQuantity(event.target.value);
                      }}
                    />
                  </div>
                </div>
      
                <div className="form-row">
                  <div className="form-item">
                    <label htmlFor="description">Description:</label>
                    <textarea
                      id="description"
                      name="description"
                      rows="4"
                      value={description} 
                      onChange={(event) => {
                        setDescription(event.target.value);
                      }}
                    />
                  </div>
                </div>
      
                <div className="form-row">
                  <div className="form-item">
                    <label htmlFor="imageLink">Image Link:</label>
                    <input
                      type="text"
                      id="imageLink"
                      name="imageLink"
                      value={imageLink} 
                      onChange={(event) => {
                        setImage(event.target.value);
                      }}
                    />
                  </div>
                </div>
      
                <div className="form-row">
                  <button type="submit"  >
                    Done
                  </button>
                 
                </div>
              </div>
            </form>
          </div>
        </div>
      
    </div>
  )
}

export default Edit;
