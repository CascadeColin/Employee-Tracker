drop database if exists company_db;
create database company_db;
use company_db;

create table department (
    id int not null,
    name varchar(30) not null,
    primary key(id)
)

create table role (
    id int not null,
    title varchar(30) not null,
    salary decimal not null,
    department_id int,
    primary key(id),
    foreign key(department_id) references department(id) on delete set null
)

create table employee (
    id int not null,
    first_name varchar(30) not null,
    last_name varchar(30) not null,
    role_id int,
    manager_id int,
    primary key(id),
    foreign key (role_id) references role(id) on delete set null,
)