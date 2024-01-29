const express = require("express");
const app = express();
const oracledb = require("oracledb");
const cors = require("cors");
const port = 3005;

app.use(cors());
app.use(express.json());

const dbConfig = {
  user: "c##interimproject",
  password: "123",
  connectString: "localhost/orcl",
};

async function initialize() {
  try {
    await oracledb.createPool(dbConfig);
  } catch (err) {
    console.error("Error creating a connection pool: " + err.message);
  }
}

initialize();
const query1=
`SELECT final_table.book_id, final_table.title, final_table.isbn13, final_table.publication_date, final_table.quantity, 
final_table.price, final_table.category, final_table.image_url, final_table.description, MAX(author.author_name) AS author_name, 
LISTAGG(review.customerreview, '; ') WITHIN GROUP (ORDER BY review.review_id) AS all_reviews FROM final_table LEFT JOIN book_author 
ON final_table.book_id = book_author.book_id LEFT JOIN author ON book_author.author_id = author.author_id LEFT JOIN book_reviews 
ON final_table.book_id = book_reviews.book_id LEFT JOIN review ON book_reviews.review_id = review.review_id 
GROUP BY final_table.book_id, final_table.title, final_table.isbn13, final_table.publication_date, 
final_table.quantity, final_table.price, final_table.category, final_table.image_url, final_table.description`

app.get("/InformationGet", async (req, res) => {
  let connection; // Declare the connection variable outside the try-catch block

  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute(query1);
    console.log(result.rows);
    res.send(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching data");
  } finally {
    // Release the connection in the finally block
    if (connection) {
      try {
        await connection.close(); // or connection.release() based on your Oracle driver
      } catch (err) {
        console.error("Error closing database connection:", err);
      }
    }
  }
});

//add book

app.post("/create", async (req, res) => {
  const title = req.body.title;
  const isbn = req.body.isbn;
  const pages = req.body.pages;
  const pubDate = req.body.pubDate;
  const description = req.body.description;
  const quantity = req.body.quantity;
  const price = req.body.price;
  const publisherId = req.body.publisherId;
  const category = req.body.category;
  const imageLink = req.body.imageLink;
  const authorName = req.body.authorName
  const format = req.body.format;
  let connection;

  try {
    console.log(req.body);
    connection = await oracledb.getConnection();
    console.log(publisherId);
    console.log(category);
    //console.log(formatted_date);
    
    const insertSQL =
      `BEGIN 
        INSERT INTO FINAL_TABLE(TITLE, ISBN13, NUM_PAGES, DESCRIPTION, QUANTITY, PRICE, CATEGORY, IMAGE_URL, FORMAT, PUBLICATION_DATE) 
        VALUES (:title, :isbn, :pages, :description, :quantity, :price, :category, :imageLink, :format, :pubDate); 
        END;`
    const result = await connection.execute(
      insertSQL,
      {
        title,
        isbn,
        pages,
        pubDate,
        description,
        quantity,
        price,
        category,
        imageLink,
        format,
      },
      { autoCommit: true }
      
    );
    console.log('result executed');
    const pubinsert =
      `DECLARE PID NUMBER; BEGIN SELECT PUBLISHER_ID INTO PID FROM PUBLISHER WHERE PUBLISHER_NAME = :publisherId ; 
      UPDATE FINAL_TABLE SET PUBLISHER_ID=PID WHERE ISBN13= :isbn; 
      EXCEPTION WHEN NO_DATA_FOUND THEN INSERT INTO PUBLISHER(PUBLISHER_NAME) 
      VALUES (:publisherId); 
      SELECT PUBLISHER_ID INTO PID FROM PUBLISHER WHERE PUBLISHER_NAME = :publisherId; 
      UPDATE FINAL_TABLE SET PUBLISHER_ID = PID WHERE ISBN13 = :isbn;
    END;`
     const result1 = await connection.execute(
      pubinsert,
      {
        publisherId,
        isbn,
      },
      { autoCommit: true }
     );
     console.log('result 1 executed');
      
    const authorinsert =
    `DECLARE AID NUMBER; BEGIN SELECT AUTHOR_ID INTO AID FROM AUTHOR WHERE AUTHOR_NAME = :authorName ; 
    EXCEPTION WHEN NO_DATA_FOUND THEN INSERT INTO AUTHOR(AUTHOR_NAME) VALUES (:authorName); 
    END;`
     const result2 = await connection.execute(
      authorinsert,
      {
        authorName,
      },
      { autoCommit: true }
     );
     console.log('result 2 executed');
     const bainsert =
     `DECLARE AID NUMBER; BID NUMBER; BEGIN SELECT AUTHOR_ID INTO AID FROM AUTHOR WHERE AUTHOR_NAME = :authorName ; 
     SELECT BOOK_ID INTO BID FROM FINAL_TABLE WHERE ISBN13=:isbn; 
     INSERT INTO BOOK_AUTHOR(BOOK_ID, AUTHOR_ID) VALUES(BID, AID); 
     END;`
     const result3 = await connection.execute(
      bainsert,
      {
        authorName,
        isbn,
      },
      { autoCommit: true }
     );
    
    console.log('done');
    res.send("Values Inserted");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error inserting values");
  }
  finally {
    // Release the connection in the finally block
    if (connection) {
      try {
        await connection.close(); // or connection.release() based on your Oracle driver
      } catch (err) {
        console.error("Error closing database connection:", err);
      }
    }
  }
});




