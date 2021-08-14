DROP INDEX "INDEX_LOAF_OF_CHEESE_STOCKED_EMPLOYEE_ID";
DROP INDEX "INDEX_ORDERS_EMPLOYEE_ID";
DROP MATERIALIZED VIEW "LOAFS_WITH_TYPE";
DROP TABLE LOAF_OF_CHEESE CASCADE CONSTRAINTS;
DROP TABLE EMPLOYEE CASCADE CONSTRAINTS;
DROP TABLE SUPPLIER CASCADE CONSTRAINTS;
DROP TABLE CHEESE_TYPE CASCADE CONSTRAINTS;
DROP TABLE ORDERS CASCADE CONSTRAINTS;
DROP TABLE PART_OF_LOAF CASCADE CONSTRAINTS;
DROP TABLE OFFER CASCADE CONSTRAINTS;
DROP SEQUENCE "EMPLOYEE_ID_SEQ";


CREATE TABLE EMPLOYEE(
    --ID generated in trigger
     ID INT DEFAULT NULL PRIMARY KEY,
     Job_type VARCHAR2(16) CHECK (Job_type IN ('shop','stock')),
     Contract_type VARCHAR2(32),
     Salary NUMBER(16),
     Employed_since DATE,
     Name VARCHAR2(128),
     Address VARCHAR2(256),
     Phone_number VARCHAR2(16),
     Email VARCHAR2(256),
     Bank_account VARCHAR2(64),
     
     CONSTRAINT Phone_number_format      
     CHECK ( REGEXP_LIKE (Phone_number, '^(([+]|00)\d{3})?\d{9}$') ),
     
     CONSTRAINT Email_format_emp 
     CHECK ( REGEXP_LIKE (Email, '^.*@.*[.][a-zA-Z]+$') )
);


CREATE TABLE SUPPLIER(
     EIN INT PRIMARY KEY,
     Name VARCHAR2(128),
     Address VARCHAR2(256),
     Phone_number VARCHAR2(16),
     Email VARCHAR2(256),
     Bank_account VARCHAR2(64),
     
     CONSTRAINT Phone_number_format_sup      
     CHECK ( REGEXP_LIKE (Phone_number, '^(([+]|00)\d{3})?\d{9}$') ),

     CONSTRAINT Email_format_sup
     CHECK ( REGEXP_LIKE (Email, '^.*@.*[.][a-zA-Z]+$') )
);

CREATE TABLE CHEESE_TYPE(
     ID INT GENERATED AS IDENTITY PRIMARY KEY,
     Name VARCHAR2(128),
     Animal VARCHAR2(128),
     Fat INT,
     Type VARCHAR2(128),
     Country VARCHAR2(128),

     CONSTRAINT Fat_format
     CHECK ( Fat BETWEEN 0 AND 100)
);

CREATE TABLE ORDERS(
     Order_ID int GENERATED AS IDENTITY PRIMARY KEY,
     Order_date DATE,
     Amount FLOAT(32),
     Employee_id INT, --reference to Employee who create order

     FOREIGN KEY (Employee_id)
     REFERENCES EMPLOYEE (ID)
);

--N*N relationship table
CREATE TABLE OFFER(
     ID INT GENERATED AS IDENTITY PRIMARY KEY,
     Cheese_type_ID INT,
     Supplier_id INT,

     FOREIGN KEY (Cheese_type_ID)
     REFERENCES CHEESE_TYPE (ID),
     FOREIGN KEY (Supplier_id)
     REFERENCES SUPPLIER (EIN)
);

CREATE TABLE LOAF_OF_CHEESE(
    ID INT GENERATED AS IDENTITY PRIMARY KEY,
    Weight FLOAT(32),
    Original_weight FLOAT(32),
    Expiration_date DATE,
    Loaf_location VARCHAR2(16),
    Price_for_unit INTEGER,
    --TODO... check if supplier offer this type of cheese
    Supplier_id INT, --reference to SUPPLIER TABLE
    Cheese_type_id INT, --reference to CHEESE_TYPE TABLE
    Stocked_employee_id INT, --reference to EMPLOYEE who stocked current loaf of cheese

    FOREIGN KEY (Supplier_id)
    REFERENCES SUPPLIER (EIN),
    FOREIGN KEY (Cheese_type_id)
    REFERENCES CHEESE_TYPE (ID),
    FOREIGN KEY (Stocked_employee_id)
    REFERENCES EMPLOYEE (ID),

    CONSTRAINT Loaf_location_values
    CHECK (Loaf_location IN ('supplier', 'shop', 'stock'))
);

