import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Edit, Trash2, Save, X, List } from "lucide-react";

interface Category {
  id: number;
  name: string;
  itemCount: number;
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([
    { id: 1, name: "Starters", itemCount: 8 },
    { id: 2, name: "Main Course", itemCount: 15 },
    { id: 3, name: "Drinks", itemCount: 12 },
    { id: 4, name: "Desserts", itemCount: 6 },
  ]);

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editCategoryName, setEditCategoryName] = useState("");

  const handleAddNew = () => {
    if (newCategoryName.trim()) {
      const newCategory: Category = {
        id: Math.max(...categories.map((c) => c.id)) + 1,
        name: newCategoryName.trim(),
        itemCount: 0,
      };
      setCategories([...categories, newCategory]);
      setNewCategoryName("");
      setIsAddingNew(false);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingId(category.id);
    setEditCategoryName(category.name);
  };

  const handleSaveEdit = () => {
    if (editCategoryName.trim() && editingId) {
      setCategories(
        categories.map((cat) =>
          cat.id === editingId
            ? { ...cat, name: editCategoryName.trim() }
            : cat,
        ),
      );
      setEditingId(null);
      setEditCategoryName("");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditCategoryName("");
  };

  const handleDelete = (id: number) => {
    if (
      window.confirm(
        "Are you sure you want to delete this category? All items in this category will also be deleted.",
      )
    ) {
      setCategories(categories.filter((cat) => cat.id !== id));
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">Categories</h1>
          <p className="text-secondary">Manage menu categories</p>
        </div>
        <button
          onClick={() => setIsAddingNew(true)}
          className="btn btn-primary"
          disabled={isAddingNew}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </button>
      </div>

      {/* Add New Category */}
      {isAddingNew && (
        <div className="card mb-6">
          <h3 className="font-semibold text-primary mb-3">Add New Category</h3>
          <div className="flex space-x-3">
            <input
              type="text"
              placeholder="Category name"
              className="form-input flex-1"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddNew()}
              autoFocus
            />
            <button
              onClick={handleAddNew}
              className="btn btn-primary"
              disabled={!newCategoryName.trim()}
            >
              <Save className="w-4 h-4 mr-1" />
              Save
            </button>
            <button
              onClick={() => {
                setIsAddingNew(false);
                setNewCategoryName("");
              }}
              className="btn btn-secondary"
            >
              <X className="w-4 h-4 mr-1" />
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category.id} className="card">
            <div className="flex items-center justify-between mb-3">
              {editingId === category.id ? (
                <input
                  type="text"
                  className="form-input text-lg font-semibold"
                  value={editCategoryName}
                  onChange={(e) => setEditCategoryName(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSaveEdit()}
                  autoFocus
                />
              ) : (
                <h3 className="text-lg font-semibold text-primary">
                  {category.name}
                </h3>
              )}

              <div className="flex space-x-2">
                {editingId === category.id ? (
                  <>
                    <button
                      onClick={handleSaveEdit}
                      className="w-8 h-8 bg-green rounded-full flex items-center justify-center text-white hover:bg-green"
                    >
                      <Save className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-secondary hover:bg-border"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEdit(category)}
                      className="w-8 h-8 bg-orange rounded-full flex items-center justify-center text-white hover:bg-orange"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="w-8 h-8 bg-red rounded-full flex items-center justify-center text-white hover:bg-red"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="text-center py-4">
              <div className="w-16 h-16 bg-orange rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-white">
                  {category.itemCount}
                </span>
              </div>
              <p className="text-sm text-secondary">Items in this category</p>
            </div>

            <div className="flex space-x-2 mt-4">
              <Link
                to={`/admin/items?category=${category.name}`}
                className="btn btn-secondary btn-sm flex-1 text-center"
              >
                View Items
              </Link>
              <Link
                to={`/admin/items?action=add&category=${category.id}`}
                className="btn btn-primary btn-sm flex-1 text-center"
              >
                Add Item
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {categories.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <List className="w-12 h-12 text-secondary" />
          </div>
          <h3 className="text-lg font-semibold text-primary mb-2">
            No Categories Yet
          </h3>
          <p className="text-secondary mb-4">
            Create your first menu category to get started
          </p>
          <button
            onClick={() => setIsAddingNew(true)}
            className="btn btn-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add First Category
          </button>
        </div>
      )}
    </div>
  );
}
