import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setOrderHistory, clearOrderHistory } from "../redux/orderSlice";
import { addToCart, clearCart } from "../redux/cartSlice";
import { useNavigate } from "react-router";
import { BACKEND_URL } from "../../config";
import {
    Button,
    Card,
    CardContent,
    Typography,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Pagination,
} from "@mui/material";

export default function Order() {
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart.items);
    const orderHistory = useSelector((state) => state.order.history);
    const navigate = useNavigate();
    const [menuItems, setMenuItems] = useState([]);
    const [filter, setFilter] = useState("");
    const [sort, setSort] = useState("");
    const [filterCategory, setFilterCategory] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [allMenuItems, setAllMenuItems] = useState([]);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/");
            return;
        }

        const fetchOrderHistory = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/api/order`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                dispatch(setOrderHistory(response.data));
            } catch (error) {
                console.error("Error fetching order history:", error);
            }
        };
        fetchOrderHistory();
    }, [dispatch, navigate]);

    useEffect(() => {
        fetchMenuItems();
    }, [page, filter, sort, filterCategory]);

    const fetchMenuItems = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/api/menu`, {
                params: { page, limit: 50 },
            });
            setAllMenuItems(response.data.menuItems);
            const uniqueCategories = [
                ...new Set(
                    response.data.menuItems.map((item) => item.category)
                ),
            ];
            setCategories(uniqueCategories);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error("Error fetching menu items:", error);
        }
    };

    useEffect(() => {
        const filtered = allMenuItems
            .filter((item) =>
                item.name.toLowerCase().includes(filter.toLowerCase())
            )
            .filter(
                (item) => !filterCategory || item.category === filterCategory
            )
            .sort((a, b) => {
                if (sort === "price-asc") return a.price - b.price;
                if (sort === "price-desc") return b.price - a.price;
                return 0;
            });

        const startIndex = (page - 1) * 50;
        const endIndex = startIndex + 50;
        setMenuItems(filtered.slice(startIndex, endIndex));
        setTotalPages(Math.ceil(filtered.length / 50));
    }, [filter, filterCategory, sort, page, allMenuItems]);

    const calculateTotal = () => {
        return cart.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        );
    };

    const placeOrder = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                `${BACKEND_URL}/api/order`,
                {
                    items: cart.map((item) => ({
                        menuId: item._id,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                    })),
                    totalAmount: calculateTotal(),
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            dispatch(setOrderHistory([...orderHistory, response.data]));
            dispatch(clearCart());
        } catch (error) {
            console.error("Error placing order:", error);
        }
    };

    const handleAddToCart = (item) => {
        const existingItem = cart.find((cartItem) => cartItem._id === item._id);
        if (existingItem) {
            dispatch(
                addToCart({ ...item, quantity: existingItem.quantity + 1 })
            );
        } else {
            dispatch(addToCart({ ...item, quantity: 1 }));
        }
    };

    const handleSignOut = () => {
        localStorage.removeItem("token");
        dispatch(clearOrderHistory());
        dispatch(clearCart());
        navigate("/");
    };

    const handleClearHistory = () => {
        dispatch(clearOrderHistory());
        toast.success("Order history cleared");
    };

    const filteredMenuItems = menuItems
        .filter((item) =>
            item.name.toLowerCase().includes(filter.toLowerCase())
        )
        .sort((a, b) => {
            if (sort === "price-asc") return a.price - b.price;
            if (sort === "price-desc") return b.price - a.price;
            return 0;
        });

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <Typography variant="h4">Menu</Typography>
                <Button
                    variant="outlined"
                    color="error"
                    onClick={handleSignOut}
                >
                    Sign Out
                </Button>
            </div>
            <div className="mb-4 flex gap-2">
                <TextField
                    label="Filter by name"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    variant="outlined"
                    className="flex-1"
                />
                <FormControl variant="outlined" className="flex-1">
                    <InputLabel>Filter by category</InputLabel>
                    <Select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        label="Filter by category"
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        {categories.map((category) => (
                            <MenuItem key={category} value={category}>
                                {category}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl variant="outlined" className="flex-1">
                    <InputLabel>Sort by price</InputLabel>
                    <Select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        label="Sort by price"
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        <MenuItem value="price-asc">
                            Price: Low to High
                        </MenuItem>
                        <MenuItem value="price-desc">
                            Price: High to Low
                        </MenuItem>
                    </Select>
                </FormControl>
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(350px,1fr))] gap-4">
                {filteredMenuItems.map((item) => (
                    <Card key={item._id} className="p-4">
                        <CardContent>
                            <Typography variant="h6">{item.name}</Typography>
                            <Typography variant="body2" color="textSecondary">
                                {item.category}
                            </Typography>
                            <Typography variant="body1">
                                ${item.price}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                {item.availability
                                    ? "Available"
                                    : "Not Available"}
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleAddToCart(item)}
                                disabled={!item.availability}
                                className="mt-4"
                            >
                                Add to Cart
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
            <Pagination
                count={totalPages}
                page={page}
                onChange={(e, value) => setPage(value)}
                className="mt-4"
            />
            <Typography variant="h4" className="mt-8 mb-4">
                Cart
            </Typography>
            <ul className="mb-4">
                {cart.map((item) => (
                    <li key={item.id} className="mb-2">
                        {item.name} - ${item.price} x {item.quantity}
                    </li>
                ))}
            </ul>
            <Typography variant="h5" className="mb-4">
                Total: ${calculateTotal()}
            </Typography>
            <Button variant="contained" color="primary" onClick={placeOrder}>
                Place Order
            </Button>
            <div className="flex justify-between items-center mt-8 mb-4">
                <Typography variant="h4">Order History</Typography>
                <Button
                    variant="outlined"
                    color="warning"
                    onClick={handleClearHistory}
                >
                    Clear History
                </Button>
            </div>
            <div className="space-y-4">
                {orderHistory.map((order) => (
                    <Card key={order._id} className="p-4">
                        <CardContent>
                            <div className="flex justify-between items-center">
                                <Typography variant="h6">
                                    Order #{order._id} - ${order.totalAmount}
                                </Typography>
                                <Typography
                                    variant="body1"
                                    color={
                                        order.status === "completed"
                                            ? "success.main"
                                            : "warning.main"
                                    }
                                >
                                    {order.status.charAt(0).toUpperCase() +
                                        order.status.slice(1)}
                                </Typography>
                            </div>
                            <ul className="mt-2">
                                {order.items.map((item) => (
                                    <li key={item._id}>
                                        {item.name} - ${item.price} x{" "}
                                        {item.quantity}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
