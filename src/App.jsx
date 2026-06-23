import { Routes, Route, Navigate } from "react-router-dom";


import Login from "./pages/Login";
import Register from "./pages/Register";
import LeadGenerator from "./pages/LeadGenerator";


function ProtectedRoute({ children }) {
 const token = localStorage.getItem("token");


 if (!token) {
   return <Navigate to="/" replace />;
 }


 return children;
}


export default function App() {
 return (
   <Routes>
     <Route path="/" element={<Login />} />


     <Route path="/register" element={<Register />} />


     <Route
       path="/dashboard"
       element={
         <ProtectedRoute>
           <LeadGenerator />
         </ProtectedRoute>
       }
     />
   </Routes>
 );
}

