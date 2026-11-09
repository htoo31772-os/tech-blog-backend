import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import categoryService from "../services/categoryService";

const useCategoryForm = ({ editingCategory, onSaved }) => {
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [validationErrors, setValidationErrors] = useState({});
    const [serverErrors, setServerErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Load Editing Category
    useEffect(() => {
        if (editingCategory) {
            setName(editingCategory.name);
            setSlug(editingCategory.slug);
        } else {
            setName("");
            setSlug("");
        }
        setValidationErrors({});
        setServerErrors({});
    }, [editingCategory]);

    // Handle Name Change
    const handleNameChange = (value) => {
        setName(value);

        setValidationErrors(prev => ({
            ...prev,
            name: ""
        }));

        setServerErrors(prev => ({
            ...prev,
            name: ""
        }));


        if (!editingCategory) {
            setSlug(
                value
                    .toLowerCase()
                    .trim()
                    .replace(/\s+/g, "-")
                    .replace(/[^\w-]/g, "")
            );
        }

    };

    // Handle Slug Change
    const handleSlugChange = (value) => {
        setSlug(value);

        setValidationErrors(prev => ({
            ...prev,
            slug: ""
        }));

        setServerErrors(prev => ({
            ...prev,
            slug: ""
        }));
    };

    // Validate Form
    const validateForm = () => {
        const errors = {};

        if (!name.trim()) {
            errors.name = "Category name field is required";
        }

        if (!slug.trim()) {
            errors.slug = "Slug name field is required";
        }

        setValidationErrors(errors);

        return Object.keys(errors).length === 0;
    };

    // Create or Update Category
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);
        setServerErrors({});

        const data = {
            name: name.trim(),
            slug: slug.trim()
        };

        try {
            if (editingCategory) {
                await categoryService.updateCategory(
                    editingCategory.id,
                    data
                );
            } else {
                await categoryService.createCategory(data);
            }

            await onSaved();
            setName("");
            setSlug("");
            setValidationErrors({});
            setServerErrors({});

            toast.success(
                editingCategory
                    ? "Category ပြင်ဆင်ပြီးပါပြီ။"
                    : "Category အသစ်ထည့်ပြီးပါပြီ။"
            );

        } catch (err) {
            console.error("Save category error:", err);
            if (err.response?.status === 422) {
                setServerErrors(err.response.data.errors || {});
            } else {
                toast.error("Category သိမ်းဆည်းမှု မအောင်မြင်ပါ။");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        name,
        slug,
        validationErrors,
        serverErrors,
        isSubmitting,
        handleNameChange,
        handleSlugChange,
        handleSubmit
    };
};

export default useCategoryForm;
