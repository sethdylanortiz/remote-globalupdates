/*
todo: 
    - check if folder/filename already exists in **current directory
*/
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
            // else, add logic for new file (__value) instead of (__items)

            return tree;
        }

        // depth first search - look through entire tree to find
        let currentNode = tree.__items.map((item: any) => {
            return insertNode(item, parent, newItemName, isFolder);
        });

        return { ...tree, __items: currentNode };
    }

    return { insertNode }
};

export default useTraverseTree;