const query2=
`select order_id,cust_order.customer_id,cust_order.order_date,order_history.status_date,
order_status.status_value from cust_order left join order_history using (order_id) left join order_status using (status_id)`

app.get("/OrderInformation", async (req, res) => {
  let connection;
  try {
     connection = await oracledb.getConnection();
    const result = await connection.execute(query2);
    console.log(result.rows);
    res.send(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching data");
  }finally {
    // Release the connection in the finally block
    if (connection) {
      try {
        await connection.close(); // or connection.release() based on your Oracle driver
      } catch (err) {
        console.error("Error closing database connection:", err);
      }
    }
  }
});

app.get("/orderdetails", async (req, res) => {
 
  
  const query5 = `
  select receipt.* , 
  final_table.title, total.order_total from receipt left join final_table on receipt.book_id=final_table.book_id 
  inner join total on receipt.order_id=total.order_id`
let connection;
  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute(query5);
    console.log('query5...');
    console.log(result.rows);
    res.send(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error showing more data");
  }finally {
    // Release the connection in the finally block
    if (connection) {
      try {
        await connection.close(); // or connection.release() based on your Oracle driver
      } catch (err) {
        console.error("Error closing database connection:", err);
      }
    }
  }
  
});



const query3=
`select customer_id , customer.first_name ||' '|| customer.last_name as CustomerName,customer.email , 
address.street_number ||' '|| address.street_name ||' '|| city.city_name as CustomerAddress 
from customer left join customer_address using(customer_id) left join address using (address_id) left join city using(city_id)`
app.get("/CustomerInformation", async (req, res) => {
  let connection; // Declare the connection variable outside the try-catch block

  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute(query3);
    console.log(result.rows);
    res.send(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching data");
  } finally {
    // Release the connection in the finally block
    if (connection) {
      try {
        await connection.close(); // or connection.release() based on your Oracle driver
      } catch (err) {
        console.error("Error closing database connection:", err);
      }
    }
  }
});

app.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  console.log(id);
  let connection;
  try {
    connection = await oracledb.getConnection();
    const deleteSQL = 
    `begin 
      DELETE FROM review WHERE review_id IN  (SELECT review_id FROM book_reviews WHERE book_id = :id); 
      delete from book_reviews where book_id=:id;delete from book_author where book_id=:id; 
      DELETE FROM final_table WHERE book_id = :id; 
      end;`
    const result = await connection.execute(
      deleteSQL,
      {
        id,
      },
      { autoCommit: true }
    );

    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting data");
  }finally {
    // Release the connection in the finally block
    if (connection) {
      try {
        await connection.close(); // or connection.release() based on your Oracle driver
      } catch (err) {
        console.error("Error closing database connection:", err);
      }
    }
  }
});

//show more for customer order information



