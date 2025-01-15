import { Routes, Route } from "react-router";
import Login from "./pages/Login";
import Menu from "./pages/Menu";
import Orders from "./pages/Order";
import Register from "./pages/Register";

function App() {
    return (
        <div>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/orders" element={<Orders />} />
            </Routes>
        </div>
    );
}

export default App;