--N*N relationship table
CREATE TABLE PART_OF_LOAF(
     ID INT GENERATED AS IDENTITY PRIMARY KEY,
     Weight FLOAT(32),
     Price NUMBER,
     Loaf_ID INT,
     Order_ID INT,
     
     FOREIGN KEY (Loaf_ID)
     REFERENCES LOAF_OF_CHEESE (ID),
     FOREIGN KEY (Order_ID)
     REFERENCES ORDERS (Order_ID)   
);

--Update weight of loaf
SET SERVEROUTPUT ON;
CREATE OR REPLACE TRIGGER PART_OF_LOAF_ON_UPDATE
    AFTER INSERT OR UPDATE OF WEIGHT ON PART_OF_LOAF
FOR EACH ROW
    DECLARE
    current_weight FLOAT(32);
    update_weight FLOAT(32);
    
BEGIN
    SELECT LOAF_OF_CHEESE.WEIGHT INTO current_weight FROM LOAF_OF_CHEESE WHERE LOAF_OF_CHEESE."ID" = :NEW."LOAF_ID";
    IF :OLD."WEIGHT" IS NULL THEN
        update_weight := current_weight - :NEW."WEIGHT";
    ELSE
        update_weight := :NEW."WEIGHT" - :OLD."WEIGHT" ;
        update_weight := current_weight - update_weight;
    END IF;
    UPDATE LOAF_OF_CHEESE SET WEIGHT = update_weight WHERE "ID" = :NEW."LOAF_ID";
END;
/

--Autogenerating ID for employee to demonstrate trigger
CREATE SEQUENCE "EMPLOYEE_ID_SEQ";

CREATE OR REPLACE TRIGGER "EMPLOYEE_ID_SEQ"
	BEFORE INSERT ON "EMPLOYEE"
	FOR EACH ROW
BEGIN
	IF :NEW."ID" IS NULL THEN
		:NEW."ID" := "EMPLOYEE_ID_SEQ".NEXTVAL;
	END IF;
END;
/










--Insert employees
INSERT INTO EMPLOYEE (JOB_TYPE, CONTRACT_TYPE, SALARY, EMPLOYED_SINCE, NAME, ADDRESS, PHONE_NUMBER, EMAIL, BANK_ACCOUNT) 
VALUES ('stock', 'HPP', 30000, TO_DATE('2021-01-01', 'YYYY-MM-DD'), 'Jan Novak', 'Jarni 313, Brno 602 00', '+420123456789', 'novak@gmail.com', '00000000/9999' );

INSERT INTO EMPLOYEE (JOB_TYPE, CONTRACT_TYPE, SALARY, EMPLOYED_SINCE, NAME, ADDRESS, PHONE_NUMBER, EMAIL, BANK_ACCOUNT) 
VALUES ('shop', 'HPP', 30000, TO_DATE('2020-01-01', 'YYYY-MM-DD'), 'Adam Carter', 'Pekarska 2, Brno 602 00', '00420987654321', 'carter@parttimejob.co.uk', '00000001/9999' );


--Insert CheeseTypes
INSERT INTO CHEESE_TYPE (NAME, ANIMAL, FAT, TYPE, COUNTRY)
VALUES ('Eidam', 'Krava', 30, 'Normalni', 'Ceska Republika');

INSERT INTO CHEESE_TYPE (NAME, ANIMAL, FAT, TYPE, COUNTRY)
VALUES ('Hermelin', 'Kozi', 45, 'Plesnivy', 'Nemecko');

