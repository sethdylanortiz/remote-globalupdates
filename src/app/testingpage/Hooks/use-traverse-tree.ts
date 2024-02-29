const useTraverseTree = () => {

    // parent: desired subnode to be updated (or parent)
    const insertNode = (tree: any, parent: string, newItemName: string, isFolder: boolean) => {

        // check if we're at desired sub-tree, confirm if subree is folder
        if((tree.name == parent) && (tree.__isFolder == true)) 
        {
            if(isFolder == true)
            {
                // push new empty folder to front
                tree.__items.unshift({
                    name: newItemName,
                    __isFolder: true,
                    __items: []
                });
            }
            // else, add logic for new file, add passing of json editor value

            return tree;
        }

        // depth first search - look through entire tree to find
        let currentNode = tree.__items.map((item: any) => {
            return insertNode(item, parent, newItemName, isFolder);
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

    const renameNode = (tree: any, id: number, newname: string) => {

        // check if we're at desired sub-tree, confirm if subree is folder
        if((tree.__id == id) && (tree.__isFolder == true)) 
        {
            // edit tree's specific name
            tree.name = newname;

            return tree;
        }

        // depth first search - look through entire tree to find
        let currentNode = tree.__items.map((item: any) => {
            return renameNode(item, id, newname);
        });

        return { ...tree, __items: currentNode };
    }

    return { insertNode, deleteNode, renameNode }
};

export default useTraverseTree;