app.get("/showmore", async (req, res) => {
 
  const query4 = 
  `select order_id,cust_order.customer_id ,order_history.status_date,order_status.status_value from cust_order 
  left join order_history using (order_id) left join order_status using (status_id)`


  let connection;
  try {
     connection = await oracledb.getConnection();
    const result = await connection.execute(query4);
    console.log(result.rows);
    res.send(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error showing more data");
  }
  finally {
    // Release the connection in the finally block
    if (connection) {
      try {
        await connection.close(); // or connection.release() based on your Oracle driver
      } catch (err) {
        console.error("Error closing database connection:", err);
      }
    }
  }
});

//getdatatoedit


app.get("/getEditData", async (req, res) => {
 
  const query6=
  `select final_table.title, final_table.isbn13,final_table.num_pages,final_table.description,final_table.quantity,
  final_table.price,final_table.image_url,final_table.format,final_table.publication_date,author.author_name ,
  publisher.publisher_name ,final_table.category 
  from final_table left join book_author using(book_id) left join publisher using (publisher_id) 
  left join author using (author_id) where book_id=:bookid`  
  const bookid = req.query.search;
  let connection;
  try {
     connection = await oracledb.getConnection();
    const result = await connection.execute(query6,{bookid,},);
    console.log(result.rows);
    res.send(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error showing more data");
  }
  finally {
    // Release the connection in the finally block
    if (connection) {
      try {
        await connection.close(); // or connection.release() based on your Oracle driver
      } catch (err) {
        console.error("Error closing database connection:", err);
      }
    }
  }
});
//update title
const queryutitle=`update final_table set title=:title where book_id=:bookid`
console.log('here');
app.post("/UpdateTitle", async (req, res) => {
  const title = req.body.title;
  const bookid= req.body.id;
  
  console.log('title:', title);
  console.log('id:', bookid);

  let connection;
  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute(queryutitle, { title, bookid, },{ autoCommit: true });
    res.send("Values Updated");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching data");
  } finally {
    // Release the connection in the finally block
    if (connection) {
      try {
        await connection.close(); // or connection.release() based on your Oracle driver
      } catch (err) {
        console.error("Error closing database connection:", err);
      }
    }
  }
});

//update format
const queryuformat=`update final_table set format=:format where book_id=:bookid`
console.log('here');
app.post("/UpdateFormat", async (req, res) => {
  const format = req.body.format;
  const bookid= req.body.id;
  
  console.log('format:', format);
  console.log('id:', bookid);

  let connection;
  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute(queryuformat, { format, bookid, },{ autoCommit: true });
    res.send("Values Updated");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching data");
  } finally {
    // Release the connection in the finally block
    if (connection) {
      try {
        await connection.close(); // or connection.release() based on your Oracle driver
      } catch (err) {
        console.error("Error closing database connection:", err);
      }
    }
  }
});

//updatepublisher query

const upublisher=
`DECLARE PID NUMBER;
 BEGIN  
 SELECT PUBLISHER_ID INTO PID FROM PUBLISHER WHERE PUBLISHER_NAME = :pname; 
 EXCEPTION WHEN NO_DATA_FOUND THEN INSERT INTO PUBLISHER(PUBLISHER_NAME) VALUES (:pname); 
 SELECT PUBLISHER_ID INTO PID FROM PUBLISHER WHERE PUBLISHER_NAME =:pname ;
 UPDATE FINAL_TABLE SET PUBLISHER_ID = PID where book_id=:bookid;
 END;`
app.post("/UpdatePublisher", async (req, res) => {
  const pname = req.body.pname;//changehere
  const bookid= req.body.id;
  
  console.log('pname:', pname);
  console.log('id:', bookid);

  let connection;
  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute(upublisher, { pname, bookid, },{ autoCommit: true });
    res.send("Values Updated");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching data");
  } finally {
    // Release the connection in the finally block
    if (connection) {
      try {
        await connection.close(); // or connection.release() based on your Oracle driver
      } catch (err) {
        console.error("Error closing database connection:", err);
      }
    }
  }
});





//update author query

const uauthor=
`DECLARE AID NUMBER;  
  BEGIN  
  SELECT AUTHOR_ID INTO AID FROM AUTHOR  WHERE AUTHOR_NAME = :authorName ; 
  EXCEPTION WHEN NO_DATA_FOUND THEN INSERT INTO  AUTHOR(AUTHOR_NAME) VALUES (:authorName);  
  SELECT AUTHOR_ID INTO AID FROM AUTHOR  WHERE AUTHOR_NAME = :authorName ;   
  UPDATE BOOK_AUTHOR SET Author_id=AID where book_id=:bookid;
  END;`
app.post("/UpdateAuthor", async (req, res) => {
  const authorName = req.body.aname;//changehere
  const bookid= req.body.id;
  
  console.log('pname:', authorName);
  console.log('id:', bookid);

  let connection;
  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute(uauthor, { authorName, bookid, },{ autoCommit: true });
    res.send("Values Updated");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching data");
  } finally {
    // Release the connection in the finally block
    if (connection) {
      try {
        await connection.close(); // or connection.release() based on your Oracle driver
      } catch (err) {
        console.error("Error closing database connection:", err);
      }
    }
  }
});




