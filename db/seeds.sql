
INSERT INTO department
  (name)
VALUES
  ('Marketing'),
  ('Sales'),
  ('Operations'),
  ('Human Resources');

INSERT INTO role
  (title, salary, department_id)
VALUES
  ('Marketing Director', '140000', '1'),
  ('Marketing Assistant', '60000', '1'),
  ('Sales Lead', '100000', '2'),
  ('Salesperson', '80000', '2'),
  ('Operations Manager', '60000', '3'),
  ('Operations Assistant', '30000', '3'),
  ('HR Manager', '60000', '4'),
  ('HR Coordinator', '30000', '4');
  
INSERT INTO employees 
  (first_name, last_name, role_id, manager_id)
VALUES
  ('Michael', 'Smith', 1, NULL),
  ('Amanda', 'White', 2, 0),
  ('Piers', 'Rains', 3, NULL),
  ('Austin', 'Ogburn', 4, 0),
  ('Katherine', 'Giler', 4, 2),
  ('Monica', 'Carrington', 5, 2),
  ('Edward', 'Bellamy', 6, NULL),
  ('Isabella', 'Savre', 5, 0),
  ('Octavia', 'Butler', 7, 6),
  ('Peters', 'Zurn', 8, 6);