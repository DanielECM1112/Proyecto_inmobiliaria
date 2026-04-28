import { useEffect, useState } from "react"; 
import axios from "axios"; 
 
function App() { 
 
  const [users, setUsers] = useState([]); 
 
  useEffect(() => { 
    axios.get("http://localhost:8000/api/users/") 
      .then(res => setUsers(res.data)); 
  }, []); 
 
  return ( 
    <div className="p-5"> 
      <h1 className="text-2xl font-bold mb-4">corriendo</h1> 
 
      {users.map(user => ( 
        <div key={user.id} className="bg-gray-200 p-3 mb-2 rounded"> 
          {user.name} 
        </div> 
      ))} 
    </div> 
  ); 
} 
 
export default App; 
