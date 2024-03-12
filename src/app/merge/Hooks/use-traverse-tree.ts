import { TreeData, TreeDataEdited } from "../services";

const useTraverseTree = () => {

    // https://www.tutorialspoint.com/fetching-object-keys-using-recursion-in-javascript
    // https://stackoverflow.com/questions/52423842/what-is-not-assignable-to-parameter-of-type-never-error-in-typescript
    const getTreeData = (tree: any, treeData: any[] = [], parentId?: number) => {
        const iter = treeData;

        if(tree.__isFolder)
        {
            iter.push({
                parentId: parentId,
                id: tree.__id,
                name: tree.name,
                fileValue: null,
            });

            for(const index in tree.__items)
            {
                const item = tree.__items[index];
                getTreeData(item, iter, tree.__id);
            }
        }
        else
        {
            iter.push({
                parentId: parentId,
                id: tree.__id,
                name: tree.name,
                fileValue: JSON.stringify(tree.__value), // stringify to avoid address compare
            });
        }
        return iter;
    };

    const markTree = (tree: any, differenceType: string, diffItems: any) => {
        
        if(differenceType === "Added")
        {
            diffItems.map((item: TreeData) => {
                if(item.parentId === tree.__id)
                {
                    // create newNodeData to add onto other tree
                    if(item.fileValue == null)
                    {
                        tree.__items.unshift({ 
                            difference: differenceType, 
                            name: item.name,
                            __id: item.id, 
                            __isFolder: true, 
                            __items: []
                        });
                    }
                    else
                    {
                        tree.__items.unshift({ 
                            difference: differenceType, 
                            name: item.name,
                            __id: item.id, 
                            __isFolder: false, 
                            __items: [], 
                            __value: JSON.parse(item.fileValue) 
                        });
                    }
                }
            });
        }
        else
        {
            // check if difference
            const foundIndex = diffItems.findIndex((item: TreeData | TreeDataEdited) => item.id === tree.__id);            
            if(foundIndex !== -1)
            {
                // mark tree with difference
                tree = {
                    difference: differenceType,
                    ...tree
                };

                const diffItem = diffItems[foundIndex];

                if(differenceType === "Edited")
                {
                    if(tree.__isFolder === true)
                    {
                        tree = {
                            __devFolderName: diffItem.devFolderName,
                            ...tree
                        };
                    }
                    else
                    {
                        // used for file comparison <DiffViewer/>
                        tree = {
                            __devFileValue: JSON.parse(diffItems[foundIndex].devFileValue),
                            // for JSON viewer edited fileNames
                            __devFileName: diffItems[foundIndex].devFileName,
                            ...tree
                        };
                    }
                }
            };
        }

        let currentNode = tree.__items.map((child: any) => {
            return markTree(child, differenceType, diffItems);
        });

        // return tree obj with concat __items
        return { ...tree, __items: currentNode };
    };


    return { getTreeData, markTree };
};

export default useTraverseTree;