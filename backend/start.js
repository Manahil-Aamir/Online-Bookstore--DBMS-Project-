const express = require("express");
const app = express();
const oracledb = require("oracledb");
const cors = require("cors");
const port = 3008;

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


//add checkout details
app.post('/checkoutdetails', async (req, res) => {
  const streetnum = req.body.streetnum;
  const streetname = req.body.streetname;
  const city = req.body.city;
  const zipcode = req.body.zipcode;
  const fname = req.body.fname;
  const lname = req.body.lname;
  const email = req.body.email;
  const mobile = req.body.mobile;
  const total = req.body.total;

  let connection;

  try {
    console.log('adding first');
    connection = await oracledb.getConnection();
   const insertAddress = 
    `DECLARE v_streetnum NUMBER; v_streetname VARCHAR2(200); v_city VARCHAR2(100); v_zipcode NUMBER(5); CI NUMBER; 
     BEGIN
      SELECT CITY_ID INTO CI FROM CITY WHERE CITY_NAME=:city;
      SELECT STREET_NUMBER, STREET_NAME, CITY_ID, ZIPCODE INTO v_streetnum, v_streetname, v_city, v_zipcode 
      FROM ADDRESS 
      WHERE STREET_NUMBER = :streetnum AND STREET_NAME = :streetname AND CITY_ID = CI AND ZIPCODE = :zipcode; 
      EXCEPTION WHEN NO_DATA_FOUND THEN 
      INSERT INTO ADDRESS(STREET_NUMBER, STREET_NAME, CITY_ID, ZIPCODE) VALUES(:streetnum, :streetname, CI,  :zipcode); END;`
    const result = await connection.execute(
      insertAddress,
      {
        streetnum,
        streetname,
        city,
        zipcode,
      },
      { autoCommit: true }
    );
    console.log('adding another');
    const insertCustomer = 
    `DECLARE E VARCHAR2(350); 
     BEGIN 
      SELECT EMAIL INTO E FROM CUSTOMER WHERE EMAIL = :email; 
      EXCEPTION WHEN NO_DATA_FOUND THEN 
      INSERT INTO CUSTOMER(FIRST_NAME, LAST_NAME, EMAIL, MOBILE_NUMBER) 
      VALUES(:fname, :lname, :email, :mobile); END;`
    const result1 = await connection.execute(
      insertCustomer,
      {
        fname,
        lname,
        email,
        mobile,
      },
      { autoCommit: true }
    );
    console.log('order');
    const insertCustomerAddress = 
    `DECLARE 
      C NUMBER; 
      A NUMBER; 
      ADD NUMBER; 
      CUST NUMBER; 
      CI NUMBER;
     BEGIN
      SELECT CITY_ID INTO CI FROM CITY WHERE CITY_NAME=:city; 
      SELECT CUSTOMER_ID INTO C FROM CUSTOMER WHERE EMAIL = :email; 
      SELECT ADDRESS_ID INTO A FROM ADDRESS WHERE STREET_NUMBER = :streetnum AND 
      STREET_NAME = :streetname AND CITY_ID = CI AND ZIPCODE = :zipcode; 
      BEGIN SELECT ADDRESS_ID, CUSTOMER_ID INTO ADD, CUST FROM CUSTOMER_ADDRESS WHERE ADDRESS_ID=A AND CUSTOMER_ID = C; 
      EXCEPTION WHEN NO_DATA_FOUND THEN INSERT INTO CUSTOMER_ADDRESS(ADDRESS_ID, CUSTOMER_ID) VALUES(A, C); 
      END; END;`
    const result2 = await connection.execute(
      insertCustomerAddress,
      {
        streetnum,
        streetname,
        city,
        zipcode,
        email,
      },
      { autoCommit: true }
    );
    console.log('last one');
    console.log('total:', total);
    const insertCustomerOrder = 
    `DECLARE 
      CI NUMBER;
      C NUMBER; 
      A NUMBER; 
      LastOrderId NUMBER; 
    BEGIN 
      SELECT CITY_ID INTO CI FROM CITY WHERE CITY_NAME=:city;
      SELECT CUSTOMER_ID INTO C FROM CUSTOMER WHERE EMAIL = :email; 
      SELECT ADDRESS_ID INTO A FROM ADDRESS WHERE STREET_NUMBER = :streetnum 
      AND STREET_NAME = :streetname AND CITY_ID = CI AND ZIPCODE = :zipcode; 
      INSERT INTO CUST_ORDER(DEST_ADDRESS_ID, CUSTOMER_ID, ORDER_DATE) VALUES(A, C, SYSDATE) RETURNING ORDER_ID INTO LastOrderId;
      INSERT INTO ORDER_HISTORY VALUES(LastOrderId, 1, SYSDATE); 
      INSERT INTO TOTAL VALUES(LastOrderId, :total);
      END;`
    const result3 = await connection.execute(
      insertCustomerOrder,
      {
        streetnum,
        streetname,
        city,
        zipcode,
        email,
        total,
      },
      { autoCommit: true }
    );
    console.log("done finally");
    res.send({ success: true, message: "Password updated successfully" });

    
    
    
  } catch (error) {
    console.error('Error executing SQL query:', error);
    res.status(500).send('error');
  }
  finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        res.status(500).send("Error");
        console.error(err.message);
      }
    }
  }
});

