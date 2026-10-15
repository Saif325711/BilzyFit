import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useData } from '../context/DataContext';
import { addDiet, updateDiet } from '../data/services';
import Modal from './ui/Modal';
import Input from './ui/Input';
import Textarea from './ui/Textarea';
import Button from './ui/Button';

const emptyMeal = {
  type: '',
  items: '',
  calories: '',
  protein: '',
  carbs: '',
  fats: '',
};

const emptyForm = {
  name: '',
  description: '',
  meals: [{ ...emptyMeal }],
};

export default function DietModal({ open, onClose, diet }) {
  const { data, setData } = useData();
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const isEdit = Boolean(diet);

  useEffect(() => {
    if (open) {
      setForm(
        diet
          ? { ...emptyForm, ...diet, meals: diet.meals?.length ? diet.meals : [{ ...emptyMeal }] }
          : emptyForm
      );
    }
  }, [open, diet]);

  const handleChange = (field, value) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleMealChange = (index, field, value) => {
    setForm((f) => {
      const meals = [...f.meals];
      meals[index] = { ...meals[index], [field]: value };
      return { ...f, meals };
    });
  };

  const addMeal = () =>
    setForm((f) => ({ ...f, meals: [...f.meals, { ...emptyMeal }] }));

  const removeMeal = (index) =>
    setForm((f) => ({
      ...f,
      meals: f.meals.filter((_, i) => i !== index),
    }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const validMeals = form.meals.filter((m) => m.type.trim() && m.items.trim());
    if (!form.name.trim() || validMeals.length === 0) {
      alert('Please enter a diet name and at least one meal.');
      return;
    }
    setLoading(true);
    const payload = { ...form, meals: validMeals };
    if (isEdit) {
      const { data: next } = updateDiet(data, diet.id, payload);
      setData(next);
    } else {
      const { data: next } = addDiet(data, payload);
      setData(next);
    }
    setLoading(false);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit Diet Plan' : 'Create Diet Plan'}
      size="lg"
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="diet-form" disabled={loading}>
            {loading ? 'Saving...' : isEdit ? 'Update Diet' : 'Save Diet'}
          </Button>
        </>
      }
    >
      <form id="diet-form" onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Diet Name"
          value={form.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="e.g. Muscle Gain Diet"
          required
        />
        <Textarea
          label="Description"
          value={form.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Goal and notes for this plan"
          rows={3}
        />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-gray-900">Meals</h4>
            <Button
              type="button"
              size="sm"
              variant="outline"
              icon={Plus}
              onClick={addMeal}
            >
              Add Meal
            </Button>
          </div>

          {form.meals.map((meal, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-gray-200 bg-gray-50 p-4"
            >
              <div className="mb-3 grid gap-3 sm:grid-cols-2">
                <Input
                  label={idx === 0 ? 'Meal Type' : undefined}
                  value={meal.type}
                  onChange={(e) => handleMealChange(idx, 'type', e.target.value)}
                  placeholder="Breakfast"
                />
                <Input
                  label={idx === 0 ? 'Items' : undefined}
                  value={meal.items}
                  onChange={(e) => handleMealChange(idx, 'items', e.target.value)}
                  placeholder="Oats + Eggs + Banana"
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-4">
                <Input
                  label={idx === 0 ? 'Calories' : undefined}
                  type="number"
                  min={0}
                  value={meal.calories}
                  onChange={(e) => handleMealChange(idx, 'calories', e.target.value)}
                  placeholder="kcal"
                />
                <Input
                  label={idx === 0 ? 'Protein (g)' : undefined}
                  type="number"
                  min={0}
                  value={meal.protein}
                  onChange={(e) => handleMealChange(idx, 'protein', e.target.value)}
                  placeholder="P (g)"
                />
                <Input
                  label={idx === 0 ? 'Carbs (g)' : undefined}
                  type="number"
                  min={0}
                  value={meal.carbs}
                  onChange={(e) => handleMealChange(idx, 'carbs', e.target.value)}
                  placeholder="C (g)"
                />
                <Input
                  label={idx === 0 ? 'Fats (g)' : undefined}
                  type="number"
                  min={0}
                  value={meal.fats}
                  onChange={(e) => handleMealChange(idx, 'fats', e.target.value)}
                  placeholder="F (g)"
                />
              </div>
              {form.meals.length > 1 && (
                <div className="mt-3 flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeMeal(idx)}
                    className="inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Remove Meal
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </form>
    </Modal>
  );
}
