// Mock user model for demonstration
const users = [
  {
    id: 1,
    email: 'admin@gmail.com',
    password: 'admin', // In production, use hashed passwords
    name: 'Admin User',
    role: 'admin'
  }
];

export const findUserByEmail = (email) => {
  return users.find(user => user.email === email);
};

export const validatePassword = (user, password) => {
  return user.password === password; // In production, use bcrypt.compare
};