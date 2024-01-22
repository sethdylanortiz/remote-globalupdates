import React, { createContext, useContext } from "react";

// servies
import { getItemsDatabase } from "../merge/services";
import { Item } from "../merge/services";

interface InterfaceItemsContext {
    // newItems: Item[];
    // syncedItemsDifferentEntry: Item[];
    // deleted Item: Item[];
    // addItem();
    // updateItem();
    // deleteItem();
    items: Item[];
    addItem: (FileName: string) => void;
}

// export const ItemsContext = createContext<Item | undefined>(undefined);
export const ItemsContext = createContext<InterfaceItemsContext>({
    // default values
    items: [],
    addItem(item){}
});

export const useItemsContext = () => {
    const context = useContext(ItemsContext)
    if(!context)
    {
        throw new Error("useItemsContext must be used within an ItemsContextProvider");
    }
    return context;
};

export const ItemsContextProvider = ({children}: {children:React.ReactNode}) => {
    // get newItems, syncedItems, deletedItems
    const items: Item[] =  [{FileName: "hi", entry: "bye"}];
    const addItem = (filename: string) => {
        // call services.ts' addItem()
        console.log("ItemsContext.tsx - addItem()");
    };

    return(
        <ItemsContext.Provider value = {{items, addItem}}>
            {children}
        </ItemsContext.Provider>
    );
};