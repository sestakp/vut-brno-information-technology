package cz.vutbr.fit.api.dal.entity;

import cz.vutbr.fit.api.dal.embedded.Address;
import cz.vutbr.fit.api.dal.entity.interfaces.IEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;


@Entity
@NamedQuery(name = "Employee.getAll", query = "SELECT u FROM EmployeeEntity u")
@NamedQuery(name = "Employee.getById", query = "SELECT u FROM EmployeeEntity u WHERE u.id = :id")
@NamedQuery(name = "Employee.getByEmail", query = "SELECT u FROM EmployeeEntity u WHERE u.email = :email")
@NamedQuery(name = "Employee.removeAll", query = "DELETE FROM EmployeeEntity")
public class EmployeeEntity implements IEntity {

    @Id
    @GeneratedValue
    private long id;

    @NotNull
    private String name;



    @NotNull
    private String role;
    @NotNull
    private String email;

    @NotNull
    private String surname;

    private String bankAccount;

    private int salary;


    @Column(length = 1_000)
    private String passwordHash;


    @Embedded
    private Address address = new Address();

    public long getId() {
        return id;
    }
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getSurname() {
        return surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public String getBankAccount() {
        return bankAccount;
    }

    public void setBankAccount(String bankAccount) {
        this.bankAccount = bankAccount;
    }

    public int getSalary() {
        return salary;
    }

    public void setSalary(int salary) {
        this.salary = salary;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public Address getAddress() {
        return address;
    }

    public void setAddress(Address address) {
        this.address = address;
    }
}
