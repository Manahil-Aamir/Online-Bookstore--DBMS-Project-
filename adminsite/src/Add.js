import React from 'react';
import './Styles/Add.css';
import { useState } from "react";
import Axios from "axios";


function Add(){
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
  const validateTitle = (title) => {
    return title.trim() !== '';
  };
  
  const validateISBN = (isbn) => {
    return /^\d{13}$/.test(isbn);
  };
  
  const validatePages = (pages) => {
    return pages > 0;
  };
  
  const validatePubDate = (pubDate) => {
    // Add your date validation logic here
    // For example, you might use a library like moment.js for date validation
    return pubDate !== undefined && pubDate !== null;
  };
  
  const validateDescription = (description) => {
    return description.trim() !== '';
  };
  
  const validateQuantity = (quantity) => {
    return quantity >= 0;
  };
  
  const validatePrice = (price) => {
    return price > 0;
  };
  
  const validatePublisherId = (publisherId) => {
    return publisherId.trim() !== '';
  };
  
  const validateCategory = (category) => {
    return category.trim() !== '';
  };
  
  const validateImageLink = (imageLink) => {
    // Add your URL validation logic here
    // For example, you might use a regular expression or a library like validator.js
    return imageLink.trim() !== '';
  };
  
  const validateAuthorName = (authorName) => {
    return authorName.trim() !== '';
  };
  
  const validateFormat = (format) => {
    return format.trim() !== '';
  };
  
  const addBook = async(event) => {

    // Set a default date if pubDate is not provided
    // This sets it to the current date and time
    event.preventDefault();
    // Validate fields
    if (
      !validateTitle(title) ||
      !validateISBN(isbn) ||
      !validatePages(pages) ||
      !validatePubDate(pubDate) ||
      !validateDescription(description) ||
      !validateQuantity(quantity) ||
      !validatePrice(price) ||
      !validatePublisherId(publisherId) ||
      !validateCategory(category) ||
      !validateImageLink(imageLink) ||
      !validateAuthorName(authorName) ||
      !validateFormat(format)
    ) {
      // Show an alert if any validation fails
      alert('Please fill in all fields with valid values.');
      return;
    }
  
    // All validations passed, make the Axios request
    await Axios.post("http://localhost:3005/create", {
      title: title,
      isbn: isbn,
      pages: pages,
      pubDate: pubDate,
      description: description,
      quantity: quantity,
      price: price,
      publisherId: publisherId,
      category: category,
      imageLink: imageLink,
      authorName: authorName,
      format: format,
    })
      .then(() => {
        // Update state with the new book
        setBookList([
          ...BookList,
          {
            title: title,
            isbn: isbn,
            pages: pages,
            pubDate: pubDate,
            description: description,
            quantity: quantity,
            price: price,
            publisherId: publisherId,
            category: category,
            imageLink: imageLink,
            authorName: authorName,
            format: format,
          },
        ]);
        console.log(setBookList);
        setNewRecordAdded(true);
        document.getElementById('bookForm').reset();

        // Display success alert
        alert('Book is Added');
      })
      .catch((error) => {
        console.error('Error adding book:', error);
      });
  };
  
  const validateISBNO = (value) => {
    const isValid = /^\d{13}$/.test(value);
    return isValid ? "" : "ISBN must be 13 digits";
  };
    
      return (
        <div className="add">
          <div className="form-container">
            <form id="bookForm" className="form" onSubmit={addBook}>
              <div className="form-group">
                <div className="form-row">
                  <div className="form-item">
                    <label htmlFor="title">Title:</label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      required
                      onChange={(event) => {
                        setTitle(event.target.value);
                      }}
                    />
                  </div>
                  <div className="form-item">
                  <label htmlFor="isbn">ISBN: <span style={{ color: '#ff0000', fontSize: '0.7em', marginTop: '5px', display: 'block' }}>{validateISBNO(isbn)}</span></label>
                  <input
                    type="text"
                    id="isbn"
                    name="isbn"
                    
                    required
                    onChange={(event) => {
                      const isbnInput = event.target;
                      const value = isbnInput.value.trim();
                
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
                      required
                      onChange={(event) => {
                        setPages(event.target.value);
                      }}
                    />
                  </div>
                  <div className="form-item">
                    <label htmlFor="pubDate">Publication Date:</label>
                    <input
                      type="date"
                      id="pubDate"
                      name="pubDate"
                      required
                      onChange={(event) => {
                        const inputDate = new Date(event.target.value);
                        const day = inputDate.getDate().toString().padStart(2, '0');
                        const month = inputDate.toLocaleString('default', {
                          month: 'short',
                        }).toUpperCase();
                        const year = inputDate.getFullYear();
                        const formattedPubDate = `${day}-${month}-${year}`;
                        setpubDate(formattedPubDate);
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
                      required
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
                      required
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
                      required
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
                      required
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
                      required
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
                      required
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
                      onChange={(event) => {
                        setImage(event.target.value);
                      }}
                    />
                  </div>
                </div>
      
                <div className="form-row">
                  <button type="submit">
                    Done
                  </button>
                 
                </div>
              </div>
            </form>
          </div>
        </div>
      );
      
      
      
                }
export default Add;