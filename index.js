const inquirer = require("inquirer")
const db = require('./db/connection');
require('console.table');


// start application

const startApp = () => {
  return inquirer.prompt([
    {
      type: 'list',
      name: 'option',
      message: 'What would you like to do?',
      choices: [
        'View All Departments',
        'View All Roles',
        'View All Employee',
        'Add Department',
        'Add Role',
        'Add Employee',
        'Update Employee Role',
        'Exit',
      ],
    },
  ]).then(answer => {
    let option = answer.option;

    // Call the options 
    switch (option.toLowerCase()) {
      case 'view all departments':
        viewDepartments();
        break;
      case 'view all roles':
        viewRoles();
        break;
      case 'view all employee':
        viewEmployee();
        break;
      case 'add department':
        addDepartment();
        break;
      case 'add role':
        addRole();
        break;
      case 'add employee':
        addEmployee();
        break;
      case 'update employee role':
        updEmpRole();
        break;
      default:
        exitApp();

    }
  });
}

// View all Departments
const viewDepartments = () => {
  const dataDpt = "SELECT * FROM department;"
  db.query(dataDpt, (err, result) => {
    if (err) throw err;
    console.table(result);
    startApp()
  });
}

// View all Roles
const viewRoles = () => {
  const dataRoles = "SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department on role.department_id = department.id;"
  db.query(dataRoles, (err, result) => {
    if (err) throw err;
    console.table(result);
    startApp()
  });
}

// View all Employee
const viewEmployee = () => {
  const query = "SELECT DISTINCT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id;"
  db.query(
    query,
    (err, res) => {
      if (err) throw err;
      console.table(res);
      startApp();
    });
};

// Add Department
const addDepartment = () => {
  inquirer.prompt([
    {
      name: 'department',
      message: 'Enter the name of the department:',
    }
  ])
    .then(res => {
      const addDept = "INSERT INTO department (name) VALUES (?)";
      db.query(addDept, [res.department], (err, data) => {

        if (err) throw err;
        console.log(`Added ${res.department} to the database`);
        startApp()
      });
    });
}


// Add Role
const addRole = () => {
  inquirer.prompt([
    {
      name: "title",
      message: "What is the name of the role?"
    },
    {
      name: "salary",
      message: "What is the salary rate?"
    },
    {
      type: "list",
      name: "choice",
      message: "Which department does the role fall in under?",
      choices: [
        'Marketing',
        'Sales',
        'Operations',
        'Human Resources',
      ]
    }
  ]).then(data => {
    switch (data.choice) {
      case 'Marketing':
        var dptID = 1;
        break;
      case 'Sales':
        var dptID = 2;
        break;
      case 'Operations':
        var dptID = 3;
        break;
      case 'Human Resources':
        var dptID = 4;
        break;
    }
    const query = "INSERT INTO role SET ?;"
    db.query(
      query,
      {
        title: data.title,
        salary: data.salary,
        department_id: dptID
      },
      err => {
        if (err) throw err;
        console.log("Role Added!")
        startApp();
      });
  });
};

// Add Employee
const addEmployee = () => {
  inquirer
    .prompt([
      {
        name: "firstName",
        type: "input",
        message: "What is the Employees First Name?",
      },
      {
        name: "lastName",
        type: "input",
        message: "What is the Employees Last Name?",
      },
      {
        name: "choice",
        type: "list",
        message: "What is this employee's role?",
        choices: [
          'Marketing Director',
          'Marketing Assistant',
          'Sales Lead',
          'Salesperson',
          'Operations Manager',
          'Operations Assistant',
          'HR Manager',
          'HR Coordinator',
        ]
      }
    ]).then(data => {
      switch (data.choice) {
        case 'Marketing Director':
          var roleID = 1;
          break;
        case 'Marketing Assistant':
          var roleID = 2;
          break;
        case 'Sales Lead':
          var roleID = 3;
          break;
        case 'Salesperson':
          var roleID = 4;
          break;
        case 'Operations Manager':
          var roleID = 5;
          break;
        case 'Operations Assistant':
          var roleID = 6;
          break;
        case 'HR Manager':
          var roleID = 7;
          break;
        case 'HR Coordinator':
          var roleID = 8;
          break;
      }

      const query = "INSERT INTO employee SET ?;"
      db.query(
        query,
        {
          first_name: data.firstName,
          last_name: data.lastName,
          role_id: roleID
        },
        err => {
          if (err) throw err;
          console.log("Employee Added!!")
          startApp();
        });
    });
};

// Update Employee Role
const updEmpRole = () => {
  const query = "SELECT CONCAT(first_name, ' ', last_name) as name FROM employee;"
  db.query(
    query,
    (err, res) => {
      if (err) throw err;
      inquirer
        .prompt([
          {
            type: "list",
            message: "Which Employee would you like to update?",
            name: "selectedEmp",
            choices: () => {
              var choiceArray = [];
              for (const item of res) {
                choiceArray.push(item.name);
              }
              return choiceArray;
            }
          },
          {
            name: "choice",
            type: "list",
            message: "What is this employee's role?",
            choices: [
              'Marketing Director',
              'Marketing Assistant',
              'Sales Lead',
              'Salesperson',
              'Operations Manager',
              'Operations Assistant',
              'HR Manager',
              'HR Coordinator',
            ]
          }
        ]).then(data => {
          switch (data.choice) {
            case 'Marketing Director':
              var roleID = 1;
              break;
            case 'Marketing Assistant':
              var roleID = 2;
              break;
            case 'Sales Lead':
              var roleID = 3;
              break;
            case 'Salesperson':
              var roleID = 4;
              break;
            case 'Operations Manager':
              var roleID = 5;
              break;
            case 'Operations Assistant':
              var roleID = 6;
              break;
            case 'HR Manager':
              var roleID = 7;
              break;
            case 'HR Coordinator':
              var roleID = 8;
              break;
          }
          const emp = data.selectedEmp.split(" ");
          const query = "UPDATE employee SET ? WHERE ? AND ?";
          db.query(
            query
            , [
              {
                role_id: roleID
              },
              {
                first_name: emp[0]
              },
              {
                last_name: emp[1]
              }
            ]
            , err => {
              if (err) throw err;
              console.log("Employee role Successfully Updated!");
              startApp();
            });
        });
    });
};

// Exit the Application
const exitApp = () => {
  process.exit();

}

startApp()