//add contact us details
app.post('/contactusdetails', async (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const message = req.body.message;
  
  let connection;

  try {
    console.log('adding');
    connection = await oracledb.getConnection();
   const insertContact = 
   `BEGIN 
      INSERT INTO QUERY(FIRST_NAME, LAST_NAME, EMAIL, MESSAGE) 
      VALUES(:firstName, :lastName, :email,  :message); END;`
    const result = await connection.execute(
      insertContact,
      {
        firstName,
        lastName,
        email,
        message,
      },
      { autoCommit: true }
    );
    res.send({ success: true, message: "Query inserted successfully" });
    
  } catch (error) {
    console.error('Error executing SQL query:', error);
    res.status(500).send('error');
  }
  finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        res.status(500).send("Error");
        console.error(err.message);
      }
    }
  }
});

//update quantity of items
app.post('/updatequantity', async (req, res) => {
  const id = req.body.val;
  const quantity = req.body.quantity;
  const val = Number(id.productId);
  const price = parseInt(req.body.price,10);
  const t = req.body.total;

  
  let connection;

  try {
    console.log("id is :", typeof(Number(id.productId)));
    console.log('adding');
    console.log(val, " ", quantity)
    console.log('ID:', val, typeof val);
    console.log('Quantity:', quantity, typeof quantity);
    console.log('Price:', price, typeof price);
    console.log('Total:', t, typeof t);

    connection = await oracledb.getConnection();
   const updateqty = `BEGIN UPDATE FINAL_TABLE SET QUANTITY= QUANTITY-:quantity WHERE BOOK_ID=:val; END;`
    const result = await connection.execute(
      updateqty,
      {
       val,
       quantity,
      },
      { autoCommit: true }
    );
    const receiptquery = 
    `DECLARE
      O NUMBER;
    BEGIN
      SELECT MAX(ORDER_ID) INTO O
      FROM CUST_ORDER;
      INSERT INTO RECEIPT
      VALUES(O, :val, :price, :quantity, :t);
    END;
      `
      const result1 = await connection.execute(
        receiptquery,
        {
         val,
         quantity,
         price,
         t,
        },
        { autoCommit: true }
      );
    res.send({ success: true, message: "Query update done successfully" });
    
  } catch (error) {
    console.error('Error updating:', error);
    res.status(500).send('error');
  }
  finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        res.status(500).send("Error");
        console.error(err.message);
      }
    }
  }
});

//customers end
const query1=
`Select final_table.title, final_table.quantity, final_table.price,final_table.category,final_table.image_url,
 author.author_name,final_table.book_id 
 from final_table  left join book_author on final_table.book_id=book_author.book_id left join author using (author_id)`
const query4=
`Select final_table.title, final_table.quantity, final_table.price,final_table.category,final_table.image_url,author.author_name,final_table.book_id from final_table  left join book_author on final_table.book_id=book_author.book_id left join author using (author_id) where final_table.category=:category`
app.get("/DisplayItems", async (req, res) => {
let category = req.query.category;
console.log('category:', category);
console.log('category:', category);
  let connection; // Declare the connectiSon variable outside the try-catch block

  try {
    let flag=0;
  if (category === undefined) {
    flag = 1; // Set flag to 1 if category is undefined
    category = ''; // Assign an empty string to category
  }
 
    connection = await oracledb.getConnection();
    if (flag==0){
    const result = await connection.execute(query4,{category,},);
    console.log("with ");
    res.send(result.rows);
    }else{
      console.log(flag);
      const result = await connection.execute(query1);
      console.log("without ");
    res.send(result.rows);
    }
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

const query2=
`Select final_table.book_id,final_table.title,final_table.isbn13, final_table.publication_date, final_table.quantity, 
final_table.price,final_table.category,final_table.image_url, final_table.description,author.author_name 
from final_table  left join book_author on final_table.book_id=book_author.book_id left join author using (author_id)   
where final_table.book_id=:prodid`
app.get("/GetProduct", async (req, res) => {
    let connection; // Declare the connection variable outside the try-catch block
    const prodid = req.query.productId;
    try {
      connection = await oracledb.getConnection();
      const result = await connection.execute(query2,{prodid},);
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

const query22=
  `Select  review.customerreview from final_table  left join book_reviews on final_table.book_id=book_reviews.book_id  
  left join review using (review_id) where final_table.book_id=:prodid`
app.get("/GetReview", async (req, res) => {
  let connection; // Declare the connection variable outside the try-catch block
  const prodid = req.query.productId;
  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute(query22,{prodid},);
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


  const query3=`select distinct category from final_table `

app.get("/getCategory", async (req, res) => {
  let connection;
  try {
     connection = await oracledb.getConnection();
    const result = await connection.execute(query3);
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


app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

//add review

const queryreview=
`begin INSERT INTO review (customerreview) VALUES (:review);
insert into book_reviews(book_id) Values(:prodid);end;`

app.post("/addReview", async (req, res) => {
  const prodid = req.body.id.productId;
  const review = req.body.userRev;
  console.log('prodid', prodid);
  console.log('rev', review);

  let connection;
  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute(queryreview, { prodid, review, },{ autoCommit: true });
    res.send("Values Inserted");
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

