import { useEffect, useState } from "react";
import categoryService from "../services/categoryService";
import CategoryForm from "./component/categoryForm";
import CategoryTable from "./component/categoryTable";

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingCategory, setEditingCategory] = useState(null);

    // Fetch Categories
    const fetchCategories = async () => {
        try {
            const data = await categoryService.getCategories();
            setCategories(data);
            setError(null)
        } catch (err) {
            console.error("Fetch categories error:", err);
            setError("Categories ယူလို့မရပါ။");
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchCategories();
    }, []);

    // Select Category to Edit
    const handleEdit = (category) => {
        setEditingCategory(category);
    };

    // Cancel Edit
    const handleCancel = () => {
        setEditingCategory(null);
    };

    // Update Category List after Create / Update
    const handleCategorySaved = async () => {
        await fetchCategories();
        setEditingCategory(null);
    };

    // Update Category List after Delete
    const handleCategoryDeleted =async () => {
        await fetchCategories();
    };

    return (
        <div className="row">

            <CategoryForm
                editingCategory={editingCategory}
                onSaved={handleCategorySaved}
                onCancel={handleCancel}
            />
            <CategoryTable
                categories={categories}
                isLoading={isLoading}
                error={error}
                onEdit={handleEdit}
                onDeleted={handleCategoryDeleted}
            />
        </div>
    );
};

export default Categories;
