import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
    Button,
    Card,
    CardContent,
    TextField,
    Typography,
    Modal,
    Box,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Pagination,
} from "@mui/material";
import { useNavigate } from "react-router";
import { BACKEND_URL } from "../../config";

export default function Menu() {
    const [menuItems, setMenuItems] = useState([]);
    const [newMenuItem, setNewMenuItem] = useState({
        name: "",
        category: "",
        price: 0,
        availability: true,
    });
    const [editMenuItem, setEditMenuItem] = useState(null);
    const [filterCategory, setFilterCategory] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pendingOrders, setPendingOrders] = useState([]);
    const [categories, setCategories] = useState([]);
    const [sort, setSort] = useState("");
    const [filter, setFilter] = useState("");
    const [allMenuItems, setAllMenuItems] = useState([]);

    useEffect(() => {
        fetchMenuItems();
        fetchPendingOrders();
    }, []);

    const navigate = useNavigate();

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
            toast.error("Failed to fetch menu items");
        }
    };

    const fetchPendingOrders = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${BACKEND_URL}/api/order`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const pending = response.data.filter(
                (order) => order.status === "pending"
            );
            setPendingOrders(pending);
        } catch (error) {
            toast.error("Failed to fetch pending orders");
            if (error.response?.status === 401) {
                navigate("/");
            }
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

    const handleCompleteOrder = async (orderId) => {
        try {
            const token = localStorage.getItem("token");
            await axios.put(
                `${BACKEND_URL}/api/order/${orderId}/complete`,
                { status: "completed" },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setPendingOrders(
                pendingOrders.filter((order) => order._id !== orderId)
            );
            toast.success("Order completed successfully");
        } catch (error) {
            toast.error("Failed to complete order");
            if (error.response?.status === 401) {
                navigate("/");
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewMenuItem({ ...newMenuItem, [name]: value });
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditMenuItem({ ...editMenuItem, [name]: value });
    };

    const handleCreateMenuItem = async () => {
        try {
            const response = await axios.post(
                `${BACKEND_URL}/api/menu`,
                newMenuItem
            );
            setMenuItems([...menuItems, response.data]);
            toast.success("Menu item created successfully");
        } catch (error) {
            toast.error("Failed to create menu item");
        }
    };

    const handleUpdateMenuItem = async (id, updatedItem) => {
        try {
            const response = await axios.put(
                `${BACKEND_URL}/api/menu/${id}`,
                updatedItem
            );
            setMenuItems(
                menuItems.map((item) =>
                    item._id === id ? response.data : item
                )
            );
            toast.success("Menu item updated successfully");
        } catch (error) {
            toast.error("Failed to update menu item");
        }
    };

    const handleDeleteMenuItem = async (id) => {
        try {
            await axios.delete(`${BACKEND_URL}/api/menu/${id}`);
            setMenuItems(menuItems.filter((item) => item._id !== id));
            toast.success("Menu item deleted successfully");
        } catch (error) {
            toast.error("Failed to delete menu item");
        }
    };

    const openEditModal = (item) => {
        setEditMenuItem(item);
    };

    const closeEditModal = () => {
        setEditMenuItem(null);
    };

    const handleEditMenuItem = async () => {
        try {
            await handleUpdateMenuItem(editMenuItem._id, editMenuItem);
            closeEditModal();
        } catch (error) {
            toast.error("Failed to edit menu item");
        }
    };

    const handleSignOut = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

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
            <p
                className="cursor-pointer bg-blue-600 w-fit px-2 text-sm mb-2 py-1 text-white font-medium rounded-lg"
                onClick={() => navigate("/orders")}
            >
                Place order instead
            </p>
            <div className="mb-4 flex gap-2">
                <TextField
                    label="Name"
                    name="name"
                    value={newMenuItem.name}
                    onChange={handleInputChange}
                    variant="outlined"
                    className="flex-1"
                />
                <TextField
                    label="Category"
                    name="category"
                    value={newMenuItem.category}
                    onChange={handleInputChange}
                    variant="outlined"
                    className="flex-1"
                />
                <TextField
                    label="Price"
                    name="price"
                    type="number"
                    value={newMenuItem.price}
                    onChange={handleInputChange}
                    variant="outlined"
                    className="flex-1"
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCreateMenuItem}
                >
                    Add Menu Item
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
            {menuItems.length === 0 ? (
                <Typography
                    variant="body1"
                    className="text-center text-gray-500"
                >
                    No menu items available
                </Typography>
            ) : (
                <div className="grid grid-cols-[repeat(auto-fit,minmax(350px,1fr))] gap-4">
                    {menuItems.map((item) => (
                        <Card key={item._id} className="p-4">
                            <CardContent>
                                <Typography variant="h6">
                                    {item.name}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="textSecondary"
                                >
                                    {item.category}
                                </Typography>
                                <Typography variant="body1">
                                    ${item.price}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="textSecondary"
                                >
                                    {item.availability
                                        ? "Available"
                                        : "Not Available"}
                                </Typography>
                                <div className="flex gap-2 mt-2">
                                    <Button
                                        variant="contained"
                                        color="warning"
                                        onClick={() =>
                                            handleUpdateMenuItem(item._id, {
                                                ...item,
                                                availability:
                                                    !item.availability,
                                            })
                                        }
                                    >
                                        Toggle Availability
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={() =>
                                            handleDeleteMenuItem(item._id)
                                        }
                                    >
                                        Delete
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        onClick={() => openEditModal(item)}
                                    >
                                        Edit
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
            <Pagination
                count={totalPages}
                page={page}
                onChange={(e, value) => setPage(value)}
                className="mt-4"
            />
            <Typography variant="h4" className="mt-8 mb-4">
                Pending Orders
            </Typography>
            <div className="space-y-4">
                {pendingOrders.map((order) => (
                    <Card key={order._id} className="p-4">
                        <CardContent>
                            <Typography variant="h6">
                                Order #{order._id} - ${order.totalAmount}
                            </Typography>
                            <ul className="mt-2">
                                {order.items.map((item) => (
                                    <li key={item.id}>
                                        {item.name} - ${item.price} x{" "}
                                        {item.quantity}
                                    </li>
                                ))}
                            </ul>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleCompleteOrder(order._id)}
                                className="mt-4"
                            >
                                Complete Order
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
            <Modal
                open={!!editMenuItem}
                onClose={closeEditModal}
                aria-labelledby="edit-menu-item-modal"
                aria-describedby="edit-menu-item-modal-description"
            >
                <Box className="bg-white p-4 rounded shadow-lg mx-auto my-20 flex flex-col gap-4 w-fit">
                    <Typography variant="h6" className="mb-4">
                        Edit Menu Item
                    </Typography>
                    <TextField
                        label="Name"
                        name="name"
                        value={editMenuItem?.name || ""}
                        onChange={handleEditInputChange}
                        variant="outlined"
                        className="mb-2 w-full"
                    />
                    <TextField
                        label="Category"
                        name="category"
                        value={editMenuItem?.category || ""}
                        onChange={handleEditInputChange}
                        variant="outlined"
                        className="mb-2 w-full"
                    />
                    <TextField
                        label="Price"
                        name="price"
                        type="number"
                        value={editMenuItem?.price || 0}
                        onChange={handleEditInputChange}
                        variant="outlined"
                        className="mb-2 w-full"
                    />
                    <div className="flex gap-2">
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleEditMenuItem}
                        >
                            Save
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={closeEditModal}
                        >
                            Cancel
                        </Button>
                    </div>
                </Box>
            </Modal>
        </div>
    );
}