//update price
const queryuprice=`update final_table set price=:price where book_id=:bookid`
console.log('here');
app.post("/UpdatePrice", async (req, res) => {
  const price = req.body.price;
  const bookid= req.body.id;
  
  console.log('price:', price);
  console.log('id:', bookid);

  let connection;
  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute(queryuprice, { price, bookid, },{ autoCommit: true });
    res.send("Values Updated");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching data");
  } finally {
    // Release the connection in the finally block
    if (connection) {
      try {
        await connection.close(); // or connection.release() based on your Oracle driver
      } catch (err) {
        console.error("Error closing database connection:", err);
      }
    }
  }
});


//update category

const queryucategory=`update final_table set category=:category where book_id=:bookid`
console.log('here');
app.post("/UpdateCategory", async (req, res) => {
  const category = req.body.category;
  const bookid= req.body.id;
  
  console.log('title:', category);
  console.log('id:', bookid);

  let connection;
  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute(queryucategory, { category, bookid, },{ autoCommit: true });
    res.send("Values Updated");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching data");
  } finally {
    // Release the connection in the finally block
    if (connection) {
      try {
        await connection.close(); // or connection.release() based on your Oracle driver
      } catch (err) {
        console.error("Error closing database connection:", err);
      }
    }
  }
});


//update pages

const queryupages=`update final_table set num_pages=:pages where book_id=:bookid`
console.log('here');
app.post("/UpdatePages", async (req, res) => {
  const pages = req.body.pages;
  const bookid= req.body.id;
  
  console.log('pages:', pages);
  console.log('id:', bookid);

  let connection;
  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute(queryupages, { pages, bookid, },{ autoCommit: true });
    res.send("Values Updated");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching data");
  } finally {
    // Release the connection in the finally block
    if (connection) {
      try {
        await connection.close(); // or connection.release() based on your Oracle driver
      } catch (err) {
        console.error("Error closing database connection:", err);
      }
    }
  }
});







//update isbn

const queryuisbn=`update final_table set isbn13=:isbn where book_id=:bookid`
console.log('here');
app.post("/UpdateISBN", async (req, res) => {
  const isbn = req.body.isbn;
  const bookid= req.body.id;
  
  console.log('isbn:', isbn);
  console.log('id:', bookid);

  let connection;
  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute(queryuisbn, { isbn, bookid, },{ autoCommit: true });
    res.send("Values Updated");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching data");
  } finally {
    // Release the connection in the finally block
    if (connection) {
      try {
        await connection.close(); // or connection.release() based on your Oracle driver
      } catch (err) {
        console.error("Error closing database connection:", err);
      }
    }
  }
});






//update stock
const queryustock=`update final_table set quantity=:quantity where book_id=:bookid`
console.log('here');
app.post("/UpdateQuantity", async (req, res) => {
  const quantity = req.body.quantity;
  const bookid= req.body.id;
  
  console.log('quantity:', quantity);
  console.log('id:', bookid);

  let connection;
  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute(queryustock, { quantity, bookid, },{ autoCommit: true });
    res.send("Values Updated");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching data");
  } finally {
    // Release the connection in the finally block
    if (connection) {
      try {
        await connection.close(); // or connection.release() based on your Oracle driver
      } catch (err) {
        console.error("Error closing database connection:", err);
      }
    }
  }
});

//update image
const queryuimage=`update final_table set image_url=:image where book_id=:bookid`
console.log('here');
app.post("/UpdateImage", async (req, res) => {
  const image = req.body.image;
  const bookid= req.body.id;
  
  console.log('image:', image);
  console.log('id:', bookid);

  let connection;
  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute(queryuimage, {image, bookid, },{ autoCommit: true });
    res.send("Values Updated");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching data");
  } finally {
    // Release the connection in the finally block
    if (connection) {
      try {
        await connection.close(); // or connection.release() based on your Oracle driver
      } catch (err) {
        console.error("Error closing database connection:", err);
      }
    }
  }
});


//update description
const queryudescription=`update final_table set description=:description where book_id=:bookid`
console.log('here');
app.post("/UpdateDescription", async (req, res) => {
  const description = req.body.description;
  const bookid= req.body.id;
  
  console.log('description:', description);
  console.log('id:', bookid);

  let connection;
  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute(queryudescription, {description, bookid, },{ autoCommit: true });
    res.send("Values Updated");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching data");
  } finally {
    // Release the connection in the finally block
    if (connection) {
      try {
        await connection.close(); // or connection.release() based on your Oracle driver
      } catch (err) {
        console.error("Error closing database connection:", err);
      }
    }
  }
});









app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});