INSERT INTO CHEESE_TYPE (NAME, ANIMAL, FAT, TYPE, COUNTRY)
VALUES ('Pule', 'Osel a koza', 1, 'Normalni', 'Srbsko');

--Insert Suppliers
INSERT INTO SUPPLIER (EIN, NAME, ADDRESS, PHONE_NUMBER, EMAIL, BANK_ACCOUNT)
VALUES (63275635, 'Madeta a.s.', 'Rudolfovsk? t?. 246/83, ?esk? Bud?jovice 4, 370 01 ?esk? Bud?jovice', '387736111','madeta@madeta.cz', '10433635/6200');

INSERT INTO SUPPLIER (EIN, NAME, ADDRESS, PHONE_NUMBER, EMAIL, BANK_ACCOUNT)
VALUES (45192294, 'Ml?k?rna Kun?n a.s.', 'Kun?n 291, 742 53 Kun?n', '556620111','info@mlekarna-kunin.cz', '9208801/0100');


--Insert offers

--Madeta offer both types of cheese
INSERT INTO OFFER (CHEESE_TYPE_ID, SUPPLIER_ID)
VALUES (1,63275635);

INSERT INTO OFFER (CHEESE_TYPE_ID, SUPPLIER_ID)
VALUES (2,63275635);

--Kunin offer only Hermelin
INSERT INTO OFFER (CHEESE_TYPE_ID, SUPPLIER_ID)
VALUES (2,45192294);


--insert loaf of cheese
INSERT INTO LOAF_OF_CHEESE (WEIGHT, ORIGINAL_WEIGHT, EXPIRATION_DATE, LOAF_LOCATION, PRICE_FOR_UNIT, SUPPLIER_ID, CHEESE_TYPE_ID, STOCKED_EMPLOYEE_ID)
VALUES (3.0, 3.0, TO_DATE('2021-05-25', 'YYYY-MM-DD'), 'shop', 300, 63275635, 1, 1);

INSERT INTO LOAF_OF_CHEESE (WEIGHT, ORIGINAL_WEIGHT, EXPIRATION_DATE, LOAF_LOCATION, PRICE_FOR_UNIT, SUPPLIER_ID, CHEESE_TYPE_ID, STOCKED_EMPLOYEE_ID)
VALUES (2.0, 2.0, TO_DATE('2020-05-10', 'YYYY-MM-DD'), 'shop', 500, 63275635, 2, 1);

INSERT INTO LOAF_OF_CHEESE (WEIGHT, ORIGINAL_WEIGHT, EXPIRATION_DATE, LOAF_LOCATION, PRICE_FOR_UNIT, SUPPLIER_ID, CHEESE_TYPE_ID, STOCKED_EMPLOYEE_ID)
VALUES (5.0, 5.0, TO_DATE('2021-07-30', 'YYYY-MM-DD'), 'shop', 500, 63275635, 2, 1);


--Create order

INSERT INTO ORDERS (ORDER_DATE, AMOUNT, EMPLOYEE_ID)
VALUES (TO_DATE('2021-04-20', 'YYYY-MM-DD'), 1.5, 2);

INSERT INTO ORDERS (ORDER_DATE, AMOUNT, EMPLOYEE_ID)
VALUES (TO_DATE('2021-04-21', 'YYYY-MM-DD'), 1.2, 2);

--Fill order
INSERT INTO PART_OF_LOAF (WEIGHT, PRICE, LOAF_ID, ORDER_ID)
VALUES (0.5, 150, 1, 1);

INSERT INTO PART_OF_LOAF (WEIGHT, PRICE, LOAF_ID, ORDER_ID)
VALUES (0.5, 150, 2, 1);

INSERT INTO PART_OF_LOAF (WEIGHT, PRICE, LOAF_ID, ORDER_ID)
VALUES (0.5, 150, 3, 1);

INSERT INTO PART_OF_LOAF (WEIGHT, PRICE, LOAF_ID, ORDER_ID)
VALUES (0.5, 150, 3, 2);

-- SUBSTRING FUNCTION IN SELECTS IS USED TO FORMAT OUTPUT

