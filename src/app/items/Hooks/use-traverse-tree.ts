
const useTraverseTree = () => {

    // parent: desired subnode to be updated (or parent)
    const insertNode = (tree: any, parent: string, newItemName: string, newItemValue: string, isFolder: boolean) => {

        // check if we're at desired sub-tree, confirm if subree is folder
        if((tree.name == parent) && (tree.__isFolder == true)) 
        {
            if(isFolder == true)
            {
                // push new empty folder to front
                tree.__items.unshift({
                    name: newItemName,
                    __id: Date.now(),
                    __isFolder: true,
                    __items: []
                });
            }
            else
            {
                // push new file to end
                tree.__items.push({
                    name: newItemName,
                    __id: Date.now(),
                    __isFolder: false,
                    __items: [],
                    // __value: {newItemValue}
                    __value: JSON.parse(newItemValue) 
                });
            }

            return tree;
        }

        // depth first search - look through entire tree to find
        let currentNode = tree.__items.map((item: any) => {
            return insertNode(item, parent, newItemName, newItemValue, isFolder);
        });

        return { ...tree, __items: currentNode };
    }
    
    const deleteNode = (tree: any, id: number) => {

        // check if current parent contains desired deletion id
        const found_idx = tree.__items.findIndex((item: any) => item.__id == id);
        if(found_idx != -1)
        {
            // remove node from parent's __items[]
            tree.__items.splice(found_idx, 1);

            return tree;
        }

        // depth first search - look through entire tree to find
        let currentNode = tree.__items.filter((item: any) => {
            return deleteNode(item, id);
        });

        return { ...tree, __items: currentNode };
    }

    const editNode = (tree: any, id: number, newItemName: string, newItemValue?: string) => {

        // check if we're at desired sub-tree, confirm if subree is folder
        if(tree.__id == id) 
        {
            // edit tree's specific name: folder or file
            tree.name = newItemName;

            // request is to edit an existing file
            if((tree.__isFolder == false) && (newItemName != undefined) && (newItemValue != undefined))
            {
                tree.__value = JSON.parse(newItemValue);
            }

            return tree;
        }

        // depth first search - look through entire tree to find
        let currentNode = tree.__items.map((item: any) => {
            return editNode(item, id, newItemName, newItemValue);
        });

        return { ...tree, __items: currentNode };
    }

    return { insertNode, deleteNode, /*renameNode,*/ editNode }
};

export default useTraverseTree;