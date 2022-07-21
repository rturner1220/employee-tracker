const inquirer = require('inquirer');
const db = require('./db/connection');
require('console.table');


// start application

const startApp = () => {
    return inquirer.prompt([
    {
     type: 'list',
     name: 'option',
     message: 'What would you like to do? (Use arrow keys)',
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
  ])
  .then(res => {
    let option = res.option;

  // Call the options 
    switch (option) {
      case 'view all departments':
        viewDepartments();
        break;
      case 'View All Roles':
        viewRoles();
        break;
      case 'View All Employee':
        viewEmployee();
        break;
      case 'Add Department':
        addDepartment();
        break;
      case 'Add Role':
        addRole();
        break;
      case 'Add Employee':
        AddEmployee();
        break;
      case 'Update Employee Role':
        updEmpRole();
        break;
      default:
        exitApp();
      
    }
  })
}
  

  // View all Departments
  const viewDepartments = () => {
    const dataDpt =  "SELECT * FROM department;"
    db.query(dataDpt, (err, result) => {
      if (err) throw err;
      console.table(result);
      startApp()
     })
  }

  
  // View all Roles
  const viewRoles = () => {
    const dataRoles = "SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department on role.department_id = department.id;"
    db.query(dataRoles, (err, result) => {
      if (err) throw err;
      console.table(result);
      startApp()
     }) 
  }


  // View all Employee
  const viewEmployee = () => {
    const dataEMP = "SELECT employees.id, employees.first_name, employees.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employees LEFT JOIN role on employees.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employees manager on manager.id = employees.manager_id"
    db.query(dataEMP, (err, result) => {
      if (err) throw err;
      console.table(result);
      startApp()
     })

  }


  // Add Department
  const addDepartment = () => {
    inquirer.prompt([
     {
      name: 'department',
      message: 'Enter the name of the department:',
     }
   ])
   .then(res => {
    const addDept = ("INSERT INTO department SET ?", name);
    db.query(addDept, res.name)
        .then(() => console.log(`Added ${res.name} to the database`))
        .then(() => startApp())
    })
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
        name: "department",
        message: "Which department does the role fall in under?",
        choice: [
          'Marketing',
          'Sales',
          'Operations',
          'Human Resources',
        ]
      }
  ]).then(data => {
    switch(data.choice) {
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
    
      const updRole = "INSERT INTO department SET ?"
        db.query = updRole,
        {
          title: data.title,
          salary: data.salary,
          department: dptID
        }
         err => {
          if (err) throw err;
          console.log('Role Added!!')
          startApp()
         };
      });
    };


  // Add Employee
  const AddEmployee = () => {
    inquirer.prompt([
      {
        name: "first_name",
        message: "What's the employee's first name?"
    },
    {
        name: "last_name",
        message: "What's the employee's last name?"
    }
])
    .then(res => {
      let firstName = res.first_name;
      let lastName = res.last_name;

      db.allRoles()
       .then(([rows]) => {
         let roles = rows;
         const roleChoices = roles.map(({ id, title }) => ({
           name: title,
           value: id
          }));

          prompt({
            type: "list",
            name: "roleId",
            message: "What's the employee's role?",
            choices: roleChoices
           })
            .then(res => {
            let roleId = res.roleId;

             db.allEmployees()
             .then(([rows]) => {
              let employees = rows;
              const managerChoices = employees.map(({ id, first_name, last_name }) => ({
                name: `${first_name} ${last_name}`,
                value: id
                }));

               managerChoices.unshift({ name: "None", value: null });

               prompt({
                type: "list",
                name: "managerId",
                message: "Who's the employee's manager?",
                choices: managerChoices
              })
                .then(res => {
                  let employee = {
                   manager_id: res.managerId,
                   role_id: roleId,
                   first_name: firstName,
                   last_name: lastName
                  }

             db.addEmployee(employee);
              })
               .then(() => console.log(
                 `Added ${firstName} ${lastName} to the database`
                ))
                 .then(() => runPrompts())
                 })
             })
         })
    })
}

  // Update Employee Role
  const updEmpRole = () => {
   db.allEmployees()
    .then(([rows]) => {
      let employees = rows;
      const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id
      }));

      prompt([
        {
          type: "list",
          name: "employeeId",
          message: "Which employee's role do you want to update?",
          choices: employeeChoices
        }
      ])
         .then(res => {
            let employeeId = res.employeeId;
            db.allRoles()
         .then(([rows]) => {
            let roles = rows;
             const roleChoices = roles.map(({ id, title }) => ({
               name: title,
               value: id
              }));

        prompt([
           {
            type: "list",
            name: "roleId",
            message: "What's the new role of this employee?",
            choices: roleChoices
           }
         ])
        
         .then(res => db.updateEmployeeRole(employeeId, res.roleId))
         .then(() => console.log("Employee's role is updated"))
         .then(() => runPrompts())
        });
     });
  })
}


  // Exit the Application
   const exitApp = () => {
   process.exit();

  }

  startApp()


    

   