--Select: This select JOINS TWO TABLES and prints all orders with information about which employee created which orders
SELECT
    SUBSTR(EMP."NAME",1,30)                     AS "EMPLOYEE THAT CREATED ORDER",
    ORD."ORDER_ID"                              AS "ORDER ID",
    TO_CHAR(ORD."ORDER_DATE", 'dd.mm.yyyy')     AS "ORDER DATE"
FROM
    "EMPLOYEE"  EMP
JOIN 
    "ORDERS"    ORD   ON EMP."ID" = ORD."EMPLOYEE_ID";
    
--Select: This select JOINS TWO TABLES and prints all suppliers that have at least one loaf of cheese available in our shop/stock
SELECT 
    DISTINCT SUPP."EIN",
    SUBSTR(SUPP."NAME",1,30) AS "Supplier name"
FROM
    "SUPPLIER" SUPP
JOIN 
    "LOAF_OF_CHEESE" LOAF ON SUPP."EIN" = LOAF."SUPPLIER_ID"
WHERE
    LOAF."LOAF_LOCATION" IN ('stock','shop');
    
--Select: This select JOINS THREE TABLES and prints all cheese types with origin country Czech Republic along with information about supplier
SELECT
    SUBSTR(SUPP."NAME",1,30) AS "Supplier",
    SUBSTR(SUPP."EMAIL",1,30) AS "Supplier email",
    SUBSTR(CTYPE."NAME",1,30) AS "Cheese name",
    SUBSTR(CTYPE."TYPE",1,30) AS "Cheese type",
    SUBSTR(CTYPE."ANIMAL",1,30) AS "From animal",
    SUBSTR(CTYPE."FAT",1,30) AS "Cheese fat",
    SUBSTR(CTYPE."COUNTRY",1,30) AS "Made in"
FROM
    "OFFER"    OFFER
JOIN 
    "CHEESE_TYPE" CTYPE  ON OFFER."CHEESE_TYPE_ID" = CTYPE."ID"
JOIN
    "SUPPLIER" SUPP ON OFFER."SUPPLIER_ID" = SUPP."EIN"
WHERE
    CTYPE."COUNTRY" = 'Ceska Republika';
    
--Select: This select JOINS FOUR TABLES and prints all cheese types made that have not expired yet
SELECT
    SUBSTR(SUPP."NAME",1,30) AS "Supplier",
    SUBSTR(SUPP."EMAIL",1,30) AS "Supplier email",
    SUBSTR(CTYPE."NAME",1,30) AS "Cheese name",
    SUBSTR(CTYPE."TYPE",1,30) AS "Cheese type",
    SUBSTR(CTYPE."ANIMAL",1,30) AS "From animal",
    SUBSTR(CTYPE."FAT",1,30) AS "Cheese fat",
    SUBSTR(CTYPE."COUNTRY",1,30) AS "Made in",
    TO_CHAR(LOAF."EXPIRATION_DATE", 'dd.mm.yyyy') AS "Exp. date"
FROM
    "OFFER"    OFFER
JOIN 
    "CHEESE_TYPE" CTYPE  ON OFFER."CHEESE_TYPE_ID" = CTYPE."ID"
JOIN
    "SUPPLIER" SUPP ON OFFER."SUPPLIER_ID" = SUPP."EIN"
JOIN
    "LOAF_OF_CHEESE" LOAF ON LOAF."CHEESE_TYPE_ID" = CTYPE."ID" AND LOAF."SUPPLIER_ID" = SUPP."EIN"
WHERE
    LOAF."EXPIRATION_DATE" > SYSDATE;
    
--Select: This select uses GROUP BY and prints employees who have created order and counts how many orders they created
SELECT
    SUBSTR(EMP."NAME",1,30) AS "EMPLOYEE THAT CREATED ORDER",
    COUNT(ORD."ORDER_ID")   AS "NO. OF ORDERS"
FROM
    "EMPLOYEE"    EMP
JOIN
    "ORDERS"      ORD ON EMP."ID" = ORD."EMPLOYEE_ID" 
