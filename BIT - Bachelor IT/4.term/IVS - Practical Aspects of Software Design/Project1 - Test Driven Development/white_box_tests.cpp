//======== Copyright (c) 2021, FIT VUT Brno, All rights reserved. ============//
//
// Purpose:     White Box - Tests suite
//
// $NoKeywords: $ivs_project_1 $white_box_code.cpp
// $Author:     PAVEL SESTAK <xsesta07@stud.fit.vutbr.cz>
// $Date:       $2021-01-04
//============================================================================//
/**
 * @file white_box_tests.cpp
 * @author PAVEL SESTAK
 * 
 * @brief Implementace testu prace s maticemi.
 */

#include "gtest/gtest.h"
#include "white_box_code.h"
#include <cmath>

//============================================================================//
// ** ZDE DOPLNTE TESTY **
//
// Zde doplnte testy operaci nad maticemi. Cilem testovani je:
// 1. Dosahnout maximalniho pokryti kodu (white_box_code.cpp) testy.
// 2. Overit spravne chovani operaci nad maticemi v zavislosti na rozmerech 
//    matic.
//============================================================================//

#define LOOP_COUNT 50

TEST(Matrix_constructors, ParameterLessConstructor){
    Matrix *mat = new Matrix();
    
    EXPECT_NE(mat,nullptr);
    
    for(int row = 0; row < 10; row++){
        for(int col = 0; col < 10; col++){
            if(row < 1 && col < 1){
                double value = mat->get(row,col);
                EXPECT_EQ(value,0.0); //Check default values for init
            }
            else{
                EXPECT_THROW(mat->get(row,col),std::runtime_error);
            }
        }
    } 
    delete mat;
};

size_t rows[] = { 0, 2, 3, 2, 3, 8, 4, 7, 20};
size_t cols[] = { 1, 2, 3, 3, 6, 8, 8, 14, 40};

int matrix_count = sizeof(rows) / sizeof(rows[0]);

std::vector<int> primeNumbers;

void SieveOfEratosthenes(){
    //find max size of matrix
    int max = 0;

    for(int i = 0; i < matrix_count; i++){
        if(rows[i]*cols[i] > max){
            max = rows[i]*cols[i];
        }
    }

    max*=10;

    //Init vector isPrime to true
    std::vector<bool> isPrime = std::vector<bool>(max, true);

    //round up
    int sqrt_max = ceil(sqrt(max));
    
    for(int i = 2; i < sqrt_max; i++){
        if(isPrime[i] == true){
            for(int j = i*i; j < max; j += i){
                isPrime[j] = false;
            }
        }
    }

    for(int i = 2; i < max; i++){
        if(isPrime[i] == true){
            primeNumbers.push_back(i);
        }
    }
}

TEST(Matrix_constructors, ParameterConstructor){
    
    Matrix mat;
    
    EXPECT_THROW( mat = Matrix(rows[0],cols[0]), std::runtime_error);
    
    for(int i = 1; i < matrix_count; i++){
    
        mat = Matrix(rows[i],cols[i]);
    
        for(int row = 0; row < rows[i]*2; row++){
            for(int col = 0; col < cols[i]*2; col++){

                if(row < rows[i] && col < cols[i]){
                    double value = mat.get(row,col);
                    EXPECT_EQ(value,0.0); //Check default values for init
                }
                else{
                    EXPECT_THROW(mat.get(row,col),std::runtime_error);
                }
            }
        }
    }    
};

TEST(Matrix_Access, setAndGet){

    for(int i = 1; i < matrix_count; i++){
    
        Matrix *mat;

        mat = new Matrix(rows[i],cols[i]);
        EXPECT_NE(mat,nullptr);

        for(int row = 0; row < rows[i]*2; row++){
            for(int col = 0; col < cols[i]*2; col++){

                if(row < rows[i] && col < cols[i]){
                    int expectedValue = rand() % 50;
                    mat->set(row,col,expectedValue);
                    int value = mat->get(row,col);
                    EXPECT_EQ(value,expectedValue);
                }
                else{
                    EXPECT_THROW(mat->get(row,col),std::runtime_error);
                    EXPECT_FALSE(mat->set(row,col,1.0));
                }
            }
        }
        delete mat;
    }    
};

