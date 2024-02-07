import React, { createContext, useContext } from "react";

// services
import { getItemsDatabase } from "../app/merge/services";
import { Item } from "../app/merge/services";

interface InterfaceItemsContext {
    // newItems: Item[];
    // syncedItemsDifferentEntry: Item[];
    // deleted Item: Item[];
    // addItem();
    // updateItem();
    // deleteItem();
    items: Item[];
    addItem: (Filename: string) => void;
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
    const items: Item[] =  [{Filename: "hi", Entry: "bye"}];
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