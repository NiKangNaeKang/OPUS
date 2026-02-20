import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ToastConfig() {
  return (
    <ToastContainer 
      position="top-right"   
      autoClose={2000}        
      hideProgressBar={true}  
      theme="light" 
      limit={1}               
      closeOnClick            
      pauseOnHover     
      
      toastStyle={{
        color: "#111",
        fontWeight: "500"
      }}

      style={{ 
        zIndex: 99999, 
        top: "70px",                
        left: "50%",               
        transform: "translateX(-50%)", 
        width: "100%",             
        maxWidth: "var(--wrap)",   
        paddingRight: "var(--pad)", 
        display: "flex",            
        justifyContent: "flex-end"  
      }} 
    />
  );
}