TEST(Matrix_Access, setArray){
    
    Matrix mat;
    bool result;

    for(int i = 1; i < matrix_count; i++){
        
        mat = Matrix(rows[i],cols[i]);
        
        std::vector<std::vector<double>> arr;
        
        //init vector
        for(int j = 0; j < rows[i]; j++){
            
            std::vector<double> line;
            for(int k = 0; k < cols[i]; k++){
                line.push_back(double(j*rows[i]+k));
            }
            arr.push_back(line);
        }
        
        //test on fit matrix
        result = mat.set(arr);
        EXPECT_TRUE(result);

        
        //test on bigger matrix
        Matrix mat_test = Matrix(rows[i]+1,cols[i]+1);
        result = mat_test.set(arr);
        EXPECT_FALSE(result);
        
        //test on smaller matrix
        mat_test = Matrix(rows[i]-1,cols[i]-1);
        result = mat_test.set(arr);
        EXPECT_FALSE(result);
        
        for(int j = 0; j < rows[i]; j++){
            std::vector<double> line;
            int kmax = cols[i];

            //make one array in 2D arry shorter
            if(j == rows[i]/2){ 
                kmax = cols[i]-1;
            }

            for(int k = 0; k < kmax; k++){
                line.push_back(double(i*rows[i]+j));
            }
            arr.push_back(line);
        }

        result = mat.set(arr);
        EXPECT_FALSE(result);
    }
};

TEST(Matrix_operators,Equal){
    
    Matrix mat;
    Matrix mat2;
    bool result;

    for(int i = 1; i < matrix_count; i++){
        mat = Matrix(rows[i],cols[i]);
        mat2 = Matrix(rows[i],cols[i]);

        result = mat.operator==(mat2);
        EXPECT_TRUE(result);
        
        mat2.set(0,0,1.0);
        result = mat.operator==(mat2);
        EXPECT_FALSE(result);
        
        EXPECT_THROW(mat.operator==(Matrix(rows[i]-1,cols[i]-1)), std::runtime_error);
    }
};

TEST(Matrix_operators,Add){
    
    Matrix mat;
    Matrix mat2;
    Matrix result;

    for(int i = 1; i < matrix_count; i++){
        
        mat = Matrix(rows[i],cols[i]);
        mat2 = Matrix(rows[i],cols[i]);
        result = Matrix(rows[i],cols[i]);

        result = mat.operator+(mat2);
        for(int j = 0; j < rows[i]; j++){
            for(int k = 0; k < cols[i]; k++){
                EXPECT_EQ(result.get(j,k),mat.get(j,k) + mat2.get(j,k));
            }
        }
        
        EXPECT_THROW(mat.operator+(Matrix(rows[i]-1,cols[i]-1)), std::runtime_error);
    }
};

TEST(Matrix_operators,Mul){
    
    Matrix mat;
    Matrix mat2;
    Matrix result;

    for(int i = 1; i < matrix_count; i++){
        
        mat = Matrix(rows[i],cols[i]);
        mat2 = Matrix(cols[i],rows[i]); // Switch rows and cols for compatibility to multiplication
        result = Matrix(rows[i],rows[i]);

        result = mat.operator*(mat2);
        
        for(int row = 0; row < rows[i]; row++)
        {
            for(int col = 0; col < rows[i]; col++)
            {
                double res2 = 0.0;
                for(int k = 0; k < cols[i]; k++)
                {
                    res2 += mat.get(row,k)*mat2.get(k,col);
                }
                EXPECT_EQ(res2, result.get(row,col));
            }
        }

        if(rows[i] != cols[i]){
            EXPECT_THROW(mat.operator*(Matrix(rows[i],cols[i])), std::runtime_error);
        }
    }
};


TEST(Matrix_operators,Mul_Const){
    
    Matrix mat;
    Matrix result;

    for(int i = 1; i < matrix_count; i++){
        
        mat = Matrix(rows[i],cols[i]);
        double Const = rand() % 150;
        result = Matrix(rows[i],rows[i]);

        result = mat.operator*(Const);
        
        for(int row = 0; row < rows[i]; row++)
        {
            for(int col = 0; col < rows[i]; col++)
            {
                double res2 = mat.get(row,col)*Const;
                EXPECT_EQ(res2, result.get(row,col));
            }
        }
    }
};