GROUP BY 
    SUBSTR(EMP."NAME",1,30);
    
    
--Select: This select joins 4 tables, uses GROUP BY and prints which types of cheese are being sold the most
-- CAST IS USED TO FORMAT OUTPUT
SELECT

    SUBSTR(CTYPE."NAME",1,30) AS "MOST SELLING CHEESE",
    CAST(TO_CHAR(SUM(PLOAF."WEIGHT"),'990.99') AS VARCHAR(15) )   AS "SOLD WEIGHT"
FROM
    "PART_OF_LOAF"    PLOAF
JOIN 
    "LOAF_OF_CHEESE" LOAF  ON PLOAF."LOAF_ID" = LOAF."ID"
JOIN
    "ORDERS" ORD ON PLOAF."ORDER_ID" = ORD."ORDER_ID"
JOIN
    "CHEESE_TYPE" CTYPE ON LOAF."CHEESE_TYPE_ID" = CTYPE."ID" GROUP BY SUBSTR(CTYPE."NAME",1,30)
ORDER BY
    SUBSTR(CTYPE."NAME",1,30) DESC;

--Select: This select uses EXISTS and prints all cheese types that are currently not available in shop
SELECT
    SUBSTR(CTYPE."NAME",1,30) AS "Cheese that is currently not available",
    SUBSTR(CTYPE."ANIMAL",1,30) AS "From animal",
    SUBSTR(CTYPE."FAT",1,30) AS "Fat percentage",
    SUBSTR(CTYPE."TYPE",1,30) AS "Type",
    SUBSTR(CTYPE."COUNTRY",1,30) AS "Country of origin"
FROM
    "CHEESE_TYPE"    CTYPE
WHERE NOT EXISTS (
    SELECT *
    FROM "LOAF_OF_CHEESE" LOAF
    WHERE CTYPE."ID" = LOAF."CHEESE_TYPE_ID"
);

--Select: This select uses IN and prints all employees that have been employed at least one year and stocked/created at least one cheese/order
SELECT
    SUBSTR(EMP."NAME",1,30) AS "Employee name",
    EMP."JOB_TYPE" AS "Job type",
    EMP."PHONE_NUMBER" AS "Phone number",
    SUBSTR(EMP."ADDRESS",1,30) AS "Address",
    EMP."BANK_ACCOUNT" AS "Bank account",
    TO_CHAR(EMP."EMPLOYED_SINCE", 'dd.mm.yyyy     ') AS "Employed since"
FROM
    "EMPLOYEE"    EMP
WHERE (
    EMP."ID" IN (
        SELECT LOAF."STOCKED_EMPLOYEE_ID"
        FROM "LOAF_OF_CHEESE" LOAF
    ) 
    OR ( EMP."ID" IN (
        SELECT ORD."EMPLOYEE_ID" 
        FROM "ORDERS" ORD
        )  
    )  
)  AND (SYSDATE - EMP."EMPLOYED_SINCE") > 365;


------------------------ EXPLAIN PLAN --------------------------------


EXPLAIN PLAN FOR
SELECT
    EMP."NAME" ,
    EMP."JOB_TYPE" ,
    EMP."PHONE_NUMBER" ,
    EMP."ADDRESS" ,
    EMP."BANK_ACCOUNT" ,
    TO_CHAR(EMP."EMPLOYED_SINCE", 'dd.mm.yyyy     ') 
FROM
    "EMPLOYEE"    EMP
WHERE (
    EMP."ID" IN (
        SELECT LOAF."STOCKED_EMPLOYEE_ID"
        FROM "LOAF_OF_CHEESE" LOAF
    ) 
    OR ( EMP."ID" IN (
        SELECT ORD."EMPLOYEE_ID" 
        FROM "ORDERS" ORD
        )  
    )  
)  AND (SYSDATE - EMP."EMPLOYED_SINCE") > 365;
SELECT * FROM TABLE(DBMS_XPLAN.DISPLAY);


