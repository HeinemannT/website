import { useState, useCallback } from 'react';
import { FileSystemItem, Category, Policy } from '../types';
import { createDefaultCategory, createDefaultPolicy } from '../utils';

export const useFileSystem = (initialItems: FileSystemItem[]) => {
    const [items, setItems] = useState<FileSystemItem[]>(initialItems);

    // Recursively find an item
    const findItem = useCallback((id: string, list: FileSystemItem[]): FileSystemItem | null => {
        for(const item of list) {
            if (item.id === id) return item;
            if (item.itemType === 'Category') {
                const found = findItem(id, (item as Category).children);
                if (found) return found;
            }
        }
        return null;
    }, []);

    // Recursively update an item
    const updateItemInTree = (list: FileSystemItem[], id: string, updater: (i: FileSystemItem) => FileSystemItem): FileSystemItem[] => {
        return list.map(item => {
            if (item.id === id) return updater(item);
            if (item.itemType === 'Category') {
                return { ...item, children: updateItemInTree((item as Category).children, id, updater) } as Category;
            }
            return item;
        });
    };

    // Recursively delete an item
    const deleteItemInTree = (list: FileSystemItem[], id: string): FileSystemItem[] => {
        return list.filter(item => item.id !== id).map(item => {
            if (item.itemType === 'Category') {
                return { ...item, children: deleteItemInTree((item as Category).children, id) } as Category;
            }
            return item;
        });
    };

    // Recursively add an item
    const addItemToTree = (list: FileSystemItem[], parentId: string, newItem: FileSystemItem): FileSystemItem[] => {
        return list.map(item => {
            if (item.id === parentId && item.itemType === 'Category') {
                return { ...item, children: [...(item as Category).children, newItem], collapsed: false } as Category;
            }
            if (item.itemType === 'Category') {
                return { ...item, children: addItemToTree((item as Category).children, parentId, newItem) } as Category;
            }
            return item;
        });
    };

    const updateItem = (updated: FileSystemItem) => {
        setItems(prev => updateItemInTree(prev, updated.id, () => updated));
    };

    const deleteItem = (id: string) => {
        setItems(prev => deleteItemInTree(prev, id));
    };

    const addItem = (parentId: string, type: 'Category' | 'Policy') => {
        const newItem = type === 'Category' ? createDefaultCategory() : createDefaultPolicy();
        setItems(prev => addItemToTree(prev, parentId, newItem));
        return newItem;
    };

    const addRootItem = (type: 'Category' | 'Policy') => {
        const newItem = type === 'Category' ? createDefaultCategory("New Root Folder") : createDefaultPolicy();
        setItems(prev => [...prev, newItem]);
        return newItem;
    };

    const toggleCategory = (id: string) => {
        setItems(prev => updateItemInTree(prev, id, (item) => ({ ...item, collapsed: !(item as Category).collapsed } as Category)));
    };

    return {
        items,
        setItems,
        findItem: (id: string) => findItem(id, items),
        updateItem,
        deleteItem,
        addItem,
        addRootItem,
        toggleCategory
    };
};