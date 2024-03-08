import { TreeData } from "../services";

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
                    fileValue: null
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
                    fileValue: tree.__value
                });
            }
            return iter;
        };

        // funtion to traverse tree looking for id's to marking change type and add file difference
        // const markTree = (tree: any, differenceType: string, diffItem: TreeData[]) => {
        const markTree = (tree: any, differenceType: string, diffItems: TreeData[]) => {


            // check if current node contains an id in diffItems[]
            const foundIndex = diffItems.findIndex((item: TreeData) => item.id == tree.__id);
            // console.log("foundIndex: " + foundIndex);
            if(foundIndex !== -1)
            {
                tree = {
                    difference: differenceType,
                    ...tree
                };

                if(differenceType == "Edited")
                {
                    tree.__value = diffItems[foundIndex].fileValue;
                }
                return tree;
            }

            let currentNode = tree.__items.map((child: any) => {
                return markTree(child, differenceType, diffItems);
            });

            return { ...tree, __items: currentNode };

            // if(tree.__id == diffItem.id)
            // {
            //     // tree.difference = differenceType;
            //     console.log(differenceType);
            //     tree = {
            //         difference: differenceType,
            //         ...tree
            //     }

            //     if(differenceType == "Edited")
            //     {
            //         tree.__value = diffItem.fileValue;
            //     }

            //     return tree;
            // };

            // let currentNode = tree.__items.map((item: any) => {
            //     return markTree(item, differenceType, diffItem);
            // });

            // return { ...tree, __items: currentNode };
        }

    return { getTreeData, markTree };
};

export default useTraverseTree;



/*

    // https://www.tutorialspoint.com/fetching-object-keys-using-recursion-in-javascript
    const getIds = (tree: any, results = []) => {

        const iter = results;

        // get current tree's keys to iterate
        Object.keys(tree).forEach(key => {

            // check if current key is __id
            const value = tree[key];
            if(key == "__id")
            {
                iter.push(value);
            }
            // else, check if key value is an object and can be iterated
            else if (typeof value === "object")
            {
                getIds(value, iter);
            }
        });

        return iter;
    };

*/