-- Index for cheese type fat for faster searching
CREATE INDEX "INDEX_LOAF_OF_CHEESE_STOCKED_EMPLOYEE_ID" ON LOAF_OF_CHEESE(STOCKED_EMPLOYEE_ID);
CREATE INDEX "INDEX_ORDERS_EMPLOYEE_ID" ON ORDERS(EMPLOYEE_ID);

-- druhý pokus
EXPLAIN PLAN FOR
SELECT
    EMP."NAME" ,
    EMP."JOB_TYPE" ,
    EMP."PHONE_NUMBER" ,
    EMP."ADDRESS" ,
    EMP."BANK_ACCOUNT" ,
    TO_CHAR(EMP."EMPLOYED_SINCE", 'dd.mm.yyyy     ') 
FROM
    "EMPLOYEE"    EMP
WHERE (
    EMP."ID" IN (
        SELECT LOAF."STOCKED_EMPLOYEE_ID"
        FROM "LOAF_OF_CHEESE" LOAF
    ) 
    OR ( EMP."ID" IN (
        SELECT ORD."EMPLOYEE_ID" 
        FROM "ORDERS" ORD
        )  
    )  
)  AND (SYSDATE - EMP."EMPLOYED_SINCE") > 365;
-- výpis
SELECT * FROM TABLE(DBMS_XPLAN.DISPLAY);
/




----------------------- MATERIALIZED VIEW -----------------------------


CREATE MATERIALIZED VIEW "LOAFS_WITH_TYPE" AS
SELECT
    SUPP."NAME" AS "Supplier",
    SUPP."EMAIL" AS "Supplier email",
    CTYPE."NAME" AS "Cheese name",
    CTYPE."TYPE" AS "Cheese type",
    CTYPE."ANIMAL" AS "From animal",
    CTYPE."FAT" AS "Cheese fat",
    CTYPE."COUNTRY" AS "Made in",
    TO_CHAR(LOAF."EXPIRATION_DATE", 'dd.mm.yyyy') AS "Exp. date"
FROM
    "OFFER"    OFFER
JOIN 
    "CHEESE_TYPE" CTYPE  ON OFFER."CHEESE_TYPE_ID" = CTYPE."ID"
JOIN
    "SUPPLIER" SUPP ON OFFER."SUPPLIER_ID" = SUPP."EIN"
JOIN
    "LOAF_OF_CHEESE" LOAF ON LOAF."CHEESE_TYPE_ID" = CTYPE."ID" AND LOAF."SUPPLIER_ID" = SUPP."EIN"
WHERE
    LOAF."EXPIRATION_DATE" > SYSDATE;


SELECT * FROM "LOAFS_WITH_TYPE";


--------- procedure --------------
--this procedure prints number of workers and employees
CREATE OR REPLACE PROCEDURE "supp_emp_count"
AS
    supp INT;
    emp INT;
BEGIN
    SELECT COUNT(*) INTO supp FROM SUPPLIER;
    SELECT COUNT(*) INTO emp FROM EMPLOYEE;
    DBMS_OUTPUT.put_line('Number of suppliers stored in database is: ' || supp);
    DBMS_OUTPUT.put_line('Number of workers employed is: ' || emp);
END;
/
BEGIN 
    "supp_emp_count"; 
END;
/









-- GRANT ACCESS AND PRIVILEGES TO TEAM MEMBER

GRANT INSERT, UPDATE, SELECT ON EMPLOYEE TO xsesta07;
GRANT INSERT, UPDATE, SELECT ON CHEESE_TYPE TO xsesta07;
GRANT INSERT, UPDATE, SELECT ON LOAF_OF_CHEESE TO xsesta07;
GRANT INSERT, UPDATE, SELECT ON OFFER TO xsesta07;
GRANT INSERT, UPDATE, SELECT ON ORDERS TO xsesta07;
GRANT INSERT, UPDATE, SELECT ON PART_OF_LOAF TO xsesta07;
GRANT INSERT, UPDATE, SELECT ON SUPPLIER TO xsesta07;

-- GRANT ACCESS TO MATERIALIZED VIEW
GRANT INSERT, UPDATE, SELECT ON "LOAFS_WITH_TYPE" TO xsesta07;

