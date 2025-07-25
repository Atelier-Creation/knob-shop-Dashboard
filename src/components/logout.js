export function logout(navigate) {
  localStorage.removeItem("authToken"); 
  navigate("/login");
}