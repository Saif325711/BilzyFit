import { useState, useMemo, useEffect } from 'react';
import { useData } from '../context/DataContext';
import Modal from './ui/Modal';
import Input from './ui/Input';
import Button from './ui/Button';

export default function AssignModal({ open, onClose, title, assignedIds = [], onAssign }) {
  const { data } = useData();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(new Set(assignedIds));

  useEffect(() => {
    setSelected(new Set(assignedIds));
    setSearch('');
  }, [open, assignedIds]);

  const members = useMemo(() => {
    const term = search.toLowerCase();
    return data.members.filter(
      (m) =>
        m.fullName.toLowerCase().includes(term) ||
        m.mobile.includes(search) ||
        m.memberId.toLowerCase().includes(term)
    );
  }, [data.members, search]);

  const toggle = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === members.length) setSelected(new Set());
    else setSelected(new Set(members.map((m) => m.id)));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAssign(Array.from(selected));
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title || 'Assign to Members'}
      size="md"
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="assign-form">
            Assign ({selected.size})
          </Button>
        </>
      }
    >
      <form id="assign-form" onSubmit={handleSubmit} className="space-y-4">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search members..."
        />
        <div className="flex items-center justify-between text-sm">
          <label className="flex cursor-pointer items-center gap-2 font-medium text-gray-700">
            <input
              type="checkbox"
              checked={members.length > 0 && selected.size === members.length}
              onChange={toggleAll}
            />
            Select All
          </label>
          <span className="text-gray-500">{selected.size} selected</span>
        </div>
        <div className="max-h-72 space-y-2 overflow-y-auto rounded-xl border border-gray-200 p-2">
          {members.map((m) => (
            <label
              key={m.id}
              className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 hover:bg-gray-50"
            >
              <input
                type="checkbox"
                checked={selected.has(m.id)}
                onChange={() => toggle(m.id)}
              />
              <span className="flex-1 text-sm font-medium text-gray-800">
                {m.fullName}
              </span>
              <span className="text-xs text-gray-500">{m.memberId}</span>
            </label>
          ))}
          {members.length === 0 && (
            <p className="py-4 text-center text-sm text-gray-500">No members found.</p>
          )}
        </div>
      </form>
    </Modal>
  );
}
