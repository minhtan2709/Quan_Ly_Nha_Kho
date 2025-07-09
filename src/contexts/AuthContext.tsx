import { createContext, useContext, useState } from "react";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(() => {
    const local = localStorage.getItem("currentUser");
    return local ? JSON.parse(local) : null;
  });
  const [users, setUsers] = useState(() => {
    const local = localStorage.getItem("users");
    return local ? JSON.parse(local) : [
      // Mock sẵn 1 admin để đăng nhập luôn
      { email: "admin@example.com", username: "admin", password: "123456", role: "ADMIN", status: "active" }
    ];
  });

  const addUser = (newUser: any) => {
    setUsers((prev: any[]) => {
      const updated = [...prev, newUser];
      localStorage.setItem("users", JSON.stringify(updated));
      return updated;
    });
  };

  const login = (email: string, password: string) => {
    const found = users.find(
      (u: any) => u.email === email && u.password === password && u.status === "active"
    );
    if (found) {
      setUser(found);
      localStorage.setItem("currentUser", JSON.stringify(found));
      localStorage.setItem("token", "mock-token"); // để tương thích code cũ
      return found;
    }
    return null;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, users, addUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