TEST(Matrix_operators,solveEquation){
    SieveOfEratosthenes(); //init prime numbers

    for(int i = 2; i < matrix_count; i++){
    
        std::vector<double> b;
        std::vector<double> b_err;

        for(int j = 0; j < cols[i]/2;j++){
            b_err.push_back(rand());
        }
        
        Matrix mat = Matrix(rows[i],cols[i]);
        Matrix mat_sing = Matrix(rows[i],cols[i]);
        
        for(int j = 0; j < rows[i]; j++){
            for(int k = 0; k < cols[i]; k++){
                mat.set(j,k,primeNumbers[j*rows[i] + k]);
                mat_sing.set(j,k,1);
            }
        }

        for(int j = 0; j < cols[i]; j++){
            b.push_back(100);
        }

        EXPECT_THROW(mat.solveEquation(b_err),std::runtime_error);

        EXPECT_THROW(mat_sing.solveEquation(b),std::runtime_error); //singular matrix

        if(rows[i] != cols[i]){
            EXPECT_THROW(mat.solveEquation(b), std::runtime_error); //Its not square matrix
        }
        else{
            std::vector<double> vec = std::vector<double>();

            vec = mat.solveEquation(b);

            for(int j = 0; j < rows[i]; j++){
                
                float acc = 0;
                for(int k = 0; k < cols[i]; k++){
                    acc += mat.get(j,k) * vec[k];
                }
                
                EXPECT_NEAR(b[j],acc,0.001); //floating point error
            }
        }
    }

    Matrix mat = Matrix(1,1);
    mat.set(1,1,0);
    std::vector<double> b = {1};
    EXPECT_THROW(mat.solveEquation(b), std::runtime_error);

};

TEST(Matrix_operators,transpose){
    for(int i = 1; i < matrix_count; i++){

        Matrix mat = Matrix(rows[i],cols[i]);
        Matrix mat_trans = Matrix(cols[i],rows[i]);
        Matrix mat_result = Matrix(cols[i],rows[i]);

        for(int j = 0; j < rows[i]; j++){
            for(int k = 0; k < cols[i]; k++){
                double value = rand();
                mat.set(j,k,value);
                mat_trans.set(k,j,value);
            }
        }

        mat_result = mat.transpose();
        EXPECT_TRUE(mat_trans.operator==(mat_result));
        EXPECT_TRUE(mat.operator==(mat_result.transpose()));
    }    
}

TEST(Matrix_operators,inverse){

    EXPECT_THROW(Matrix(2,2).inverse(),std::runtime_error);
    
    SieveOfEratosthenes(); //init prime numbers
    

    for(int i = 1; i < matrix_count; i++){

        Matrix mat = Matrix(rows[i],cols[i]);
        Matrix result = Matrix(cols[i],rows[i]);

        for(int j = 0; j < rows[i];j++){
            for(int k = 0; k < cols[i];k++){
                mat.set(j,k,primeNumbers[j*rows[i] + k]);
            }
        }
        
        if((rows[i] == 2 && cols[i] == 2) || (rows[i] == 3 && cols[i] == 3)){

            result = mat.inverse();
            
            Matrix matrix_one = mat.operator*(result);

            for(int j = 0; j < cols[i]; j++){
                for(int k = 0; k < rows[i]; k++){
                    if(j == k){
                        EXPECT_TRUE((int)(matrix_one.get(j,k) - 1) < std::numeric_limits<double>::epsilon());
                    }
                    else{
                        //multiple limit by 100, its still zero, but inverse and multiplicatin make error in numbers.
                        EXPECT_TRUE(matrix_one.get(j,k) < std::numeric_limits<double>::epsilon()*100);
                    }
                }
            }
        }
        else{
            EXPECT_THROW(mat.inverse(),std::runtime_error);
        }
    }

}


/*** Konec souboru white_box_tests.cpp ***/
